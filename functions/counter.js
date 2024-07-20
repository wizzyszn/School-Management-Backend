const CounterModel = require('../models/counter')
module.exports.initializeCounter = async() =>{
    try{
        const counter = await CounterModel.findOne({name : "studentId"});
        if(!counter){
            const newCounter = new CounterModel()
            newCounter.name = "studentId";
            newCounter.value = 0;
            await newCounter.save()
        }
    }catch(err){
        console.log(err.message)
    }
}

