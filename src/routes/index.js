import { Router } from "express";
import { forgotPassword, logIn, resetPassword, signUp, updatePassword } from "../controllers/auth.controller.js";

const userRouter = Router();

userRouter.post('/sign-up',signUp)
userRouter.post('/log-in',logIn)
userRouter.post('/forgot-password',forgotPassword)
userRouter.post('/update-password',updatePassword)
userRouter.post('/change-password',resetPassword)



export default userRouter;