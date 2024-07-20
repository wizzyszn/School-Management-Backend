const mongoose = require('mongoose')

const { Schema } = mongoose

const studentSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    studentId: { type: String, required: true, unique: true },
    dateOfBirth: { type: Date, required: true },
    admissionYear: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    grade: {
      type: String,
      required: true,
      enum: ['JSS1', 'JSS2', 'JSS3', 'SSS1', 'SSS2', 'SSS3']
    },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    parentContact: [
      {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        address: {
          street: { type: String },
          city: { type: String },
          state: { type: String },
          zip: { type: String }
        }
      }
    ],
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
      relationship: { type: String }
    },
    profilePicture: {
      type: String // URL to profile picture
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Student', studentSchema)
