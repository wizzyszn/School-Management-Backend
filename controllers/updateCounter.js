const CounterModel = require('../models/counter')
module.exports.generateStudentId = async() => {
try{
    const count = await CounterModel.findOneAndUpdate({
        name : "studentId"
    }, {$inc : {value : 1}}, {upsert : true,new : true}) //returns updated version of this doucment instead of the original;
    const year = new Date().getFullYear();
    const studentId = `REG/${year}/${String(count.value).padStart(5,'0')}`;
    return studentId   //REG-year-count-paddednumbers
}catch(err){
    console.log(err.message)
}
}