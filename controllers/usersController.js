const { cleanCopy } = require("../functions/cleanCopy");
const {createToken} = require('../functions/createToken')
const AdminModel = require("../models/admin");
const TeacherModel = require("../models/teacher");
const bcrypt = require('bcryptjs');
//create admin
module.exports.createAdmin = async(req,res) =>{
    const { firstName,lastName,phone,email,role,password,address,profilePicture} = req.body;
    try{
        const user = await AdminModel.findOne({email});
            if(user) return res.status(400).json("This email is already in use");
            const salt =await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt)
          const response =  await AdminModel.create({
                firstName,
                lastName,
                email,
                role,
                password : hashedPassword,
                address,
                phone,
                profilePicture

            });
            const copy = cleanCopy(response)
            return res.status(200).json(copy)
    }catch(err){
        res.status(500).json({message : err.message})
    }
}
// login as Admin
module.exports.loginAsAdmin = async(req,res) =>{
    const {email,password} = req.body;
    try{
        const user = await AdminModel.findOne({email});
        if(!user) return res.status(400).json({message : "Admin does not exist"});
        const checkRole = user.role === "admin"
        if(!checkRole) return res.status(402).json("UnAuthorized Access")
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid) return res.status(400).json({message : "Invalid Crendetials try again"})
        if(isPasswordValid){
        const token = createToken({
            email : email,
            role : user.role,
            id : user._id
        });
        res.cookie('token', token, {
            httpOnly : true,
            sameSite : 'None'
        })
        const copy = cleanCopy(user)
        return res.status(200).json(copy);
        }
         
    }catch(err){
        res.status(500).json({message : err.message})
    }
}
//logout an admin
module.exports.logoutAdmin = async (req,res) =>{
        res.clearCookie('token');
        res.status(200).json({message : 'Logged out successfully'})
}
//logout a teacher
module.exports.logoutTeacher = async (req,res) =>{
    res.clearCookie('token');
    res.status(200).json({message : 'Logged out successfully'})
}
//login as a Teacher
module.exports.loginAsTeacher = async (req,res)=>{
    const {email,password} = req.body;
    try{
        const response = await TeacherModel.findOne({"contact.email" : email});
        if(!response) return res.status(400).json({message : "Invalid credentials"});
        const isPasswordValid = await bcrypt.compare(password,response.password);
        if(!isPasswordValid) return res.status(400).json({message :"Invalid credentials"});
        const token = createToken({
            email : email,
            role : response.roles, 
            id : response._id
        })
        res.cookie("token",token,{
            httpOnly : true,
            sameSite : 'None'
        })
        const copy = cleanCopy(response)
        return res.status(200).json(copy);
    }catch(err){
        res.status(500).json({message: err.message})
    }
};