const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }],
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
}, { timestamps: true });
module.exports = mongoose.model('Subject', subjectSchema);