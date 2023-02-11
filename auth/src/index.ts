import express from "express";
import {json} from "body-parser";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handlers";
import { NotFoundError } from "./errors/not-found-error";
import mongoose from "mongoose";
import "express-errors";
import cookieSession from "cookie-session";

const app = express();

app.set('trust proxy', true);

app.use(json());
app.use((
    cookieSession({
        signed: false,
        // secure: true // for https
    })
))

app.get("/", (req,res) => {
    res.send('hello')
})
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);


app.all('*', async(req, res, next) => {
    next(new NotFoundError());
})

app.use(errorHandler)



// connecting to mongo
const startDb = async() => {
    if(!process.env.JWT_KEY){
        throw new Error('JWTKEY must be defined!')
    }

    try{
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
        console.log('DB connection successed')
    }catch(err){
        console.log(err)
    }
}

startDb()
app.listen(3000, () => {
    console.log('auth is listening on port 30000!!!!')
})