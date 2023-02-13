import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from "@microtickets_mh/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";


const router = express.Router();


router.put('/api/tickets/:id',
requireAuth,
[
    body('title')
    .not()
    .isEmpty()
    .withMessage('title is required')
    ,
    body('price')
    .isFloat({gt:0})
    .withMessage('price is required')
],
validateRequest,
async(req: Request,res: Response,next:NextFunction) => {
    let ticket = await Ticket.findById(req.params.id);
    if(!ticket){
        return next(new NotFoundError())
    }
    if(ticket.userId !== req.currentUser!.id){
        return next(new NotAuthorizedError())
    }
    ticket.set({
        title: req.body.title,
        price: req.body.price,
    })
    await ticket.save();
    res.send(ticket);
})



export {router as updateTicketRouter}