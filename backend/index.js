const express=require("express");
const app=express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const port=8000;                                            //backend port set as 8000
require('dotenv').config();
const url=process.env.MONGO_URL;
console.log(url,"url");
const DbConnection=require("./config/ConnectDB");
const TeacherRouter = require("./Routes/TeacherRoute");
const StudentRouter = require("./Routes/StudentsRoute");
const ParentRouter = require("./Routes/ParentRoute");
const ClassRouter = require("./Routes/ClassRoute");
const AttendanceRouter = require("./Routes/AttendanceRoute");


//to establish connection btw frontend and backend
const cors = require('cors');
app.use(cors({ origin: ['http://localhost:3000'] }));       //frontend runs in port 3000
 
// Middleware
app.use(express.json());
app.use(bodyParser.json());
DbConnection();

app.use("/teacher", TeacherRouter);                          //teacher section route
app.use("/student", StudentRouter);
app.use("/parent", ParentRouter);
app.use("/class", ClassRouter);                              //class management route
app.use("/attendance", AttendanceRouter);                    //attendance tracking route


//dAsnOnxqI61p9HFo
app.listen(port,()=>{
    console.log(`Server running at port${port}`);
})
