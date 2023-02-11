import express, { NextFunction, Request, Response } from "express";
import { CurrentUser } from "../middlewares/current-user";
import { requireAuth } from "../middlewares/require-auth";

const router = express.Router();


router.get("/api/users/currentuser", 
    CurrentUser,
    requireAuth,
    (req:Request,res:Response, next: NextFunction) => {
    
    res.send({currentUser: req.currentUser || null})

})


export {router as currentUserRouter};