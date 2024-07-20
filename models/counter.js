const mongoose = require('mongoose');
const {Schema} = mongoose;

const counterSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    value : {
        type : Number,
        required : true
    }
});

module.exports = mongoose.model('Counter', counterSchema);