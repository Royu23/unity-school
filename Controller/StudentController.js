const StudentModel = require("../Models/StudentsModel");
const ClassModel = require("../Models/ClassModel");
const crypto = require("crypto");

// Create new Student
const createStudent = async (req, res) => {
    try {
        const {
            name,
            per, // backwards compatibility
            email,
            studentId,
            rollNumber,
            password,
            age,
            gender,
            standard,
            division,
            address,
            pincode,
            parentId
        } = req.body;

        const studentName = name || per;

        if (!studentName || !standard || !division) {
            return res.status(400).json({
                success: false,
                message: "Student name, standard, and division are required."
            });
        }

        const divUpper = String(division).trim().toUpperCase();
        const randPass = password || "12345";
        const customId = studentId ? studentId.trim() : `STU-${standard}${divUpper}-${Math.floor(1000 + Math.random() * 9000)}`;
        const studentEmail = email ? email.trim().toLowerCase() : `${customId.toLowerCase()}@unityacademy.edu`;

        const newStudent = new StudentModel({
            Name: studentName.trim(),
            email: studentEmail,
            studentId: customId,
            rollNumber: rollNumber || `${Math.floor(1 + Math.random() * 50)}`,
            password: randPass,
            Age: age ? String(age) : "15",
            Gender: gender || "Not Specified",
            Standard: Number(standard),
            Division: divUpper,
            Address: address || "",
            Pincode: pincode || "",
            parentId: parentId || null
        });

        await newStudent.save();

        res.status(201).json({
            success: true,
            message: "Student enrolled successfully",
            data: {
                _id: newStudent._id,
                name: newStudent.Name,
                studentId: newStudent.studentId,
                email: newStudent.email,
                standard: newStudent.Standard,
                division: newStudent.Division,
                password: newStudent.password
            }
        });
    } catch (error) {
        console.error("Error creating student:", error);
        res.status(500).json({
            success: false,
            message: "Failed to enroll student",
            error: error.message
        });
    }
};

// Student Login Authentication
const loginStudent = async (req, res) => {
    try {
        const { identifier, email, studentId, password } = req.body;
        const loginQuery = (identifier || email || studentId || "").trim();
        const loginPass = (password || "").trim();

        if (!loginQuery || !loginPass) {
            return res.status(400).json({
                success: false,
                message: "Please enter your Student ID or Email and password."
            });
        }

        // Search by email, studentId, or rollNumber (case-insensitive)
        const student = await StudentModel.findOne({
            $or: [
                { email: loginQuery.toLowerCase() },
                { studentId: loginQuery.toUpperCase() },
                { studentId: loginQuery }
            ]
        }).populate("parentId");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "No student account found with the provided Student ID or Email."
            });
        }

        if (student.password !== loginPass) {
            return res.status(401).json({
                success: false,
                message: "Invalid student password or passcode."
            });
        }

        // Fetch Class and Class Teacher info
        const classDetails = await ClassModel.findOne({
            standard: student.Standard,
            section: student.Division
        }).populate("classTeacherId", "name email phoneNumber subject");

        const sessionToken = crypto.randomBytes(32).toString("hex");

        res.status(200).json({
            success: true,
            message: "Student login successful",
            data: {
                student: {
                    _id: student._id,
                    name: student.Name,
                    email: student.email,
                    studentId: student.studentId,
                    rollNumber: student.rollNumber,
                    standard: student.Standard,
                    division: student.Division,
                    gender: student.Gender,
                    age: student.Age,
                    address: student.Address,
                    pincode: student.Pincode,
                    parent: student.parentId
                },
                classroom: classDetails ? {
                    className: classDetails.className,
                    roomNumber: classDetails.roomNumber,
                    classTeacher: classDetails.classTeacherId,
                    subjects: classDetails.subjects,
                    academicYear: classDetails.academicYear
                } : null,
                accessToken: {
                    token: sessionToken,
                    expiresIn: "24h"
                }
            }
        });
    } catch (error) {
        console.error("Error logging in student:", error);
        res.status(500).json({
            success: false,
            message: "Student login failed due to server error",
            error: error.message
        });
    }
};

// Get all students
const getStudents = async (req, res) => {
    try {
        const { standard, division } = req.query;
        const filter = {};
        if (standard) filter.Standard = Number(standard);
        if (division) filter.Division = String(division).trim().toUpperCase();

        const students = await StudentModel.find(filter)
            .populate("parentId")
            .sort({ Standard: 1, Division: 1, Name: 1 });

        res.status(200).json({
            success: true,
            message: "Student data fetched successfully",
            data: students
        });
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching student records",
            error: error.message
        });
    }
};

// Get single student by ID with class info
const getStudentById = async (req, res) => {
    try {
        const { studentid } = req.params;
        const student = await StudentModel.findById(studentid).populate("parentId");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const classInfo = await ClassModel.findOne({
            standard: student.Standard,
            section: student.Division
        }).populate("classTeacherId", "name email phoneNumber subject");

        res.status(200).json({
            success: true,
            message: "Student details fetched successfully",
            data: {
                student,
                classInfo
            }
        });
    } catch (error) {
        console.error("Error fetching student details:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching student profile",
            error: error.message
        });
    }
};

// Update student
const updateStudent = async (req, res) => {
    try {
        const { studentid } = req.params;
        const student = await StudentModel.findById(studentid);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const updatedStudent = await StudentModel.findByIdAndUpdate(
            studentid,
            req.body,
            { new: true, runValidators: true }
        ).populate("parentId");

        res.status(200).json({
            success: true,
            message: "Student details updated successfully",
            data: updatedStudent
        });
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update student",
            error: error.message
        });
    }
};

// Delete student
const deleteStudent = async (req, res) => {
    try {
        const { studentid } = req.params;
        const student = await StudentModel.findByIdAndDelete(studentid);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found to delete"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student record deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete student",
            error: error.message
        });
    }
};

module.exports = {
    createStudent,
    loginStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent
};