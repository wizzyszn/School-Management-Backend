const SubjectModel = require('../models/subject')
const TeacherModel = require('../models/teacher');
const ClassModel = require('../models/class');
module.exports.createSubject = async(req,res) =>{
    const {name,teacherIds,classes} = req.body
    try{
        const response =await SubjectModel.create({
            name,
            classes,
            teachers : teacherIds
        });
            // Update teachers with the new subject ID
        if(teacherIds !== undefined && teacherIds.length > 0){
        await Promise.all(teacherIds.map(async(teacherId)=>{
                await TeacherModel.findByIdAndUpdate(teacherId,{
                    $addToSet : {subjects : response._id}
                },{new : true})
        }))}
           // Update classes with the new subject ID
        if(classes !== undefined && classes.length > 0){
        await Promise.all(classes.map(async(classId)=>{
                await ClassModel.findByIdAndUpdate(classId,{
                    $addToSet : {subjects : response._id}
                },{new : true})
        }))}

        const subject = await response.populate("classes teachers")
        return res.status(200).json(subject)
    }catch (err) {
    
            res.status(500).json({ message: err.message });
    }
}

// Assign teachers to a subject
module.exports.addTeachers = async (req, res) => {
    const { subjectId, teacherIds } = req.body;

    try {
        // Find and update the subject by name, adding the new teachers
        const subject = await SubjectModel.findByIdAndUpdate(
            subjectId,
            { $addToSet: { teachers: { $each: teacherIds } } },
            { new: true }
        );

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        // Update each teacher to add this subject to their list
        await Promise.all(teacherIds.map(async (teacherId) => {
            await TeacherModel.findByIdAndUpdate(
                teacherId,
                { $addToSet: { subjects: subject._id,roles : "subjectTeacher" } },
                { new: true }
            );
        }));

        // Populate the updated subject with class and teacher details
        await subject.populate('classes teachers')

        return res.status(200).json({ message: 'Added teachers successfully', subject });
    } catch (err) {
            res.status(500).json({ message: err.message });
    }
};
//add classes to a subject
module.exports.addClasses = async(req,res)=>{
    const {classIds,subjectId} = req.body;
    try{
        const subject = await SubjectModel.findByIdAndUpdate(
            subjectId,
            { $addToSet: { classes: { $each: classIds } } },
            { new: true }
        );

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        };
        await Promise.all(classIds.map(async (classId) => {
            await ClassModel.findByIdAndUpdate(
                classId,
                { $addToSet: { subjects: subject._id } },
                { new: true }
            );
        }));
        await subject.populate('classes teachers')
        return res.status(200).json({ message: 'Added classes successfully', subject });
        
    }catch(err){
        res.status(500).json({message : err.message})
    }
}
// Remove teachers from a subject
module.exports.removeTeachers = async (req, res) => {
    const { subjectId, teacherIds } = req.body;

    try {
        // Find and update the subject, removing the specified teachers
        const subject = await SubjectModel.findByIdAndUpdate(
            subjectId,
            { $pull: { teachers: { $in: teacherIds } } },
            { new: true }
        );

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        // Update each teacher to remove this subject from their list
        await Promise.all(teacherIds.map(async (teacherId) => {
            await TeacherModel.findByIdAndUpdate(
                teacherId,
                { $pull: { subjects: subject._id } },
                { new: true }
            );
        }));

        return res.status(200).json({ message: 'Removed teachers successfully', subject });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// Remove classes from a subject
module.exports.removeClasses = async (req, res) => {
    const { subjectId, classIds } = req.body;

    try {
        // Find and update the subject, removing the specified classes
        const subject = await SubjectModel.findByIdAndUpdate(
            subjectId,
            { $pull: { classes: { $in: classIds } } },
            { new: true }
        );

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        // Update each class to remove this subject from their list
        await Promise.all(classIds.map(async (classId) => {
            await ClassModel.findByIdAndUpdate(
                classId,
                { $pull: { subjects: subject._id } },
                { new: true }
            );
        }));

        return res.status(200).json({ message: 'Removed classes successfully', subject });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};