const TeacherModel = require("../models/teacher");
const jwt = require('jsonwebtoken')
module.exports.isSubjectTeacher = async(req,res,next) =>{
    const {token} = req.cookies;
    if (!token) {
        return res.status(401).json({ message: "Access token is missing" });
    }
    const decode = jwt.decode(token);
    const {email} = decode;
  
    try{
        const user =await TeacherModel.findOne({"contact.email" : email});
        if(!user || !user.roles.includes("subjectTeacher")){
            throw new Error("Class Teacher access is required")
        }
        next();
    }catch(err){
        res.status(500).json(err.message)
    }
}