const Orders = require('../models/oders');
const Employee = require('../models/employee');
const employeeProducts = require('../models/employeeProducts');
const Company = require('../models/company');
const mongoose = require('mongoose');
const { sendEmail, getCurrentDate } = require('../global-functions/GlobalFunctions');
// const employee = require('../models/employee');
const Manager = require('../models/manager');
const orderCounter = require('../models/orderCounter');
const company = require('../models/company');
const ObjectId = mongoose.Types.ObjectId;
//Initialize the order number counter

// Function to generate the next invoice number
function generateInvoiceNumber(order) {
  order += 1;
  const invoiceNumber = `ODR-${order.toString().padStart(4, '0')}`;
  return invoiceNumber;
}
const mailOptionsF = (employeeEmail, managerEmail, companyName, orderInfo) => {
  console.log(orderInfo, 'orderInfo');
  const { bill, employeeProducts } = orderInfo;
  let productsTable = '';
  employeeProducts.forEach((product) => {
    const { productName, productSize, productImage, productPrice, productQuantity } = product;
    productsTable += `
      <div>
      <img src=${productImage}></img>
      <h3>Product Name: ${productName}</h3>
      <p>Size: ${productSize}</p>
      <p>Price: €${productPrice}</p>
      <p>Qty: ${productQuantity}</p>

    </div>
      \n`;
  });

  const htmlContent = `
  <p>Order Is Created For Employee Email : ${employeeEmail} from company : ${companyName} <p>
  <h2>Order Information : </h2>

      ${productsTable}
      <h3>Bill: €${bill}</h3>
`;
  return {
    from: 'sys.notification77@gmail.com',
    to: [managerEmail, employeeEmail, 'inhaber1977@gmail.com'],
    subject: `Hi , Order Created`,
    html: htmlContent,
  };
};

const addOrders = async (req, res) => {
  try {
    const ordersArray = req.body;
    const orders = [];
    const getFromOrderCollection = await Orders.find();
    const invoice = generateInvoiceNumber(getFromOrderCollection.length);
    for (let i = 0; i < ordersArray.length; i++) {
      const companybudget = await company.findById({
        _id: ordersArray[i].companyId,
      });
      const orderData = ordersArray[i];
      const { employeeId, bill, employeeProducts } = orderData;
      // Create the order object
      const orderObj = {
        employeeId,
        companyId: orderData.companyId,
        products: employeeProducts,
        companyName: orderData.companyName,
        bill: orderData.bill,
        quantity: orderData.quantity,
        comment: orderData.comment,
        invoice: invoice,
        createdAt: getCurrentDate(),
      };

      orders.push(orderObj);

      // Update employee budget if necessary
      const employee = await Employee.findById(employeeId);
      if (companybudget.budget != 0) {
        if (!employee || employee.budget < bill) {
          throw new Error('Invalid order - employee budget is insufficient');
        }
      }

      if (companybudget.budget === 1) {
        await Employee.findOneAndUpdate({ _id: employeeId }, { $inc: { budget: -bill } });
      }

      // Send email
      const mailOptions = mailOptionsF(orderData.employeeEmail, orderData.managerEmail, orderData.companyName, orderData);
      sendEmail(mailOptions);
    }

    const newOrders = await Orders.create(orders);

    res.status(200).send({
      result: newOrders,
      message: 'Orders have been created successfully!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Something went wrong!',
      error: error.message,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const getOrders = await Orders.aggregate([
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $project: {
          'result.employeePassword': 0,
          'result.companyName': 0,
          'result.productsId': 0,
        },
      },
    ]);
    res.status(200).send(getOrders);
  } catch (error) {
    console.log(error);
    res.send('Something went wrong').status(500);
  }
};
const totalOrder = async (req, res) => {
  try {
    const { companyId } = req.query;

    let pipeline = [
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $count: 'totalOrder',
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

    const getTotalOrders = await Orders.aggregate(pipeline);
    res.status(200).send(getTotalOrders);
  } catch (error) {
    console.log(error);
    res.send('Something went wrong').status(500);
  }
};

const getOrderByEmployeeId = async (req, res) => {
  const employeeId = req.query.employeeId;
  try {
    const getOrderByEmployeeId = await Orders.find({ employeeId });
    if (!getOrderByEmployeeId) {
      res.status(400).send({ message: 'ID not found' });
    } else {
      res.send(getOrderByEmployeeId);
    }
  } catch (error) {
    console.log(error);
    res.send('Something went wrong').status(500);
  }
};

const getOrderByCompanyId = async (req, res) => {
  const companyId = req.query.companyId;
  try {
    const getEmployeeByCompanyId = await Company.aggregate([
      {
        $match: {
          _id: new ObjectId(companyId),
        },
      },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'companyId',
          as: 'orders',
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
          'employees.companyName': 0,
          'employees.productsId': 0,
          'employees.companyId': 0,
        },
      },
    ]);
    res.status(200).send(getEmployeeByCompanyId);
  } catch (error) {
    console.log(error);
    res.send('Something went wrong').status(500);
  }
};
module.exports = {
  getOrderByCompanyId,
  getOrders,
  totalOrder,
  addOrders,
  getOrderByEmployeeId,
};
