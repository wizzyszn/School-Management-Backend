const { initializeCounter } = require("../functions/counter");
const StudentModel = require("../models/student");
const ClassModel = require("../models/class");
const {generateStudentId} = require('./updateCounter')
initializeCounter()
//create or admit a student
module.exports.createStudent = async(req,res) =>{
    const {firstName,lastName,dateOfBirth,gender,grade,classId,parentContact,emergencyContact,profilePicture,admissionYear} = req.body;

    try{
        // Check if classId is provided and valid
        if(classId){
            const classData = await ClassModel.findById(classId);
            if (!classData) {
                return res.status(400).json({ message: "Class not found" });
            }
            if(classData.name !== grade) {
                return res.status(400).json({message : "Cannot add student to this class"})}
        }
             // Generate a unique student ID
        const studentId = await generateStudentId();
             // Create the student
        const response = await StudentModel.create({
            firstName,
            lastName,
            studentId,
            dateOfBirth,
            admissionYear,
            gender, 
            grade, 
            classId,
            parentContact,
            emergencyContact,
            profilePicture
        });
                // If classId is valid, update the class with the new student
        if(classId){
            await ClassModel.findByIdAndUpdate(classId,{$addToSet : {students : response._id}},{new : true})   
        }

        // Populate the response with classId and subjects
        const data = await response.populate("classId subjects")
        return res.status(200).json(data)
    }catch(err){
        res.status(500).json({message : err.message})
    }   
}
// Remove a student
module.exports.removeStudent = async (req, res) => {
    const { studentId } = req.body;
    try {
        // Find and delete the student
        const student = await StudentModel.findOneAndDelete({ studentId });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // If the student has a classId, remove the student from the class
        if (student.classId) {
            await ClassModel.findByIdAndUpdate(
                student.classId,
                { $pull: { students: student._id } },
                { new: true }
            );
        }

        return res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Remove many students
module.exports.removeManyStudents = async (req, res) => {
    const { studentIds } = req.body;
    try {
        // Find all students that need to be deleted
        const students = await StudentModel.find({ _id: { $in: studentIds } });

        // Update the respective classes to remove the students
        await Promise.all(
            students.map(async (student) => {
                if (student.classId) {
                    await ClassModel.findByIdAndUpdate(
                        student.classId,
                         { $pull: { students: student._id } },
                        { new: true }
                    );
                }
            })
        );

        // Delete the students
        await StudentModel.deleteMany({ _id: { $in: studentIds } });

        return res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//add subjects to a student
module.exports.addSubjects = async(req,res) =>{
    const {studentId, subjects} = req.body
    try{
        const response = await StudentModel.findByIdAndUpdate(studentId,{
            $addToSet : {subjects : {$each : subjects}}
        },{new : true}).populate("subjects");
        if(!response) return res.status(400).json({message : "Student not found"})
        res.status(200).json(response)
    }catch(err){
        res.status(500).json({message : err.message})
    };
}
//remove subjects from a student
module.exports.removeSubjects = async(req,res) =>{
    const {studentId, subjects} = req.body
    try{
        const response = await StudentModel.findByIdAndUpdate(studentId,{$pull : {subjects : {$in : subjects}}}, {new : true}).populate("subjects");
        if(!response) return res.json({message : 'Student not found'})
        res.status(200).json(response)
    }catch(err){
        res.status(500).json({message : err.message})
    }
}
// get subjects for a specific student
module.exports.getStudentSubjects = async (req, res) => {
    const { studentId } = req.params;

    try {
        const student = await StudentModel.findOne({ studentId }).select("subjects").populate('subjects');

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json(student.subjects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all students by admission year
module.exports.getStudentsByAdmissionYear = async (req, res) => {
  const { year } = req.query;

  if (!year || isNaN(year)) {
    return res.status(400).json({ message: 'Invalid year provided' });
  }

  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);

  try {
    const students = await StudentModel.find({
      admissionYear: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate("classId")
    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found for this admission year' });
    }

    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
