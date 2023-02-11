import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

interface UserPayLoad{
    email: string;
    id: string;
}

declare global{
    namespace Express{
        interface Request{
            currentUser?: UserPayLoad
        }
    }
}

export const CurrentUser = (req:Request, res:Response, next:NextFunction) => {
    // get jwt and set it to req.user
    if(!req.session?.jwt){
        return next();
    }
    try{
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayLoad;
        req.currentUser = payload;
    }catch(err){}
    next();
}