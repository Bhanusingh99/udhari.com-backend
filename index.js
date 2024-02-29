import express from 'express'
import cors from "cors"
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import  connectToDb  from './src/db/index.js'
import userRouter from './src/routes/index.js'

const app = express();

dotenv.config();
app.use(cors());
app.use(cookieParser());

const Port = process.env.PORT;
connectToDb()
app.use('/v1/api',userRouter)
app.listen(Port,()=>{
    console.log(`app is listening on post${Port}`)
})
