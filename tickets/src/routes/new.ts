import express, { NextFunction, Request, Response }  from "express";
import {requireAuth, validateRequest} from "@microtickets_mh/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router();


router.post('/api/tickets', requireAuth ,[
    body("title")
    .not()
    .isEmpty()
    .withMessage('titile is provided'),
    body("price")
    .isFloat({ gt: 0 })
    .withMessage('price must be valid price'),

], 
validateRequest,
async(req: Request,res: Response,next: NextFunction) => {
    const {title, price} = req.body;
    let newTicket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id
    }); 
    await newTicket.save();
    // publish event
    await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: newTicket.id,
        title: newTicket.title,
        price: newTicket.price,
        userId: newTicket.userId
    });
    res.status(201).send(newTicket);
})


export {router as createTicketRouter};