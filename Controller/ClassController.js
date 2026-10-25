const ClassModel = require('../Models/ClassModel');
const StudentModel = require('../Models/StudentsModel');
const TeacherModel = require('../Models/TeacherModel');

// Create a new Class
const createClass = async (req, res) => {
    try {
        const { standard, section, classTeacherId, roomNumber, capacity, academicYear, subjects } = req.body;

        if (!standard || !section) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both standard and section.'
            });
        }

        const secUpper = String(section).trim().toUpperCase();
        const year = academicYear || '2026-2027';

        // Check for duplicates
        const existingClass = await ClassModel.findOne({
            standard: Number(standard),
            section: secUpper,
            academicYear: year
        });

        if (existingClass) {
            return res.status(400).json({
                success: false,
                message: `Class for Grade ${standard} - Section ${secUpper} (${year}) already exists.`
            });
        }

        // Verify teacher exists if provided
        if (classTeacherId) {
            const teacherExists = await TeacherModel.findById(classTeacherId);
            if (!teacherExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Assigned class teacher not found in records.'
                });
            }
        }

        const newClass = new ClassModel({
            standard: Number(standard),
            section: secUpper,
            className: `Grade ${standard} - Section ${secUpper}`,
            classTeacherId: classTeacherId || null,
            roomNumber: roomNumber || 'TBD',
            capacity: capacity ? Number(capacity) : 40,
            academicYear: year,
            subjects: subjects || []
        });

        await newClass.save();

        const populatedClass = await ClassModel.findById(newClass._id)
            .populate('classTeacherId', 'name email phoneNumber subject');

        res.status(201).json({
            success: true,
            message: 'Class created successfully',
            data: populatedClass
        });
    } catch (error) {
        console.error('Error creating class:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating class',
            error: error.message
        });
    }
};

// Get all classes with populated class teacher and enrolled student count
const getClasses = async (req, res) => {
    try {
        const classes = await ClassModel.find()
            .populate('classTeacherId', 'name email phoneNumber subject')
            .sort({ standard: 1, section: 1 });

        // Augment with enrolled student counts from StudentModel
        const classesWithCounts = await Promise.all(classes.map(async (cls) => {
            const studentCount = await StudentModel.countDocuments({
                Standard: cls.standard,
                Division: cls.section
            });
            const clsObj = cls.toObject();
            clsObj.enrolledStudents = studentCount;
            return clsObj;
        }));

        res.status(200).json({
            success: true,
            message: 'Classes fetched successfully',
            data: classesWithCounts
        });
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching classes',
            error: error.message
        });
    }
};

// Get specific class by ID with enrolled students
const getClassById = async (req, res) => {
    try {
        const { classid } = req.params;
        const classData = await ClassModel.findById(classid)
            .populate('classTeacherId', 'name email phoneNumber subject')
            .populate('subjects.teacherId', 'name email subject');

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: 'Class not found'
            });
        }

        // Fetch students in this class
        const students = await StudentModel.find({
            Standard: classData.standard,
            Division: classData.section
        }).populate('parentId', 'name email phoneNumber');

        const classObj = classData.toObject();
        classObj.students = students;
        classObj.enrolledStudents = students.length;

        res.status(200).json({
            success: true,
            message: 'Class details fetched successfully',
            data: classObj
        });
    } catch (error) {
        console.error('Error fetching class details:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching class details',
            error: error.message
        });
    }
};

// Update an existing class
const updateClass = async (req, res) => {
    try {
        const { classid } = req.params;
        const { standard, section, roomNumber, capacity, classTeacherId, academicYear, subjects } = req.body;

        const currentClass = await ClassModel.findById(classid);
        if (!currentClass) {
            return res.status(404).json({
                success: false,
                message: 'Class not found to update'
            });
        }

        const updateData = {};
        if (standard) updateData.standard = Number(standard);
        if (section) updateData.section = String(section).trim().toUpperCase();

        const finalStandard = standard ? Number(standard) : currentClass.standard;
        const finalSection = section ? String(section).trim().toUpperCase() : currentClass.section;
        updateData.className = `Grade ${finalStandard} - Section ${finalSection}`;

        if (roomNumber !== undefined) updateData.roomNumber = roomNumber;
        if (capacity !== undefined) updateData.capacity = Number(capacity);
        if (classTeacherId !== undefined) updateData.classTeacherId = classTeacherId || null;
        if (academicYear !== undefined) updateData.academicYear = academicYear;
        if (subjects !== undefined) updateData.subjects = subjects;

        const updated = await ClassModel.findByIdAndUpdate(
            classid,
            updateData,
            { new: true, runValidators: true }
        ).populate('classTeacherId', 'name email phoneNumber subject');

        res.status(200).json({
            success: true,
            message: 'Class updated successfully',
            data: updated
        });
    } catch (error) {
        console.error('Error updating class:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating class',
            error: error.message
        });
    }
};

// Delete a class
const deleteClass = async (req, res) => {
    try {
        const { classid } = req.params;
        const deleted = await ClassModel.findByIdAndDelete(classid);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Class not found to delete'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Class deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting class:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting class',
            error: error.message
        });
    }
};

// Assign or update a subject teacher in a class
const assignSubjectTeacher = async (req, res) => {
    try {
        const { classid } = req.params;
        const { subjectName, teacherId } = req.body;

        if (!subjectName) {
            return res.status(400).json({
                success: false,
                message: 'Subject name is required'
            });
        }

        const classRecord = await ClassModel.findById(classid);
        if (!classRecord) {
            return res.status(404).json({
                success: false,
                message: 'Class not found'
            });
        }

        const existingSubjectIndex = classRecord.subjects.findIndex(
            (s) => s.subjectName.toLowerCase() === subjectName.toLowerCase()
        );

        if (existingSubjectIndex >= 0) {
            classRecord.subjects[existingSubjectIndex].teacherId = teacherId || null;
        } else {
            classRecord.subjects.push({
                subjectName,
                teacherId: teacherId || null
            });
        }

        await classRecord.save();

        const updated = await ClassModel.findById(classid)
            .populate('classTeacherId', 'name email')
            .populate('subjects.teacherId', 'name email subject');

        res.status(200).json({
            success: true,
            message: `Subject ${subjectName} updated in class`,
            data: updated
        });
    } catch (error) {
        console.error('Error assigning subject teacher:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while assigning subject',
            error: error.message
        });
    }
};

module.exports = {
    createClass,
    getClasses,
    getClassById,
    updateClass,
    deleteClass,
    assignSubjectTeacher
};
