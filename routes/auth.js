const express = require('express');
const router = express.Router();
const auth = require('../controller/auth');
router.post('/login', auth.employeeLogin);
router.post('/signup', auth.employeeSignUp);
router.post('/manager-login', auth.managerLogin);
router.post('/admin-login', auth.adminLogin);
module.exports = router;
