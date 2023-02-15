import { NotFoundError, requireAuth, UnAuthorizedError } from "@microtickets_mh/common";
import express, {Response, Request, NextFunction} from "express";
import { Order } from "../models/order";
import { OrderStatus } from "@microtickets_mh/common";


const router = express.Router();


router.patch('/api/orders/:id', 
    requireAuth,
    async(req:Request, res: Response, next: NextFunction) => {
        const order = await Order.findById(req.params.id);
        if(!order){
            return next(new NotFoundError())
        }
        if(order.userId !== req.currentUser!.id){
            return next(new UnAuthorizedError())
        }
        order.status = OrderStatus.Cancelled;
        order.save();
        res.status(200).send(order);
    });


export {router as deleteOrderRouter};

