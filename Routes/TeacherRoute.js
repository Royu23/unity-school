const express=require("express");
const { createTeacher, getTeachers, getTeacherById, updateTeacher, deleteTeacher,LoginTeacher } = require("../Controller/TeacherController");
const TeacherRouter=express.Router();

TeacherRouter.post("/",createTeacher);
TeacherRouter.get("/",getTeachers);
TeacherRouter.get("/:teachersid",getTeacherById);
TeacherRouter.put("/:teacherid",updateTeacher);
TeacherRouter.delete("/:teacherid",deleteTeacher);
TeacherRouter.post("/login",LoginTeacher);

module.exports=TeacherRouter;