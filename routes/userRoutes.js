const express = require('express');
const { createAdmin, loginAsAdmin,loginAsTeacher, logoutAdmin, logoutTeacher } = require('../controllers/usersController');
const router = express.Router();
router.post('/create-admin', createAdmin);
router.post('/login-admin', loginAsAdmin);
router.get('/logout-admin', logoutAdmin);
router.post('/login-teacher', loginAsTeacher);
router.get('/logout-teacher', logoutTeacher);

module.exports = router;