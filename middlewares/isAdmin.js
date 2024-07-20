const AdminModel = require("../models/admin")
const jwt = require('jsonwebtoken')
module.exports.isAdmin = async(req,res,next) =>{
    const {token} = req.cookies;
    if (!token) {
        return res.status(401).json({ message: "Access token is missing" });
    }
    const decode = jwt.decode(token);
    const {email} = decode;
    try{
        const user =await AdminModel.findOne({email});
        if(!user ||  user.role !== "admin"){
            throw new Error("Admin access is required")
        }
        console.log("user :", user)
        next();
    }catch(err){
        res.status(500).json(err.message)
    }
}