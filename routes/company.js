const express = require('express');
const router = express.Router();
const companyDetails = require('../controller/getCompanyDetails');
var md_auth = require('../middleware/authenticated');
router.post('/add-company', companyDetails.addCompany);
router.patch('/edit-company/:id', companyDetails.updateCompany);
router.get('/getCompanyDetails', companyDetails.getCompanyDetails);
router.get('/get-allcompanies', companyDetails.getAllCompanies);
module.exports = router;
