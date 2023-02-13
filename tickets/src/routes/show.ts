import { NotFoundError } from "@microtickets_mh/common";
import express, { NextFunction, Request, Response } from "express";
import { Ticket } from "../models/ticket";


const router = express.Router();


router.get('/api/tickets/:id', async(req: Request,res: Response,next:NextFunction) => {
    let ticket = await Ticket.findById(req.params.id);
    if(!ticket){
        return next(new NotFoundError())
    }
    res.status(200).send(ticket);
})



export {router as showTicketsRouter}