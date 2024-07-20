const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  grade: { type: String, required: true, enum : ["JSS1", "JSS2", "JSS3", "SSS1","SS2", "SS3" ] },
  term: { type: mongoose.Schema.Types.ObjectId, ref: 'Term', required: true },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  assessments: {
    exam: { type: Number, required: true, max: 60 },
    firstTest: { type: Number, required: true, max: 15 },
    secondTest: { type: Number, required: true, max: 15 },
    assignment: { type: Number, required: true, max: 10 },
  },
  total: { type: Number, required: true },
  gradeLetter: { type: String, required: true },
}, { timestamps: true });

assessmentSchema.pre('save', function(next) {
  const total = this.assessments.exam + this.assessments.firstTest + this.assessments.secondTest + this.assessments.assignment;
  this.total = total;

  if (total >= 70 && total <= 100) {
    this.gradeLetter = 'A';
  } else if (total >= 60 && total < 70) {
    this.gradeLetter = 'B';
  } else if (total >= 50 && total < 60) {   
    this.gradeLetter = 'C';
  } else if (total >= 40 && total < 50) {
    this.gradeLetter = 'D';
  } else if (total >= 30 && total < 40) {
    this.gradeLetter = 'E';
  } else {
    this.gradeLetter = 'F';
  }

  next();
});

module.exports = mongoose.model('Assessment', assessmentSchema);
