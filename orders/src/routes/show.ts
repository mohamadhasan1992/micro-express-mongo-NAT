import { NotFoundError, requireAuth, UnAuthorizedError } from "@microtickets_mh/common";
import express, {Response, Request, NextFunction} from "express";
import { Order } from "../models/order";



const router = express.Router();


router.get('/api/orders/:id', 
    requireAuth,
    async(req:Request, res: Response, next: NextFunction) => {
        const order = await Order.findById(req.params.id).populate('ticket');
        if(!order){
            return next(new NotFoundError());
        }
        if(order.userId !== req.currentUser!.id){
            return next(new UnAuthorizedError())
        }
        res.send(order);
    });


export {router as showOrderRouter};

