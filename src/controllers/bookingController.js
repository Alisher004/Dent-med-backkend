const { Op } = require('sequelize');
const Booking = require('../models/Booking');
const Doctor = require('../models/Doctor');
const ClinicSettings = require('../models/ClinicSettings');

function toMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}
function toHHMM(mins) {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

async function generateDailySlots(date, doctor) {
  const settings = await ClinicSettings.findOne({ where: { id: 1 } });
  if (!settings) return [];

  // Check working day
  const day = new Date(date + 'T00:00:00').getDay();
  if (!settings.workingDays.includes(day)) return [];

  // Holidays
  if (settings.holidays.includes(date)) return [];

  const start = toMinutes(settings.startTime);
  const end = toMinutes(settings.endTime);
  const step = settings.slotIntervalMin;

  // Existing bookings for doctor on that date
  const booked = await Booking.findAll({
    where: {
      doctorId: doctor.id,
      date,
      status: { [Op.in]: ['pending','confirmed'] }
    },
    attributes: ['time']
  });
  const bookedTimes = new Set(booked.map(b => b.time));

  const slots = [];
  for (let t = start; t + step <= end; t += step) {
    const time = toHHMM(t);
    if (bookedTimes.has(time)) continue;
    slots.push(time);
  }
  return slots;
}

const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.params;
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor || !doctor.isActive) return res.status(404).json({ message: 'Doctor not found' });

    const slots = await generateDailySlots(date, doctor);
    return res.json({ success: true, data: { date, slots } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const { doctorId, date, time, reason, notes } = req.body;
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor || !doctor.isActive) return res.status(404).json({ message: 'Doctor not found' });

    // Validate time inside available slots
    const slots = await generateDailySlots(date, doctor);
    if (!slots.includes(time)) return res.status(400).json({ message: 'Time not available' });

    const booking = await Booking.create({
      userId: req.user.id,
      doctorId,
      date,
      time,
      status: 'pending',
      totalAmount: doctor.consultationFee,
      reason: reason || null,
      notes: notes || null
    });

    res.status(201).json({ success: true, message: 'Booking created', data: booking });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const b = await Booking.findOne({ where: { id, userId: req.user.id } });
    if (!b) return res.status(404).json({ message: 'Booking not found' });
    if (b.status === 'cancelled') return res.status(400).json({ message: 'Already cancelled' });

    await b.update({ status: 'cancelled' });
    res.json({ success: true, message: 'Booking cancelled' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

const listMyBookings = async (req, res) => {
  try {
    const list = await Booking.findAll({ where: { userId: req.user.id }, order: [['date','DESC'], ['time','DESC']] });
    res.json({ success: true, data: list });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Admin can confirm/complete
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['pending','confirmed','completed','cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const b = await Booking.findByPk(id);
    if (!b) return res.status(404).json({ message: 'Booking not found' });

    await b.update({ status });
    res.json({ success: true, message: 'Status updated', data: b });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

module.exports = { getAvailableSlots, createBooking, cancelBooking, listMyBookings, updateStatus };
