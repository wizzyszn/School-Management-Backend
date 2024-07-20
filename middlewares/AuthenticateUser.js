const jwt = require('jsonwebtoken')
module.exports.authenticate = async (req,res,next) =>{
    const {token} = req.cookies
   if(!token) return res.status(401).json({message : "Invalid or missing Access Token"});
   try{
    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,user)=>{
        if(err){
            if(err.name === "TokenExpiredError"){
                return res.status(403).json({message : "Session expired"})
            }
            if(err.name === "JsonWebTokenError"){
                return res.status(403).json({message : "Invalid token"})
            }
            return res.sendStatus(403)
        }
        req.user = user;    
        next();
       })
       
   }catch(err){
    res.status(500).json({message: err.message})
   }    
}   