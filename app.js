'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(
  cors({
    origin: '*',
  }),
);
// app.use(express.urlencoded({ extended: false }));

// Routes
// for auth
const employeeLogin = require('./routes/auth');
const employeeSignUp = require('./routes/auth');
const managerLogin = require('./routes/auth');
const adminLogin = require('./routes/auth');

// for upload CSV
// const upload = require('./routes/uploadCSV');

// for products
const addProduct = require('./routes/products');
const updateProduct = require('./routes/products');
const getProducts = require('./routes/products');
const getAllEmployeeProducts = require('./routes/products');
const deleteProduct = require('./routes/products');
const updateCompanyProduct = require('./routes/products');
const getProductsByCompanyId = require('./routes/products');
const getEmployeeProductsByCompanyId = require('./routes/products');
const getProductsByEmployeeId = require('./routes/products');

// for orders
const addOrder = require('./routes/order');
const getOrder = require('./routes/order');
const getTotalOrder = require('./routes/order');
const getOrderByEmployeeId = require('./routes/request');
const getOrderByCompanyId = require('./routes/request');

// for requests
const getRequest = require('./routes/request');
const addRequest = require('./routes/request');
const approvedRequest = require('./routes/request');
const changeBudgetByManager = require('./routes/request');

// for get employees
const getEmployeeByCompanyId = require('./routes/employee');
const getTotalEmployee = require('./routes/employee');
const getEmployee = require('./routes/employee');
const addEmployees = require('./routes/employee');
const editEmployee = require('./routes/employee');
const deleteEmployee = require('./routes/employee');

// for get companyDetails
const addCompany = require('./routes/company');
const editCompany = require('./routes/company');
const getCompanyDetails = require('./routes/company');
const getAllCompanies = require('./routes/company');

// for get manager
const addManagers = require('./routes/manager');
const editManager = require('./routes/manager');
const deleteManager = require('./routes/manager');
const getManagers = require('./routes/manager');
const getAllManagers = require('./routes/manager');
const getTotalManager = require('./routes/manager');
const getManagersByCompanyId = require('./routes/manager');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('tiny'));
// Middleware
app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization',
    'X-API-KEY',
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Access-Control-Allow-Request-Method',
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});
// These all are endpoint

// for Auth
app.use('/api/auth/', employeeLogin);
app.use('/api/auth/', employeeSignUp);
app.use('/api/auth/', managerLogin);
app.use('/api/auth/', adminLogin);

// for upload CSV
// app.use('/api/upload/', upload);

// for products
app.use('/api/product/', addProduct);
app.use('/api/product/', updateProduct);
app.use('/api/product/', getProducts);
app.use('/api/product/', getAllEmployeeProducts);
app.use('/api/product/', deleteProduct);
app.use('/api/product/', updateCompanyProduct);
app.use('/api/product/', getProductsByCompanyId);
app.use('/api/product/', getEmployeeProductsByCompanyId);
app.use('/api/product/', getProductsByEmployeeId);

// for orders
app.use('/api/order/', addOrder);
app.use('/api/order/', getOrder);
app.use('/api/order/', getTotalOrder);
app.use('/api/order/', getOrderByEmployeeId);
app.use('/api/order/', getOrderByCompanyId);

// for add request and approved request
app.use('/api/request/', getRequest);
app.use('/api/request/', addRequest);
app.use('/api/request/', approvedRequest);
app.use('/api/request/', changeBudgetByManager);

// for get employees
app.use('/api/employee/', editEmployee);
app.use('/api/employee/', addEmployees);
app.use('/api/employee/', deleteEmployee);
app.use('/api/employee/', getEmployeeByCompanyId);
app.use('/api/employee/', getEmployee);
app.use('/api/employee/', getTotalEmployee);
// for companyDetails
app.use('/ap/company/', addCompany);
app.use('/ap/company/', editCompany);
app.use('/api/company/', getCompanyDetails);
app.use('/api/company/', getAllCompanies);

// for mananger
app.use('/api/manager/', addManagers);
app.use('/api/manager/', editManager);
app.use('/api/manager/', deleteManager);
app.use('/api/manager/', getManagers);
app.use('/api/manager/', getAllManagers);
app.use('/api/manager/', getTotalManager);
app.use('/api/manager/', getManagersByCompanyId);

module.exports = app;
