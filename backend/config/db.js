import mongoose from 'mongoose'

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI,{
            dbName:'E-Commerce',
        })
        console.log('DB connected Successfully...!')
    } catch (error) {
        console.log('DB connection Failed', error)
        process.exit(1)
    }
}

export default connectDB;