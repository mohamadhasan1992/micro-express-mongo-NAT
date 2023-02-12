import mongoose from "mongoose";
import "express-errors";
import { app } from "./app";

// connecting to mongo
const startDb = async() => {
    if(!process.env.JWT_KEY){
        throw new Error('JWTKEY must be defined!')
    }
    if(!process.env.MONGO_URL){
        throw new Error('MONGO_URL must be defined!')
    }

    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('tickets-DB connection successed')
    }catch(err){
        console.log(err)
    }
}

startDb()
app.listen(3000, () => {
    console.log('tickets is listening on port 30000!!!!')
})