const { initializeAssessments, updateAssessmentScores, getAssessments } = require('../controllers/accessmentController');
const {isClassTeacher} = require('../middlewares/isClassTeacher');
const {isSubjectTeacher} = require('../middlewares/isSubjectTeacher');

const router = require('express').Router();

router.post('/initialize-scores',isClassTeacher,initializeAssessments);
router.post('/update-scores',isSubjectTeacher,updateAssessmentScores);
router.get('/get-assessments',isSubjectTeacher,getAssessments);
module.exports = router;