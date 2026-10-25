const express = require('express');
const router = express.Router();
const {
    createClass,
    getClasses,
    getClassById,
    updateClass,
    deleteClass,
    assignSubjectTeacher
} = require('../Controller/ClassController');

router.post('/', createClass);
router.get('/', getClasses);
router.get('/:classid', getClassById);
router.put('/:classid', updateClass);
router.delete('/:classid', deleteClass);
router.post('/:classid/subjects', assignSubjectTeacher);

module.exports = router;
