const TeacherModel = require('../models/teacher');
const SubjectModel = require('../models/subject');
const TeacherDetails = require('../models/teacherDetails')
const bcrypt = require('bcryptjs');
const {generatePassword} = require('../functions/generatePassword');
const { cleanCopy } = require('../functions/cleanCopy');

//create a teacher
module.exports.createTeacher = async (req, res) => {
 
  const { firstName, lastName, subjects, classes, contact, role, profilePicture } = req.body;
  if(!contact) return res.status(400).json({message : "please provide your contact"})
  const { email } = contact;
  try {
    // Check if the teacher already exists
    const user = await TeacherModel.findOne({"contact.email" :email});
    if(user) return res.status(400).json({ message: "This email is already in use" });

    // Generate a random password
    const password = generatePassword();
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create the teacher record
    const response = await TeacherModel.create({
      firstName,
      lastName,
      password: hash,
      subjects,
      classes,
      contact,
      role,
      profilePicture
    });
    const savedPassword = await TeacherDetails.create({
      password
  });
  const transport = Nodemailer.createTransport({
    service : "Yahoo",
    secure: false,
    auth : {
        user : process.env.EMAIL,
        pass : process.env.EMAIL_PASSWORD
    }
});
await transport.sendMail({
from :  process.env.EMAIL,
to : response.contact.email,
text: `Dear ${response.firstName + " " + response.lastName},

We are pleased to inform you that your account has been created successfully. As part of the onboarding process, we have generated a temporary password for you.

Your temporary password is: ${savedPassword}

Please ensure that you log in and update your password at your earliest convenience to maintain the security of your account.

If you have any questions or require assistance, do not hesitate to reach out.

Best regards.`})
    // Send the response without the password
    const copy = cleanCopy(response);
    return res.status(200).json(copy);
    // Optionally, send the plain password to the teacher via email or another secure method
    // sendEmail(email, password);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//remove a teacher
module.exports.removeTeacher = async(req,res) =>{
  const {teacherId} = req.body;
  try{
       await TeacherModel.findByIdAndDelete(teacherId);
      return res.status(200).json({message : "deleted succesfully"});
  }catch(err){
      res.status(500).json({message : err.message})
  }
}
//remove many teachers
module.exports.removeTeachers = async(req,res)=>{
  const {teacherIds} = req.body;
  try{
       await TeacherModel.deleteMany({_id : {$in : teacherIds}})
      return res.status(200).json({message : "deleted succesfully"});
  }catch(err){
      res.status(500).json({message : err.message})
  }
}
//add subjects to a teacher
module.exports.addSubjects = async(req,res) =>{
  const {teacherId,subjectIds} = req.body;
    // Validate input
    if (!teacherId || !Array.isArray(subjectIds) || subjectIds.length === 0) {
      return res.status(400).json({ message: 'Invalid input' });
  }
  try{
    const response = await TeacherModel.findByIdAndUpdate(teacherId, {$addToSet : {subjects : {$each : subjectIds}}},{new : true});
    if(response) return res.status(400).json({message : "Teacher not found"});
    await Promise.all(subjectIds.map(async (subjectId) => {
      await SubjectModel.findByIdAndUpdate(
          subjectId,
          { $addToSet: { teachers: teacherId } },
          { new: true }
      );
  }));

    res.status(200).json({message : "subjects assigned successfully"})
  }catch(err){
    res.status(500).json({message : err.message})
  }
}
module.exports.addClasses = async(req,res) =>{
  const {teacherId,classIds} = req.body;
  try{
    const response = await TeacherModel.findByIdAndUpdate(teacherId,{$addToSet : {classes : {$each : classIds}}},{new : true});
    if(!response) return res.status(400).json({message : "Teacher not found"});
    res.status(200).json({message : "Added classes successfully", response})
  }catch(err){
    res.status(500).json({message : err.message})
  }
};
