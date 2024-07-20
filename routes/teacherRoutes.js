const express = require('express');
const { createTeacher, removeTeacher, removeTeachers, addClasses, addSubjects } = require('../controllers/teacherController');
const { isAdmin } = require('../middlewares/isAdmin');
const router = express.Router()
router.post('/create-teacher',isAdmin, createTeacher);
router.post('/remove-teacher',isAdmin, removeTeacher);
router.post('/remove-teachers',isAdmin,  removeTeachers);
router.post('/add-classes',isAdmin,  addClasses);
router.post('/add-subjects',isAdmin, addSubjects);
module.exports = router;