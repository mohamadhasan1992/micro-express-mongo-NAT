import { NotFoundError } from "@microtickets_mh/common";
import express, { NextFunction, Request, Response } from "express";
import { Ticket } from "../models/ticket";


const router = express.Router();


router.get('/api/tickets', async(req: Request,res: Response,next:NextFunction) => {
    let tickets = await Ticket.find({});

    res.status(200).send(tickets);
})



export {router as indexTicketRouter}