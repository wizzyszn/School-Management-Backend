const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');    
const userRoute = require('./routes/userRoutes');
const studentRoute = require('./routes/studentRoutes');
const teacherRoute = require('./routes/teacherRoutes');
const subjectRoute = require('./routes/subjectRoutes');
const classRoute = require('./routes/classRoutes');
const assessmentRoute = require('./routes/assessmentRoutes');
const { authenticate } = require('./middlewares/AuthenticateUser');
const cookieParser = require('cookie-parser');
//middlewares
app.use(cors());
app.use(express.json())
app.use(morgan('dev')); // Use morgan to log requests to the console
// Use cookie-parser middleware
app.use(cookieParser());
app.use('/api/users', userRoute);
app.use(authenticate)
app.use('/api/student',studentRoute);
app.use('/api/teacher',teacherRoute);
app.use('/api/subject',subjectRoute)
app.use('/api/class',classRoute);
app.use('/api/assessment',assessmentRoute);
//connect to db
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser  : true,
    useUnifiedTopology : true
   }).then(() =>{
    app.listen(process.env.SERVER_PORT ||5000, () =>{
        console.log(`listening on port${process.env.SERVER_PORT || 5000}`)
    })
}).catch((err) =>{
    console.log(err);

});