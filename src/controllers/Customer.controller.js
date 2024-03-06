// import { Customer } from "../models/customer.model.js";
import {Customer} from "../models/customer.model.js"
import { TotalCustomerTransaction } from "../models/customerReports.model.js";
import { selectedCustomerHistory } from "../models/selectedCustomeHistory.model.js";
import { getRelativeTime } from "../utils/getRelativeTime.js";

// Controller for creating a new customer and adding a transaction to totalCustomerTransactions
export const createCustomer = async (req, res) => {
  try {
    const { customerName, number, description, money, transactionType } = req.body;

    // Validate required fields
    if (!customerName || !transactionType || !money) {
      return res.status(400).json({
        success: false,
        message: 'Customer name, transaction type, and money are required',
      });
    }

    // Validate transactionType
    const validTransactionTypes = ['CASH', 'CREDIT']; // Add more as needed
    if (!validTransactionTypes.includes(transactionType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction type',
      });
    }

    // Create a new customer
    const newCustomer = new Customer({
      customerName,
      number,
      money,
      description,
      transactionType,
    });

    // Save the new customer
    const savedCustomer = await newCustomer.save();

    // Update TotalCustomerTransaction document
    await TotalCustomerTransaction.findOneAndUpdate(
      {},
      { $push: { totalCustomerTransactions: savedCustomer._id } },
      { upsert: true }
    );

    // Update selectedCustomerHistory document
    await selectedCustomerHistory.findOneAndUpdate(
      { customerId: savedCustomer._id },
      { $push: { transactionHistory: savedCustomer._id } },
      { upsert: true }
    );

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: savedCustomer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error creating customer',
      error: error.message,
    });
  }
};



// Controller for fetching all totalCustomerTransactions sorted by timestamp
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await TotalCustomerTransaction.find()
      .populate({
        path: 'totalCustomerTransactions',
        select: 'customerName createdAt number description transactionType money',
      })
      .sort({ createdAt: -1 })
      .exec();

    let totalCash = 0;
    let totalCredit = 0;

    // Extract customer details and calculate totalCash and totalCredit
    const customerDetails = transactions.map((transaction) =>
      transaction.totalCustomerTransactions.map((customer) => {
        const transactionDetails = {
          name: customer.customerName,
          id:customer._id,
          date: getRelativeTime(customer.createdAt),
          sortingDate:customer.createdAt,
          money: customer.money,
          transactionType: customer.transactionType,
        };

        if (customer.transactionType === 'CASH') {
          totalCash += customer.money;
        } else if (customer.transactionType === 'CREDIT') {
          totalCredit += customer.money;
        }

        return transactionDetails;
      })
    );

    // Flatten the array of customer details
    const allCustomerDetails = [].concat(...customerDetails);

    res.status(200).json({
      success: true,
      data: {
        transactions: allCustomerDetails,
        totalCash,
        totalCredit,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching all customer transactions',
      error: error.message,
    });
  }
};

export const getCustomerInfo = async (req, res) => {
  try {
    const { id } = req.body;

    // Add the 'await' keyword to resolve the promise returned by findById
    const user = await Customer.findById(id);

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching customer information',
      error: error.message,
    });
  }
};

export const getSelectedCustomerHistory = async (req, res) => {
  try {
    const { id } = req.body; // Assuming customer ID is part of the URL path
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Customer ID is required',
      });
    }

    const transactions = await selectedCustomerHistory
      .findOne({ customerId: id })
      .populate({
        path: 'transactionHistory',
        select: 'customerName createdAt number description transactionType money',
      })
      .sort({ createdAt: -1 })
      .exec();

    // Extract customer details and calculate totalCash and totalCredit
    // const customerDetails = transactions.map((transaction) =>
    //   transaction.totalCustomerTransactions.map((customer) => {
    //     const transactionDetails = {
    //       name: customer.customerName,
    //       id:customer._id,
    //       date: getRelativeTime(customer.createdAt),
    //       sortingDate:customer.createdAt,
    //       money: customer.money,
    //       transactionType: customer.transactionType,
    //     };

    //     if (customer.transactionType === 'CASH') {
    //       totalCash += customer.money;
    //     } else if (customer.transactionType === 'CREDIT') {
    //       totalCredit += customer.money;
    //     }

    //     return transactionDetails;
    //   })
    // );

    // Flatten the array of customer details
    // const allCustomerDetails = [].concat(...customerDetails);

    res.status(200).json({
      success: true,
      data: {
        transactions
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching all customer transactions',
      error: error.message,
    });
  }
};
