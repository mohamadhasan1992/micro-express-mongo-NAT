import express, {Response, Request, NextFunction} from "express";
import { body } from "express-validator";
import {BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest} from '@microtickets_mh/common';
import mongoose from "mongoose";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";


const router = express.Router();

const EXPIRATION_SECONDS = 15 * 60;

router.post('/api/orders', 
    requireAuth,
    [
        body('ticketId')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('ticketId must be provided!')
    ],
    validateRequest,
        async(req:Request, res: Response, next: NextFunction) => {
            const {ticketId} = req.body;
            // check ticket if exist 
            const ticket = await Ticket.findById(ticketId)
            if(!ticket){
                return next(new NotFoundError())
            }
            // check for ticket if its not reserved
            const isReserved  = await ticket.isReserved();
            if(isReserved){
                return next(new BadRequestError('ticket is reserved!'))
            }
            // calc expirationData for this order expires after 15min
            const expiration = new Date();
            expiration.setSeconds(expiration.getSeconds() + EXPIRATION_SECONDS);
            // save it to DB 
            const newOrder = Order.build({
                userId: req.currentUser!.id,
                status: OrderStatus.Created,
                expiresAt: expiration,
                ticket
            })
            await newOrder.save()
            
            // publish an event order:created
            res.status(201).send(newOrder);
    });


export {router as newOrderRouter};

