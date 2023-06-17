const Manager = require('../models/manager');
const Company = require('../models/company');
const addManagers = async (req, res) => {
  try {
    const { name, managerPassword, managerEmail, companyId, companyName } =
      req.body;
    const managerObj = {
      name: name,
      managerPassword: managerPassword,
      managerEmail: managerEmail,
      companyId: companyId,
      companyName: companyName,
    };
    const newManager = await Manager.create(managerObj);
    res.status(200).send({
      result: newManager,
      message: 'New manager has been added!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Something went wrong!',
      error,
    });
  }
};
const updateManager = async (req, res) => {
  try {
    const { id } = req.params; // Get the employee ID from the request parameters
    // Retrieve the updated employee data from the request body
    const { name, managerEmail, managerPassword } = req.body;

    // Create an object with the updated employee data
    const updatedManager = {
      name,
      managerEmail,
      managerPassword,
    };
    // Find the employee by ID and update their record
    const manager = await Manager.findByIdAndUpdate(id, updatedManager, {
      new: true,
    });
    if (!manager) {
      // If no employee is found with the given ID, return an error response
      return res.status(404).send({
        message: 'Employee not found!',
      });
    }
    res.status(200).send({
      result: manager,
      message: 'Manager record has been updated!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Something went wrong!',
      error,
    });
  }
};
const deleteManager = async (req, res) => {
  try {
    const { id } = req.params; // Get the product ID from the request parameters

    const result = await Manager.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send({
        message: 'Manager not found!',
      });
    }
    res.status(200).send({
      message: 'Manager has been deleted!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Something went wrong!',
      error,
    });
  }
};
const getManagers = async (req, res) => {
  try {
    const managers = await Manager.aggregate([
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $project: {
          'result.companyEmail': 0,
          'result.companyPhone': 0,
          'result.companyFax': 0,
          'result.companyLogo': 0,
        },
      },
    ]); // Query the database to retrieve all the managers
    res.status(200).send(managers); // Return a 200 response with the managers array
  } catch (error) {
    res.status(500).send('Something went wrong'); // If there was an error during the database query, return a 500 response
  }
};
const getManagersByCompanyId = async (req, res) => {
  const companyId = req.query.companyId;
  console.log(companyId);
  try {
    const getmanagers = await Company.aggregate([
      {
        $match: {
          _id: new ObjectId(companyId),
        },
      },
      {
        $lookup: {
          from: 'managers',
          localField: '_id',
          foreignField: 'companyId',
          as: 'managers',
        },
      },
    ]); // Query the database to retrieve all the managers
    res.status(200).send(getmanagers); // Return a 200 response with the managers array
  } catch (error) {
    res.status(500).send('Something went wrong'); // If there was an error during the database query, return a 500 response
  }
};
const getAllManagers = async (req, res) => {
  try {
    const managers = await Manager.find(); // Query the database to retrieve all the managers
    res.status(200).send(managers); // Return a 200 response with the managers array
  } catch (error) {
    res.status(500).send('Something went wrong'); // If there was an error during the database query, return a 500 response
  }
};
const totalManager = async (req, res) => {
  try {
    let pipeline = [
      {
        $count: 'totalManager',
      },
    ];
    const getTotalManager = await Manager.aggregate(pipeline);
    res.status(200).send(getTotalManager);
  } catch (error) {
    console.log(error);
    res.send('Something went wrong').status(500);
  }
};
module.exports = {
  addManagers,
  updateManager,
  deleteManager,
  getManagers,
  getManagersByCompanyId,
  getAllManagers,
  totalManager,
};
