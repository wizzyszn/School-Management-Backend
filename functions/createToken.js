const jwt = require('jsonwebtoken');

module.exports.createToken = (body) =>{
    const token = jwt.sign(body,process.env.JWT_SECRET_KEY,{expiresIn : '2h'});
    return token;
}