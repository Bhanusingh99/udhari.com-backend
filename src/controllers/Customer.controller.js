// import { Customer } from "../models/customer.model.js";
import {Customer} from "../models/customer.model.js"
import { TotalCustomerTransaction } from "../models/customerReports.model.js";
import { customerHistory } from "../models/customerTransactionHistory.model.js";
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
      { upsert: true, new:true }
    );

    // Update or create CustomerTrasactionHistory document for the customer
    const customerHistoryRecord = await customerHistory.findOneAndUpdate(
      { customerId: savedCustomer._id },
      {
        $push: {
          totalTrasaction: {
            money,
            description,
            transactionType,
          },
        },
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: savedCustomer,
      transactionHistory: customerHistoryRecord,
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
          customerName: customer.customerName,
          id:customer._id,
          createdAt: getRelativeTime(customer.createdAt),
          sortingDate:customer.createdAt,
          money: customer.money,
          description:customer.description,
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

    const transactions = await customerHistory
      .findOne({ customerId: id })
      .populate({
        path: 'totalTrasaction',
        select: 'createdAt description transactionType money',
      })
      .sort({ createdAt: -1 })
      .exec();

    // Calculate totalCash and totalCredit
    let totalCash = 0;
    let totalCredit = 0;

    // Extract customer details and calculate totalCash and totalCredit
    const customerDetails = transactions.totalTrasaction.map((transaction) => {
      const transactionDetails = {
        money: transaction.money,
        description: transaction.description,
        transactionType: transaction.transactionType,
        _id: transaction._id,
        createdAt: transaction.createdAt,
      };

      if (transaction.transactionType === 'CASH') {
        totalCash += transaction.money;
      } else if (transaction.transactionType === 'CREDIT') {
        totalCredit += transaction.money;
      }

      return transactionDetails;
    });

    // if (totalCredit > 0) {
    //   await Customer.findByIdAndUpdate(
    //     id,
    //     { 
    //       $inc: { money: totalCredit }, // Increment money by totalCredit
    //       $set: { transactionType: "CREDIT" } // Set transactionType to "CREDIT"
    //     },
    //     { new: true }
    //   );
    // }
    

    res.status(200).json({
      success: true,
      data: {
        transactions: customerDetails,
        totalCash,
        totalCredit,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer transactions',
      error: error.message,
    });
  }
};


export const addNewCustomerEntry = async (req, res) => {
  try {
    const { money, description, transactionType, customerId } = req.body;

    // Find the customer by ID
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    // Find or create the CustomerTrasactionHistory document for the customer
    const historyEntry = await customerHistory.findOneAndUpdate(
      { customerId },
      {
        $push: {
          totalTrasaction: {
            money,
            description,
            transactionType,
          },
        },
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: 'New entry added successfully',
      data: historyEntry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error adding new entry',
      error: error.message,
    });
  }
};

export const searchApi = async (req, res) => {
  const query = req.params.query;

  try {
    const results = await Customer.find({
      customerName: { $regex: query, $options: 'i' },
    });

    const customerDetails = results.map((customer) => {
      const transactionDetails = {
        customerName: customer.customerName,
        id: customer._id,
        createdAt: getRelativeTime(customer.createdAt), // or another timestamp property
        sortingDate: customer.createdAt,
        money: customer.money,
        transactionType: customer.transactionType,
      };

      return transactionDetails;
    });

    res.json({
      success: true,
      data: customerDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
