import express from 'express'
import cors from "cors"
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import  connectToDb  from './src/db/index.js'
import userRouter from './src/routes/index.js'

const app = express();

dotenv.config();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true 
  }));
app.use(cookieParser());
app.use(express.json())

const Port = process.env.PORT;
connectToDb()
app.use('/v1/api',userRouter)

app.use("/v1/api/sign-up",(req,res)=>{
    res.send("Bhanu don")
})
app.use("/v1/api/log-in",(req,res)=>{
    res.send("Bhanu don")
})
// app.use("/v1/api/change-password",(req,res)=>{
//     res.send("Bhanu don")
// })

app.listen(Port,()=>{
    console.log(`app is listening on post${Port}`)
})
