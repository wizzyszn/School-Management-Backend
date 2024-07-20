const mongoose = require('mongoose');
const {Schema} = mongoose;
const teacherDetailsSchema = new Schema({
    password : {
        type : String,
        ref : 'Teacher'
    }
});
module.exports = mongoose.model('TeacherDetails', teacherDetailsSchema);