const mongoose = require('mongoose');

const SubjectTeacherSchema = new mongoose.Schema({
    subjectName: {
        type: String,
        required: true,
        trim: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teachers',
        default: null
    }
}, { _id: false });

const ClassSchema = new mongoose.Schema({
    standard: {
        type: Number,
        required: [true, 'Class standard/grade is required'],
        min: [1, 'Standard must be at least 1'],
        max: [12, 'Standard cannot exceed 12']
    },
    section: {
        type: String,
        required: [true, 'Class section/division is required'],
        trim: true,
        uppercase: true,
        maxlength: 3
    },
    className: {
        type: String,
        trim: true
    },
    classTeacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teachers',
        default: null
    },
    roomNumber: {
        type: String,
        trim: true,
        default: 'TBD'
    },
    capacity: {
        type: Number,
        default: 40,
        min: 1
    },
    academicYear: {
        type: String,
        trim: true,
        default: '2026-2027'
    },
    subjects: [SubjectTeacherSchema]
}, {
    timestamps: true
});

// Auto-populate className before saving
ClassSchema.pre('save', function () {
    if (!this.className) {
        this.className = `Grade ${this.standard} - Section ${this.section}`;
    }
});

// Compound unique index: Prevent duplicate section in the same standard and academic year
ClassSchema.index({ standard: 1, section: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('Class', ClassSchema);
