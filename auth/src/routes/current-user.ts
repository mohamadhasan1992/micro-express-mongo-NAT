import express, { NextFunction, Request, Response } from "express";
import { CurrentUser } from "@microtickets_mh/common";
import { requireAuth } from "@microtickets_mh/common";

const router = express.Router();


router.get("/api/users/currentuser", 
    CurrentUser,
    requireAuth,
    (req:Request,res:Response, next: NextFunction) => {
    
    res.send({currentUser: req.currentUser || null})

})


export {router as currentUserRouter};