const mongoose = require('mongoose');
const {Schema } = mongoose;

const adminSchema = new Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type: String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    email : {
        type  : String,
        required : true,
        unique : true
    },
    role : {
        type : String,
        enum : ["admin"],
        required : true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zip: { type: String }
    },
    profilePicture: {
        type: String  // URL to profile picture
    }   
});

module.exports = mongoose.model('Admins', adminSchema)