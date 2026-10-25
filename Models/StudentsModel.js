const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: [true, 'Student name is required'],
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        sparse: true
    },
    studentId: {
        type: String,
        unique: true,
        trim: true
    },
    rollNumber: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        default: '12345'
    },
    Age: {
        type: String,
        trim: true
    },
    Gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Not Specified'],
        default: 'Not Specified'
    },
    Standard: {
        type: Number,
        required: [true, 'Grade standard is required']
    },
    Division: {
        type: String,
        required: [true, 'Class division/section is required'],
        trim: true,
        uppercase: true
    },
    Address: {
        type: String,
        trim: true
    },
    Pincode: {
        type: String,
        trim: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "parent",
        default: null
    },
    attendance: {
        totalDays: { type: Number, default: 50 },
        presentDays: { type: Number, default: 48 },
        absentDays: { type: Number, default: 2 },
        percentage: { type: Number, default: 96 }
    }
}, {
    timestamps: true
});

// Auto-generate studentId if not provided
StudentSchema.pre('save', function () {
    if (!this.studentId) {
        const rand = Math.floor(1000 + Math.random() * 9000);
        this.studentId = `STU-${this.Standard || '10'}${this.Division || 'A'}-${rand}`;
    }
    if (!this.email) {
        this.email = `${this.studentId.toLowerCase()}@unityacademy.edu`;
    }
});

module.exports = mongoose.model("Students", StudentSchema);
