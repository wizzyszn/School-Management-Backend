const crypto = require('crypto');
module.exports.generatePassword = () => {
    return crypto.randomBytes(3).toString('hex');
  };