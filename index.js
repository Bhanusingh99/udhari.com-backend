import express, { urlencoded } from 'express'
import cors from "cors"
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import  connectToDb  from './src/db/index.js'
import userRouter from './src/routes/index.js'
import { mailSender } from './src/utils/mailSender.js'
import { generateInvoice } from './src/utils/generatePdf.js'
import cloudinary from './src/utils/cloudinary.js'

const app = express();

dotenv.config();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true 
  }));
app.use(cookieParser());
app.use(express.json({
    limit:"2mb"
}));
app.use(express.urlencoded({
    extended:true,
    limit:"2mb"
}))



const Port = process.env.PORT;
connectToDb()
app.use('/v1/api',userRouter)


// mailSender("snghneha8@gmail.com","Hello From udhari.com")

app.use("/v1/api/sign-up",(req,res)=>{
    res.send("Bhanu don")
})
app.use("/v1/api/log-in",(req,res)=>{
    res.send("Bhanu don")
})

app.listen(Port,()=>{
    console.log(`app is listening on post${Port}`)
})
