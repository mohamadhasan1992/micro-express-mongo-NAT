import { OrderStatus } from "@microtickets_mh/common";
import mongoose from "mongoose";
import { Order } from "./order";


interface TicketAttrs {
    title: string;
    price: number;
}

interface TicketDoc extends mongoose.Document{
    title: string;
    price: number;
    isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc>{
    build(attrs: TicketAttrs): TicketDoc;
}

const TicketSchmea = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        requried: true,
        ming: 0
    }

},{
    toJSON:{
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
});



TicketSchmea.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs)
}

TicketSchmea.methods.isReserved = async function(){
    const existingOrders = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitningPayment,
                OrderStatus.Complete,
            ]
        }
    })
    return !!existingOrders;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", TicketSchmea);


export {Ticket, TicketDoc}