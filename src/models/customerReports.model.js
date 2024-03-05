import mongoose, { Schema } from "mongoose";

const customerReportSchema = new Schema(
  {
    name: {
      type: String,
      default: "Total customer transactions",
    },
    totalCustomerTransactions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Customer",
      },
    ],
  },
  { timestamps: true }
);

export const TotalCustomerTransaction = mongoose.model(
  "CustomerReport",
  customerReportSchema
);
