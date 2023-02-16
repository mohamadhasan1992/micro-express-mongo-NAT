import { NotFoundError, requireAuth, UnAuthorizedError } from "@microtickets_mh/common";
import express, {Response, Request, NextFunction} from "express";
import { Order } from "../models/order";
import { OrderStatus } from "@microtickets_mh/common";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";


const router = express.Router();


router.patch('/api/orders/:id', 
    requireAuth,
    async(req:Request, res: Response, next: NextFunction) => {
        const order = await Order.findById(req.params.id).populate('ticket');
        if(!order){
            return next(new NotFoundError())
        }
        if(order.userId !== req.currentUser!.id){
            return next(new UnAuthorizedError())
        }
        order.status = OrderStatus.Cancelled;
        order.save();

        // publish orderCancelled
        new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ticket:{
                id: order.ticket.id,
            }
        });
        res.status(200).send(order);
    });


export {router as deleteOrderRouter};

