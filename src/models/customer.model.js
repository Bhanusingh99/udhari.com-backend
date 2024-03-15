import mongoose, { Schema } from "mongoose";

const customerSchema = new Schema(
  {
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
    },
    number: {
      type: Number,
    },
    description: {
      type: String,
    },
    money:{
      type:Number,
      required:[true,"money is required"]
    },
    bgColor:{
      type:String,
      required:true
    },
    transactionType: {
      type: String,
      enum: ["CASH", "CREDIT"],
      required: [true, "Transaction type is required"],
    },
    userId:{
      type:String
    }
  },
  { timestamps: true }
);

// Avoid using Date.now() directly in the schema; instead, use a default function
customerSchema.pre("save", function (next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});

export const Customer = mongoose.model("Customer", customerSchema);
