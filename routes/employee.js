const express = require('express');
const router = express.Router();
const employee = require('../controller/employee');
var md_auth = require('../middleware/authenticated');
router.post('/add-employee', employee.addEmployees);
router.patch(
  '/edit-employee/:id',
  md_auth.ensureManagerAuth,
  employee.updateEmployee,
);
router.delete('/delete-employee/:id', employee.deleteEmployee);
router.get(
  '/get-employeebycompanyId',
  md_auth.ensureManagerAuth,
  employee.getEmployeeByCompany,
);
router.get('/get-totalemployee:companyId?', employee.totalEmployee);
router.get('/get-employee', employee.getEmployee);
module.exports = router;
