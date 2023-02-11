import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnAuthorizedError } from "../errors/unauthorized-error";


export const requireAuth = (req: Request,res: Response,next: NextFunction) => {
    if(!req.currentUser){
        return next(new UnAuthorizedError())
    }
    next();
}