const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true, enum : ["JSS1", "JSS2", "JSS3", "SSS1", "SSS2","SSS3"]},
  faction: { type: String, required: true, enum : ["A","B","C"]},
  classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
}, { timestamps: true });
module.exports = mongoose.model('Class', classSchema);