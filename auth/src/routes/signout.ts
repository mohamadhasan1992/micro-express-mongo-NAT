import express, { NextFunction, Request, Response } from "express";



const router = express.Router();


router.get("/api/users/signout", (req: Request,res: Response, next:NextFunction) => {
    // clear cookie
    req.session = null;
    res.send({})
})


export {router as signoutRouter};