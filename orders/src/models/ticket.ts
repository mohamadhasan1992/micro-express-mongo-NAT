import { OrderStatus } from "@microtickets_mh/common";
import mongoose from "mongoose";
import { Order } from "./order";
import {updateIfCurrentPlugin} from "mongoose-update-if-current";


interface TicketAttrs {
    id: string;
    title: string;
    price: number;
}

interface TicketDoc extends mongoose.Document{
    title: string;
    price: number;
    version: number;
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


TicketSchmea.set('versionKey', "version");
TicketSchmea.plugin(updateIfCurrentPlugin);
TicketSchmea.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price,
    })
}

TicketSchmea.methods.isReserved = async function(){
    const existingOrders = await Order.findOne({
        ticket: this,
        status: {
            $nin: OrderStatus.Cancelled
        }
    })
    return !!existingOrders;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", TicketSchmea);


export {Ticket, TicketDoc}