const express = require("express");
const {
    getClassAttendance,
    markClassAttendance,
    getStudentAttendance,
    updateStudentAttendanceDirect,
    getAttendanceSummary
} = require("../Controller/AttendanceController");

const AttendanceRouter = express.Router();

// Routes
AttendanceRouter.get("/class", getClassAttendance);
AttendanceRouter.post("/mark", markClassAttendance);
AttendanceRouter.get("/summary", getAttendanceSummary);
AttendanceRouter.get("/student/:studentid", getStudentAttendance);
AttendanceRouter.put("/student/:studentid", updateStudentAttendanceDirect);

module.exports = AttendanceRouter;
