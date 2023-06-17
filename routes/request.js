const express = require('express');
const router = express.Router();
const request = require('../controller/budgetRequest');
var md_auth = require('../middleware/authenticated');
router.get('/get-request', md_auth.ensureManagerAuth, request.getBudgetRequest);
router.post('/add-request', md_auth.ensureEmployeeAuth, request.addRequest);
router.put('/approved-request', md_auth.ensureManagerAuth, request.approvedRequest);
router.put('/change-budget', md_auth.ensureManagerAuth, request.changeBudgetByManager);
module.exports = router;
