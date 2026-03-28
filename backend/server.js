import  dotenv from 'dotenv'
// App config
dotenv.config();

import express from 'express'
import cors from 'cors'

// import path from 'path'
// import { fileURLToPath } from 'url'
import connectDB from './config/db.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';


// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// console.log("ENV TEST:", process.env);


const app  = express();
const port  = process.env.PORT || 5000;


connectDB();
connectCloudinary();


// middlewares
app.use(express.json())
app.use(cors())


// Api end points
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

app.get('/', (req, res)=>{
    res.send('Hello')
})



app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`)
})