const mongoose = require("mongoose");

const AttendanceRecordSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Students",
        required: true
    },
    status: {
        type: String,
        enum: ["Present", "Absent", "Late", "Excused"],
        default: "Present"
    },
    remarks: {
        type: String,
        trim: true,
        default: ""
    }
}, { _id: false });

const AttendanceSchema = new mongoose.Schema({
    date: {
        type: String, // Format: YYYY-MM-DD
        required: [true, "Attendance date is required"],
        trim: true
    },
    standard: {
        type: Number,
        required: [true, "Grade standard is required"]
    },
    division: {
        type: String,
        required: [true, "Class division/section is required"],
        trim: true,
        uppercase: true
    },
    markedBy: {
        type: String,
        default: "Class Teacher"
    },
    records: [AttendanceRecordSchema],
    summary: {
        total: { type: Number, default: 0 },
        present: { type: Number, default: 0 },
        absent: { type: Number, default: 0 },
        percentage: { type: Number, default: 100 }
    }
}, {
    timestamps: true
});

// Ensure a class only has 1 attendance record per calendar date
AttendanceSchema.index({ date: 1, standard: 1, division: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", AttendanceSchema);
