const company = require('../models/company');
const employeeProduct = require('../models/employeeProducts');
const mongoose = require('mongoose');
const { sendEmail, getCurrentDate } = require('../global-functions/GlobalFunctions');
const Employee = require('../models/employee');
const ObjectId = mongoose.Types.ObjectId;
const addEmployees = async (req, res) => {
  try {
    const { employeeName, employeePassword, employeeEmail, gender, companyName, employeePhone, companyId, products } =
      req.body;

    const productsArray = products.map((product) => {
      const { productName, productSize, productImage, productPrice } = product;
      return {
        productName,
        productSize,
        productImage,
        productPrice,
      };
    });

    const employeeProductObj = {
      products: productsArray,
      companyId: companyId,
    };

    const createdEmployeeProducts = await employeeProduct.create([employeeProductObj]);
    const employeeObj = {
      productId: createdEmployeeProducts[0]._id,
      employeeName: employeeName,
      employeePassword: employeePassword,
      employeeEmail: employeeEmail,
      gender: gender,
      budget: budget,
      companyName: companyName,
      employeePhone: employeePhone,
      companyId: companyId,
      createdAt: getCurrentDate(),
    };
    const getCompany = await company.findById(companyId);
    console.log(getCompany);
    const newEmployee = await Employee.create([employeeObj]);
    // Check if the employee creation was successful
    if (newEmployee) {
      let budgetStatus;
      if (getCompany.budget === 0) {
        budgetStatus = 0;
      } else if (getCompany.budget === 1) {
        budgetStatus = 1;
      }
      // Update the budgetStatus using the newly created employee's _id
      const updatedRequest = await Employee.findOneAndUpdate(
        { _id: newEmployee[0]._id },
        { $set: { budgetStatus } },
        { new: true },
      );
      res.status(200).send({
        employee: updatedRequest,
        products: createdEmployeeProducts,
        message: 'New employee has been added!',
      });
    } else {
      // Handle any error that occurred during employee creation
      res.status(500).send('Failed to create a new employee.');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Something went wrong!',
      error,
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeName, employeePassword, employeeEmail, gender, budget, employeePhone } = req.body;

    // Create an object with the updated employee data
    const updatedEmployee = {
      employeeName,
      employeePassword,
      employeeEmail,
      employeePhone,
      gender,
      budget,
    };
    // Find the employee by ID and update their record
    const employee = await Employee.findByIdAndUpdate(id, updatedEmployee, {
      new: true,
    });
    if (!employee) {
      // If no employee is found with the given ID, return an error response
      return res.status(404).send({
        message: 'Employee not found!',
      });
    }

    res.status(200).send({
      result: employee,
      message: 'Employee record has been updated!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Something went wrong!',
      error,
    });
  }
};
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params; // Get the product ID from the request parameters

    const result = await Employee.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).send({
        message: 'Employee not found!',
      });
    }
    res.status(200).send({
      message: 'Employee has been deleted!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Something went wrong!',
      error,
    });
  }
};

const getEmployeeByCompany = async (req, res) => {
  const companyId = req.query.companyId;
  try {
    const getEmployeeByCompanyId = await company.aggregate([
      {
        $match: {
          _id: new ObjectId(companyId),
        },
      },
      {
        $lookup: {
          from: 'employees',
          localField: '_id',
          foreignField: 'companyId',
          as: 'result',
        },
      },
      {
        $project: {
          'result.employeePassword': 0,
          'result.companyName': 0,
          'result.productsId': 0,
          'result.companyId': 0,
        },
      },
    ]);
    res.status(200).send(getEmployeeByCompanyId);
  } catch (error) {
    console.log(error);
    res.send('Something went wrong').status(500);
  }
};
const totalEmployee = async (req, res) => {
  try {
    const { companyId } = req.query;
    let pipeline = [
      {
        $count: 'totalEmployee',
      },
    ];
    if (companyId) {
      pipeline = [
        {
          $match: { companyId: new ObjectId(companyId) },
        },
        ...pipeline,
      ];
    }
    const getTotalEmployee = await Employee.aggregate(pipeline);
    res.status(200).send(getTotalEmployee);
  } catch (error) {
    console.log(error);
    res.send('Something went wrong').status(500);
  }
};
const getEmployee = async (req, res) => {
  try {
    const managers = await Employee.find(); // Query the database to retrieve all the managers
    res.status(200).send(managers); // Return a 200 response with the managers array
  } catch (error) {
    res.status(500).send('Something went wrong'); // If there was an error during the database query, return a 500 response
  }
};
module.exports = {
  addEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployeeByCompany,
  totalEmployee,
  getEmployee,
};
