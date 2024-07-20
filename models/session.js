const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "2023/2024"
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
