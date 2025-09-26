const ClinicSettings = require('../models/ClinicSettings');

const getSettings = async (req, res) => {
  try {
    const settings = await ClinicSettings.findOne({ where: { id: 1 } });
    res.json({ success: true, data: settings });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

const upsertSettings = async (req, res) => {
  try {
    const payload = req.body;
    const [settings] = await ClinicSettings.upsert({ id: 1, ...payload }, { returning: true });
    res.json({ success: true, message: 'Settings saved', data: settings });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

module.exports = { getSettings, upsertSettings };
