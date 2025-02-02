const router  = require('express').Router();
const {isAdminOrClassTeacher} = require('../middlewares/isAdminOrClassTeacher');
const {isClassTeacher} = require('../middlewares/isClassTeacher');
const {updateStudents,updateSubjects,createClass, assignClassTeacher, removeStudents, removeClassTeacher, getClassByTeacher, getClassByNameAndFaction, getClassesByName} = require('../controllers/classController');
const { isAdmin } = require('../middlewares/isAdmin');
router.post('/create-class',isAdminOrClassTeacher,createClass);
router.post('/update-subjects',isAdminOrClassTeacher,updateSubjects);
router.post('/update-students',isAdminOrClassTeacher,updateStudents);
router.post('/assign-class-teacher',isAdmin,assignClassTeacher);
router.post('/remove-students',isAdmin,removeStudents);
router.post('/remove-class-teacher',isAdmin,removeClassTeacher);
router.get('/find/:classId',isClassTeacher,getClassByTeacher);
router.get('/',isAdmin, getClassByNameAndFaction);
router.get('/classes',isAdmin, getClassesByName);
module.exports = router;