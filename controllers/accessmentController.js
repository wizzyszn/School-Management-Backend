const StudentModel = require('../models/student');
const SubjectModel = require('../models/subject');
const AssessmentModel = require('../models/assessment');
const ClassModel = require('../models/class');
const TermModel = require('../models/term');
const SessionModel = require('../models/session');
//initialize accessments
module.exports.initializeAssessments  = async(req,res) =>{
    const {classId,sessionId,termId} = req.body;
    const user = req.user; 
    if (!classId || !termId || !sessionId) {
        return res.status(400).json({ message: 'Grade, classId, termId, and sessionId are required' });
      }
    try{
        //fetch a class based on the classTeacher
        const classData = await ClassModel.findById({_id : classId});
        if (!classData) {
            return res.status(404).json({ message: 'Class not found' });
        }
        if(classData.classTeacher.toString() !== user.id) return res.status(403).json({message : "Unauthorized Access"});
        //fetch all students in specified class
        const students = await StudentModel.find({classId});
        if(students.length < 1) return res.status(400).json({message : "No students found for this grade"});
        //fetch all subjects for the specified class
        const subjects = await SubjectModel.find({classes : {$in : classId}});
        if (subjects.length < 1) {
            return res.status(404).json({ message: 'No subjects found' });
        }
         // Create initial assessments with zero scores for each student and subject combination
         const assessments = [];
         students.forEach(student =>{
            subjects.forEach(subject =>{
                assessments.push({  
                    student : student._id,
                    subject : subject._id,
                    grade : classData.name,
                    session: sessionId,
                    term: termId,
                    assessments : {
                        exam : 0,
                        firstTest : 0,
                        secondTest : 0,
                        assignment : 0
                    },
                    total : 0,
                    gradeLetter : 'F'
                })
            })
         });
         //save all accessments in bulk;
         await AssessmentModel.insertMany(assessments);
         console.log(`Initialized ${assessments.length} assessments for grade ${grade}`);

         res.status(200).json({ message: 'Assessments initialized successfully', count: assessments.length });
    }catch(err){
        console.log(err)
    }
} 
//update assessments
module.exports.updateAssessmentScores = async (req, res) => {
  const { studentId, subjectId, exam, firstTest, secondTest, assignment, termId, sessionId, } = req.body;
  const user = req.user;

  try {
    //check for the actual subject teacher for this operaton
    const subject = await SubjectModel.findById(subjectId).populate("teachers");
    if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
       // Check if the user is one of the subject teachers
       const isAuthorized = subject.teachers.some(teacher => teacher._id.toString() === user.id);
       if (!isAuthorized) {
         return res.status(403).json({ message: 'Unauthorized access' });
       };

    // Ensure the term and session exist
    const term = await TermModel.findById(termId);
    if (!term) {
      return res.status(404).json({ message: 'Term not found' });
    }

    const session = await SessionModel.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    if(!teacherId) return res.status(403).json({message : "Unauthorized access"});
    // Find the assessment document
    const assessment = await AssessmentModel.findOne({ student: studentId, subject: subjectId, term: termId, session: sessionId });
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    // Update only the provided fields
    if (exam !== undefined) {
      if (exam < 0 || exam > 60) {
        return res.status(400).json({ message: 'Invalid exam score' });
      }
      assessment.assessments.exam = exam;
    }

    if (firstTest !== undefined) {
      if (firstTest < 0 || firstTest > 15) {
        return res.status(400).json({ message: 'Invalid first test score' });
      }
      assessment.assessments.firstTest = firstTest;
    }

    if (secondTest !== undefined) {
      if (secondTest < 0 || secondTest > 15) {
        return res.status(400).json({ message: 'Invalid second test score' });
      }
      assessment.assessments.secondTest = secondTest;
    }

    if (assignment !== undefined) {
      if (assignment < 0 || assignment > 10) {
        return res.status(400).json({ message: 'Invalid assignment score' });
      }
      assessment.assessments.assignment = assignment;
    }

    // Save the assessment, the pre-save hook will handle the recalculation
    await assessment.save();
    res.status(200).json(assessment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.getAssessments = async (req, res) => {
    const { subjectId , termId, sessionId} = req.body;
    const user = req.user;

    try {
        // Check for the actual subject teacher for this operation
        const subject = await SubjectModel.findById(subjectId).populate('teachers');
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        } 

        // Check if the user is authorized to access the assessments
        const isAuthorized = subject.teachers.some(teacher => teacher._id.toString() === user.id);
        if (!isAuthorized) {
            return res.status(403).json({ message: 'Unauthorized access' });
        };
        // Ensure the term and session exist
    const term = await TermModel.findById(termId);
    if (!term) {
      return res.status(404).json({ message: 'Term not found' });
    }

    const session = await SessionModel.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
        // Fetch all assessments for the specified subject
        const assessments = await AssessmentModel.find({ subject: subjectId,term : termId,session : sessionId }).populate('student subject');
        if (assessments.length < 1) return res.status(404).json({ message: 'No assessments found' });
        res.status(200).json(assessments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};