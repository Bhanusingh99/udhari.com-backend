import { Customer } from "../models/customer.model.js";
import { TotalCustomerTransaction } from "../models/customerReports.model.js";
import { getRelativeTime } from "../utils/getRelativeTime.js";

// Controller for creating a new customer and adding a transaction to totalCustomerTransactions
export const createCustomer = async (req, res) => {
    try {
      const {
        customerName,
        number,
        description,
        reminder,
        money,
        reminderDescription,
        transactionType,
      } = req.body;
  
      // Validate required fields
      if (!customerName || !transactionType || !money) {
        return res.status(400).json({
          success: false,
          message: 'Customer name and transaction type and money are required',
        });
      }
  
      // Create a new customer
      const newCustomer = new Customer({
        customerName,
        number,
        money,
        description,
        reminder,
        reminderDescription,
        transactionType,
      });
  
      // Save the new customer
      const savedCustomer = await newCustomer.save();
  
      // Find the TotalCustomerTransaction document and push the new customer's ObjectId
      await TotalCustomerTransaction.findOneAndUpdate(
        {},
        { $push: { totalCustomerTransactions: savedCustomer._id } },
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
          date: getRelativeTime(customer.createdAt),
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