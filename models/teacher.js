const mongoose = require('mongoose')
const teacherSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    classAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }, // New field for tracking assigned class
    contact: {
      phone: { type: String },
      email: { type: String, required: true },
      address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zip: { type: String }
      }
    },
    roles: {
      type: [{ type: String, enum: ['classTeacher', 'subjectTeacher'] }],
      required: true
    },
    password: {
      type: String, 
      required: true
    },
    profilePicture: {
      type: String // URL to profile picture
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Teacher', teacherSchema)
;
