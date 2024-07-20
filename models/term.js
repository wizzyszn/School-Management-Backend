const mongoose = require('mongoose');

const termSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "First Term"
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Term', termSchema);
