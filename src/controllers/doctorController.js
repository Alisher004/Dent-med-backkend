const Doctor = require('../models/Doctor');

const listDoctors = async (req, res) => {
  try {
    const docs = await Doctor.findAll({ where: { isActive: true }, attributes: { exclude: ['passwordHash'] } });
    res.json({ success: true, data: docs });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

const getDoctor = async (req, res) => {
  try {
    const doc = await Doctor.findByPk(req.params.id, { attributes: { exclude: ['passwordHash'] } });
    if (!doc) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ success: true, data: doc });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Admin update doctor availability
const updateDoctor = async (req, res) => {
  try {
    const doc = await Doctor.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Doctor not found' });
    await doc.update(req.body);
    res.json({ success: true, message: 'Doctor updated', data: doc });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

module.exports = { listDoctors, getDoctor, updateDoctor };
