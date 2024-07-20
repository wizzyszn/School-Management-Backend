const express = require('express');
const { createStudent, removeStudent, removeManyStudents, addSubjects, removeSubjects, getStudentSubjects,getStudentsByAdmissionYear } = require('../controllers/studentsController');
const { isAdminOrClassTeacher } = require('../middlewares/isAdminOrClassTeacher');
const router = express.Router();
router.post('/admit-student',isAdminOrClassTeacher,createStudent);
router.post('/add-subjects',isAdminOrClassTeacher,addSubjects);
router.post('/remove-subjects',isAdminOrClassTeacher,removeSubjects);
router.post('/remove-student',isAdminOrClassTeacher,removeStudent);
router.post('/remove-students',isAdminOrClassTeacher,removeManyStudents );
router.get('/find/:studentId',isAdminOrClassTeacher,getStudentSubjects);
router.get('/studentsByAdmissionYear',isAdminOrClassTeacher, getStudentsByAdmissionYear);
module.exports = router;