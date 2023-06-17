const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const employeeProduct = require('../models/employeeProducts');
const companyProducts = require('../models/companyProducts');
const company = require('../models/company');
const allProducts = require('../models/allProducts');
const employee = require('../models/employee');
const addProducts = async (req, res) => {
  const { productName, productImage } = req.body;
  try {
    // Create the order object
    const orderObj = {
      productName: productName,
      productImage: productImage,
    };
    const newProducts = await allProducts.create(orderObj);
    res.status(200).send({
      result: newProducts,
      message: 'Product have been created successfully!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Something went wrong!',
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, productImage } = req.body;

    const existingProduct = await allProducts.findOne({
      _id: id,
    });
    if (!existingProduct) {
      return res.status(404).send({
        message: 'Product not found!',
      });
    }
    // Update the product properties with the provided values or use the default values from the existing product
    const updatedProductName = productName || existingProduct.productName;
    const updatedProductImage = productImage || existingProduct.productImage;

    // Perform the update operation
    const products = await allProducts.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          productName: updatedProductName,
          productImage: updatedProductImage,
        },
      },
      { new: true },
    );

    res.status(200).send({
      result: products,
      message: 'Product has been updated!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Something went wrong!',
      error,
    });
  }
};
const updateCompanyProduct = async (req, res) => {
  try {
    const { id } = req.params; // Get the product ID from the request parameters
    // Retrieve the updated product data from the request body
    const { productName, productSize, productImage, productPrice } = req.body;

    // Fetch the existing product data from the database
    const existingProduct = await companyProducts.findOne({
      'products._id': id,
    });
    if (!existingProduct) {
      return res.status(404).send({
        message: 'Product not found!',
      });
    }
    // Update the product properties with the provided values or use the default values from the existing product
    const updatedProductName = productName || existingProduct.productName;
    const updatedProductSize = productSize || existingProduct.productSize;
    const updatedProductImage = productImage || existingProduct.productImage;
    const updatedProductPrice = productPrice || existingProduct.productPrice;

    // Perform the update operation
    const products = await companyProducts.findOneAndUpdate(
      {
        'products._id': id,
      },
      {
        $set: {
          'products.$.productName': updatedProductName,
          'products.$.productSize': updatedProductSize,
          'products.$.productImage': updatedProductImage,
          'products.$.productPrice': updatedProductPrice,
        },
      },
      { new: true },
    );

    res.status(200).send({
      result: products,
      message: 'Product has been updated!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Something went wrong!',
      error,
    });
  }
};

const getProductsByEmployeeId = async (req, res) => {
  const employeeId = req.query.employeeId;
  try {
    const employeeProducts = await employee.aggregate([
      {
        $match: {
          _id: new ObjectId(employeeId),
        },
      },
      {
        $lookup: {
          from: 'employeeproducts',
          localField: 'productsId',
          foreignField: '_id',
          as: 'products',
        },
      },
      {
        $project: {
          employeePassword: 0,
          companyName: 0,
          companyId: 0,
          productsId: 0,
        },
      },
    ]);
    res.status(200).send(employeeProducts);
  } catch (error) {
    res.send('Something went wrong').status(500);
  }
};
const getAllEmployeeProducts = async (req, res) => {
  try {
    const products = await employee.aggregate([
      {
        $lookup: {
          from: 'employeeproducts',
          localField: 'productsId',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $project: {
          employeePassword: 0,
          productsId: 0,
        },
      },
    ]);
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.send('Something went wrong').status(500);
  }
};
const getEmployeeProductByCompanyId = async (req, res) => {
  const companyId = req.query.companyId;
  console.log();
  try {
    const products = await company.aggregate([
      {
        $match: {
          _id: new ObjectId(companyId),
        },
      },
      {
        $lookup: {
          from: 'employeeproducts',
          localField: '_id',
          foreignField: 'companyId',
          as: 'products',
        },
      },
      {
        $lookup: {
          from: 'employees',
          localField: '_id',
          foreignField: 'companyId',
          as: 'employees',
        },
      },
      {
        $project: {
          'employees.employeePassword': 0,
          'employees.productsId': 0,
          'employees.companyId': 0,
        },
      },
    ]);
    return res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.send('Something went wrong').status(500);
  }
};
const getProductsByCompanyId = async (req, res) => {
  const companyId = req.query.companyId;
  try {
    const getProductsByCompanyId = await companyProducts.findOne({ companyId });
    console.log(getProductsByCompanyId);
    if (!getProductsByCompanyId) {
      res.status(400).send({ message: 'Product not found' });
    } else {
      res.send(getProductsByCompanyId);
    }
  } catch (error) {
    console.log(error);
    res.send('Something went wrong').status(500);
  }
};
const getAllProducts = async (req, res) => {
  try {
    const getProductsCollection = await allProducts.find();
    if (!getProductsCollection) {
      res.status(400).send({ message: 'Product not found' });
    } else {
      res.send(getProductsCollection);
    }
  } catch (error) {
    console.log(error);
    res.send('Something went wrong').status(500);
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params; // Get the product ID from the request parameters
    //find ID in companyProducts field
    const getProduct = await companyProducts.findOneAndUpdate({ 'products._id': id }, { $pull: { products: { _id: id } } });
    if (!getProduct) {
      return res.status(404).send({
        message: 'Product not found!',
      });
    }
    //find ID in employee collection
    const getReferenceId = await employeeProduct.findOneAndUpdate(
      { 'products._id': id },
      { $pull: { products: { _id: id } } },
    );
    if (!getReferenceId) {
      return res.status(404).send({
        message: 'Reference ID not found!',
      });
    }
    res.status(200).send({
      message: 'Product has been deleted!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Something went wrong!',
      error,
    });
  }
};

module.exports = {
  getAllEmployeeProducts,
  updateProduct,
  updateCompanyProduct,
  deleteProduct,
  getEmployeeProductByCompanyId,
  getProductsByCompanyId,
  getProductsByEmployeeId,
  getAllProducts,
  addProducts,
};
