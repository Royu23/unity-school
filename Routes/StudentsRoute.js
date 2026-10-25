const express = require("express");
const {
    createStudent,
    loginStudent,
    getStudentById,
    getStudents,
    deleteStudent,
    updateStudent
} = require("../Controller/StudentController");

const StudentRouter = express.Router();

StudentRouter.post("/login", loginStudent);
StudentRouter.post("/", createStudent);
StudentRouter.get("/", getStudents);
StudentRouter.get("/:studentid", getStudentById);
StudentRouter.put("/:studentid", updateStudent);
StudentRouter.delete("/:studentid", deleteStudent);

module.exports = StudentRouter;
