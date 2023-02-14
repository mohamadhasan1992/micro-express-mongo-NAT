import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import  jwt  from "jsonwebtoken";
import { BadRequestError, RequestValidationError } from "@microtickets_mh/common";
import { User } from "../models/user";
import { Password } from "../services/password";

const router = express.Router();


router.post("/api/users/signin" ,[
    body('email')
        .isEmail()
        .withMessage('Email must be valid!'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Enter password')
],  async(req: Request,res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new RequestValidationError(errors.array()))
    }
    const {email, password} = req.body;    
    const existingUser = await User.findOne({email});
    if(!existingUser){
        return next(new BadRequestError('please enter your credential correctly!'));
    }
    const passwordMatch = await Password.compare(existingUser.password, password)
    if(!passwordMatch){
        return next(new BadRequestError('please enter your credential correctly!'));
    }
    // jwt
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    }, 
        process.env.JWT_KEY!
    );
    // add session
    req.session = {
        jwt: userJwt
    };

    res.status(201).send(existingUser)


})


export {router as signinRouter};