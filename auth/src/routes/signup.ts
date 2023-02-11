import express, {NextFunction, Request, Response} from "express";
import {body, validationResult} from "express-validator";
import { BadRequestError } from "../errors/bad-request-error";
import { RequestValidationError } from "../errors/request-validation-error";
import { User } from "../models/user";
import jwt from "jsonwebtoken";

const router = express.Router();


router.post("/api/users/signup", [
    body('email')
        .isEmail()
        .withMessage('Email must be valid!'),
    body('password')
        .trim()
        .isLength({min: 4, max:20})
        .withMessage('password is not stromg!'),
], async (req: Request ,res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new RequestValidationError(errors.array()))
    }
    const {email, password} = req.body;
    const existingUser = await User.findOne({email});

    if(existingUser){
        return next(new BadRequestError('Email in use!'))
    }
    const user = User.build({email, password});
    await user.save();
    // jwt
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, 
        process.env.JWT_KEY!
    );
    // add session
    req.session = {
        jwt: userJwt
    };

    res.status(201).send(user)
})


export {router as signupRouter};