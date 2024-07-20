const StudentModel = require("../models/student")
const jwt = require('jsonwebtoken')
module.exports.isAdminOrClassTeacher = async(req,res,next) =>{
    const {token} = req.cookies;
    if (!token) {
        return res.status(401).json({ message: "Access token is missing" });
    }
    const decode = jwt.decode(token);
    const {studentId} = decode;
    try{
        const user =await StudentModel.findOne({studentId});
        if(user.role !== "student"){
            throw new Error("Admin access is required")
        }
        next();
    }catch(err){
        res.status(500).json(err.message)
    }
}