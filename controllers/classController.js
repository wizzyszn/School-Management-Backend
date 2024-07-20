    //create a class
    const ClassModel = require('../models/class');
    const SubjectModel = require('../models/subject');
    const StudentModel = require('../models/student');
    const TeacherModel = require('../models/teacher');
    module.exports.createClass = async(req,res) =>{
        const {name,faction,classTeacher,students,subjects} = req.body;
        if(!name) return res.status(400).json({message : "Name is required"});
        if(!faction) return res.status(400).json({message : "Faction is required"});
        
        try{
            const checkSubject = await ClassModel.findOne({name, faction});
            if(checkSubject) return res.status(400).json("Class already exist")
            const response = await ClassModel.create({
                name,
                faction,    
                classTeacher,
                students,
                subjects
            })
            const populatedData = await response.populate("classTeacher students subjects")
            if(subjects && subjects.length > 0){
                await Promise.all(subjects.map(async(subjectId)=>{
                        await SubjectModel.findByIdAndUpdate(subjectId,{
                            $addToSet : {classes : response._id}
                        },{new : true})
                }))}
            if(students && students.length > 0){
                await Promise.all(students.map(async(studentId)=>{
                        await StudentModel.findByIdAndUpdate(studentId,
                           { $addToSet: { classes: response._id }}
                        ,{new : true})
                }))}
            
            res.status(200).json(populatedData)

        }catch(err){
            res.status(500).json({message : err.message})
        }
    };

//update students
module.exports.updateStudents = async (req, res) => {
    const { classId, studentIds } = req.body;

    try {
          // Find the class to be updated
          const classData = await ClassModel.findById(classId);
          if (!classData) {
              return res.status(400).json({ message: "Class not found" });
          }
            // Check if all students' grades match the class name
        for(const studentId of studentIds){
            const student = await StudentModel.findById(studentId);
            if (!student) {
                return res.status(400).json({ message: `Student with ID ${studentId} not found` });
            }
            if(student.grade !== classData.name) return res.status(400).json({message :  `Cannot add ${student.firstName} to this class due to grade mismatch`});
        }
         // Update the class to include the students
         const updatedClass = await ClassModel.findByIdAndUpdate(classId,{$addToSet : {students : {$each : studentIds}}},{new :true}).populate("students");
         await Promise.all(studentIds.map(async(studentId) =>{
            await StudentModel.findByIdAndUpdate(studentId,{classId : updatedClass._id},{new : true})
         }));
         res.status(200).json(updatedClass);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//update subjects
module.exports.updateSubjects = async (req, res) => {
    const { classId, subjectIds } = req.body;
    try {
        const updatedClass = await ClassModel.findByIdAndUpdate(
            classId,
            {$addToSet : {subjects: {$each : subjectIds} }},
            { new: true }  // Return the updated document
        ).populate('subjects');
        if (!updatedClass) {
            return res.status(404).json({ message: 'Class not found' });
        }
        // Update each SubjectModel to include the new class
        await Promise.all(subjectIds.map(async (subjectId) => {
            await SubjectModel.findByIdAndUpdate(
                subjectId,
                { $addToSet: { classes: updatedClass._id } },
                { new: true }
            );
        }));
        res.status(200).json(updatedClass);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//assign a class teacher
module.exports.assignClassTeacher = async(req,res) =>{
    const {classTeacher,classId} =req.body;
    try{
        const response = await ClassModel.findByIdAndUpdate(classId, {
            classTeacher
        }, {new : true}).populate("classTeacher");
        console.log("response:", response);
        if(!response) return res.status(400).json({message : "class not found"})
        // Update each teacher to add this subject to their list
            await TeacherModel.findByIdAndUpdate(
                classTeacher,
                { $addToSet: {roles : "classTeacher"},
                classAssigned : classId},

                { new: true,upsert : true }
            )
 
        res.status(200).json(response);
    }catch(err){
      res.status(500).json({message : err.message})
    }
  }
 // Remove students from a class
module.exports.removeStudents = async (req, res) => {
    const { classId, studentIds } = req.body;

    try {
        // Remove students from the class
        const updatedClass = await ClassModel.findByIdAndUpdate(
            classId,
            { $pull: { students: { $in: studentIds } } },
            { new: true }  // Return the updated document
        ).populate('students');

        if (!updatedClass) {
            return res.status(404).json({ message: "Class not found" });
        }

        // Update each student to set the classId field to null
        await Promise.all(studentIds.map(async (studentId) => {
            await StudentModel.findByIdAndUpdate(
                studentId,
                { $set: { classId: null } }, // Set the classId field to null
                { new: true }
            );
        }));

        res.status(200).json(updatedClass);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//remove a class teacher
module.exports.removeClassTeacher = async(req,res) =>{
    const {classTeacher,classId} =req.body;
    try{
        const response = await ClassModel.findByIdAndUpdate(classId, {
         classTeacher : null
        }, {new : true}).populate("classTeacher");
            await TeacherModel.findByIdAndUpdate(
                classTeacher, 
                { $pull: {roles : "classTeacher"},classAssigned : null },
                { new: true },
                
            );  
        res.status(200).json(response);
    }catch(err){
      res.status(500).json({message : err.message})
    }
  }
//get class by class teacher
module.exports.getClassByTeacher = async (req,res) =>{      
    console.log("here??")
    const {classId} = req.params;
    const user = req.user;
    console.log("user:",user.id)
    try{
        const classData = await ClassModel.findById(classId).populate("students subjects classTeacher");
        console.log("classData:",classData.classTeacher._id)
        if (!classData) {
            return res.status(404).json({ message: 'Class not found' });
          }
        if(user.id !==classData.classTeacher._id.toString()) return res.status(400).json("Unauthorized Access");
        res.status(200).json(classData);
    }catch(err){
        res.status(500).json({message : err.message})
    }
}
module.exports.getClassByNameAndFaction = async (req, res) => {
    const { name, faction } = req.query; // Extract name and faction from query parameters
  
    if (!name || !faction) {
      return res.status(400).json({ message: 'Please provide both name and faction' });
    }
  
    try {
      // Find the class by name and faction
      const classData = await ClassModel.findOne({ name, faction }).populate('students subjects classTeacher');
  
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      res.status(200).json(classData);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
module.exports.getClassesByName = async (req, res) => {
    const { name } = req.query; // Extract name and faction from query parameters
  
    if (!name) {
      return res.status(400).json({ message: 'Please provide both name and faction' });
    }
  
    try {
      // Find the class by name and faction
      const classData = await ClassModel.find({ name}).populate('students subjects classTeacher');
  
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      res.status(200).json(classData);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };