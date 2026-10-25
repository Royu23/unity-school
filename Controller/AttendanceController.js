const AttendanceModel = require("../Models/AttendanceModel");
const StudentModel = require("../Models/StudentsModel");
const mongoose = require("mongoose");

// Helper to format date string YYYY-MM-DD
const getTodayDateString = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

// 1. Get Class Attendance for Roll Call on a specific date
const getClassAttendance = async (req, res) => {
    try {
        const { standard, division, date } = req.query;
        const targetDate = date ? String(date).trim() : getTodayDateString();

        if (!standard || !division) {
            return res.status(400).json({
                success: false,
                message: "Standard and Division are required query parameters."
            });
        }

        const stdNum = Number(standard);
        const divUpper = String(division).trim().toUpperCase();

        // Find all students in this class
        const students = await StudentModel.find({
            Standard: stdNum,
            Division: divUpper
        }).sort({ rollNumber: 1, Name: 1 });

        // Check if attendance already marked for this date
        const existingAttendance = await AttendanceModel.findOne({
            date: targetDate,
            standard: stdNum,
            division: divUpper
        });

        // Map students with marked status or default to 'Present'
        const mappedStudents = students.map((stu) => {
            let status = "Present";
            let remarks = "";

            if (existingAttendance && existingAttendance.records) {
                const foundRecord = existingAttendance.records.find(
                    (r) => String(r.studentId) === String(stu._id)
                );
                if (foundRecord) {
                    status = foundRecord.status;
                    remarks = foundRecord.remarks || "";
                }
            }

            const total = stu.attendance?.totalDays || 50;
            const present = stu.attendance?.presentDays || 48;
            const absent = stu.attendance?.absentDays || (total - present);
            const percentage = stu.attendance?.percentage || Math.round((present / total) * 100);

            return {
                _id: stu._id,
                name: stu.Name,
                studentId: stu.studentId,
                rollNumber: stu.rollNumber || "1",
                gender: stu.Gender,
                status,
                remarks,
                overallAttendance: {
                    totalDays: total,
                    presentDays: present,
                    absentDays: absent,
                    percentage
                }
            };
        });

        // Compute class summary
        const totalCount = mappedStudents.length;
        const presentCount = mappedStudents.filter(s => s.status === "Present" || s.status === "Late").length;
        const absentCount = mappedStudents.filter(s => s.status === "Absent").length;
        const classRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 100;

        res.status(200).json({
            success: true,
            date: targetDate,
            standard: stdNum,
            division: divUpper,
            isMarked: !!existingAttendance,
            markedBy: existingAttendance?.markedBy || "Class Teacher",
            summary: {
                totalStudents: totalCount,
                presentCount,
                absentCount,
                classAttendancePercentage: classRate
            },
            students: mappedStudents
        });
    } catch (error) {
        console.error("Error fetching class attendance:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch class attendance",
            error: error.message
        });
    }
};

// 2. Mark / Submit Class Attendance Roll Call
const markClassAttendance = async (req, res) => {
    try {
        const { date, standard, division, markedBy, records } = req.body;
        const targetDate = date ? String(date).trim() : getTodayDateString();

        if (!standard || !division || !Array.isArray(records)) {
            return res.status(400).json({
                success: false,
                message: "standard, division, and an array of student records are required."
            });
        }

        const stdNum = Number(standard);
        const divUpper = String(division).trim().toUpperCase();

        // Calculate summary
        const total = records.length;
        const present = records.filter(r => r.status === "Present" || r.status === "Late").length;
        const absent = records.filter(r => r.status === "Absent").length;
        const percentage = total > 0 ? Math.round((present / total) * 100) : 100;

        // Check if updating an existing record for the same day
        const existingRecord = await AttendanceModel.findOne({
            date: targetDate,
            standard: stdNum,
            division: divUpper
        });

        const isNewDay = !existingRecord;

        // Save attendance record
        const savedAttendance = await AttendanceModel.findOneAndUpdate(
            { date: targetDate, standard: stdNum, division: divUpper },
            {
                date: targetDate,
                standard: stdNum,
                division: divUpper,
                markedBy: markedBy || "Class Teacher",
                records: records.map(r => ({
                    studentId: r.studentId,
                    status: r.status || "Present",
                    remarks: r.remarks || ""
                })),
                summary: {
                    total,
                    present,
                    absent,
                    percentage
                }
            },
            { upsert: true, new: true }
        );

        // Update each student's cumulative attendance in StudentsModel
        for (const record of records) {
            const student = await StudentModel.findById(record.studentId);
            if (student) {
                let currentTotal = student.attendance?.totalDays || 50;
                let currentPresent = student.attendance?.presentDays || 48;
                let currentAbsent = student.attendance?.absentDays || 2;

                if (isNewDay) {
                    currentTotal += 1;
                    if (record.status === "Present" || record.status === "Late") {
                        currentPresent += 1;
                    } else if (record.status === "Absent") {
                        currentAbsent += 1;
                    }
                } else {
                    // Update if status changed on same day
                    const oldRec = existingRecord.records.find(
                        r => String(r.studentId) === String(record.studentId)
                    );
                    if (oldRec && oldRec.status !== record.status) {
                        if (record.status === "Absent" && oldRec.status !== "Absent") {
                            currentAbsent += 1;
                            currentPresent = Math.max(0, currentPresent - 1);
                        } else if (record.status !== "Absent" && oldRec.status === "Absent") {
                            currentAbsent = Math.max(0, currentAbsent - 1);
                            currentPresent += 1;
                        }
                    }
                }

                const newPercentage = currentTotal > 0 ? Math.round((currentPresent / currentTotal) * 100) : 100;

                await StudentModel.findByIdAndUpdate(student._id, {
                    $set: {
                        "attendance.totalDays": currentTotal,
                        "attendance.presentDays": currentPresent,
                        "attendance.absentDays": currentAbsent,
                        "attendance.percentage": newPercentage
                    }
                });
            }
        }

        res.status(200).json({
            success: true,
            message: `Roll call for Grade ${stdNum}-${divUpper} on ${targetDate} recorded successfully.`,
            data: savedAttendance
        });
    } catch (error) {
        console.error("Error saving attendance:", error);
        res.status(500).json({
            success: false,
            message: "Failed to record class attendance",
            error: error.message
        });
    }
};

// 3. Get Single Student Attendance Profile & Recent History
const getStudentAttendance = async (req, res) => {
    try {
        const { studentid } = req.params;

        // Find by ObjectId or studentId
        let student = null;
        if (mongoose.Types.ObjectId.isValid(studentid)) {
            student = await StudentModel.findById(studentid);
        }
        if (!student) {
            student = await StudentModel.findOne({
                $or: [
                    { studentId: studentid.toUpperCase() },
                    { studentId: studentid }
                ]
            });
        }

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student record not found"
            });
        }

        const totalDays = student.attendance?.totalDays || 50;
        const presentDays = student.attendance?.presentDays || 48;
        const absentDays = student.attendance?.absentDays || 2;
        const percentage = student.attendance?.percentage || Math.round((presentDays / totalDays) * 100);

        let standing = "Excellent Standing";
        let standingColor = "emerald";
        let message = "Eligible for all examinations and academic honors.";

        if (percentage < 75) {
            standing = "Attendance Shortage Alert";
            standingColor = "rose";
            message = "Attendance is below the mandatory 75% threshold. Please consult academic office.";
        } else if (percentage < 85) {
            standing = "Satisfactory Standing";
            standingColor = "amber";
            message = "Meets minimum attendance criteria. Maintain regular attendance.";
        }

        // Fetch recent attendance logs for this student
        const recentLogs = await AttendanceModel.find({
            "records.studentId": student._id
        })
        .sort({ date: -1 })
        .limit(15);

        const history = recentLogs.map(log => {
            const entry = log.records.find(r => String(r.studentId) === String(student._id));
            return {
                date: log.date,
                status: entry ? entry.status : "Present",
                remarks: entry ? entry.remarks : "",
                markedBy: log.markedBy
            };
        });

        res.status(200).json({
            success: true,
            data: {
                studentId: student.studentId,
                name: student.Name,
                standard: student.Standard,
                division: student.Division,
                rollNumber: student.rollNumber,
                metrics: {
                    totalDays,
                    presentDays,
                    absentDays,
                    percentage,
                    standing,
                    standingColor,
                    message
                },
                history
            }
        });
    } catch (error) {
        console.error("Error fetching student attendance:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch student attendance",
            error: error.message
        });
    }
};

// 4. Manually update a student's attendance metrics (Admin / Teacher adjustment)
const updateStudentAttendanceDirect = async (req, res) => {
    try {
        const { studentid } = req.params;
        const { totalDays, presentDays, absentDays, percentage: customPercent } = req.body;

        const tot = Number(totalDays) || 50;
        const pres = Number(presentDays) !== undefined ? Number(presentDays) : 48;
        const abs = Number(absentDays) !== undefined ? Number(absentDays) : (tot - pres);
        const percent = customPercent !== undefined ? Number(customPercent) : (tot > 0 ? Math.round((pres / tot) * 100) : 100);

        const updatedStudent = await StudentModel.findByIdAndUpdate(
            studentid,
            {
                $set: {
                    "attendance.totalDays": tot,
                    "attendance.presentDays": pres,
                    "attendance.absentDays": abs,
                    "attendance.percentage": percent
                }
            },
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student attendance metrics updated successfully",
            data: updatedStudent.attendance
        });
    } catch (error) {
        console.error("Error updating student attendance:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update attendance metrics",
            error: error.message
        });
    }
};

// 5. School-wide Attendance Summary for Admin Overview
const getAttendanceSummary = async (req, res) => {
    try {
        const allStudents = await StudentModel.find({}, { Name: 1, studentId: 1, Standard: 1, Division: 1, attendance: 1 });
        
        let totalCount = allStudents.length;
        let sumPercentage = 0;
        let shortageCount = 0;
        let excellentCount = 0;

        allStudents.forEach(s => {
            const pct = s.attendance?.percentage || 96;
            sumPercentage += pct;
            if (pct < 75) shortageCount++;
            else if (pct >= 85) excellentCount++;
        });

        const campusAverage = totalCount > 0 ? Math.round(sumPercentage / totalCount) : 100;

        res.status(200).json({
            success: true,
            data: {
                totalStudents: totalCount,
                campusAveragePercentage: campusAverage,
                excellentCount,
                shortageCount,
                satisfactoryCount: totalCount - excellentCount - shortageCount
            }
        });
    } catch (error) {
        console.error("Error fetching campus attendance summary:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch attendance summary",
            error: error.message
        });
    }
};

module.exports = {
    getClassAttendance,
    markClassAttendance,
    getStudentAttendance,
    updateStudentAttendanceDirect,
    getAttendanceSummary
};
