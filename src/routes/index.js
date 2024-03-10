import { Router } from "express";
import { forgotPassword, logIn, resetPassword, signUp, updatePassword } from "../controllers/auth.controller.js";
import { addNewCustomerEntry, createCustomer, getAllTransactions, getCustomerInfo, getSelectedCustomerHistory, searchApi } from "../controllers/Customer.controller.js";
import { generatePdf } from "../controllers/generatePdf.controller.js";
import { createItem } from "../controllers/items.controller.js";

const userRouter = Router();

userRouter.post('/sign-up',signUp);
userRouter.post('/log-in',logIn);
userRouter.post('/forgot-password',forgotPassword);
userRouter.post('/update-password',updatePassword);
userRouter.post('/change-password',resetPassword);
userRouter.post('/create-customer',createCustomer);
userRouter.get('/total-customers-transactions',getAllTransactions);
userRouter.post("/get-user-info",getCustomerInfo);
userRouter.post("/get-selected-customer-history",getSelectedCustomerHistory);
userRouter.post("/add-customer-history",addNewCustomerEntry);
userRouter.get("/search/:query",searchApi);
userRouter.post("/generate-invoice",generatePdf)
userRouter.post("/create-items",createItem);



export default userRouter;