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
    findByEvent(event: {id: string, version: number}) : Promise<TicketDoc | null>;
}

const ticketSchmea = new mongoose.Schema({
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

ticketSchmea.set('versionKey', "version");
ticketSchmea.plugin(updateIfCurrentPlugin);
ticketSchmea.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price,
    })
}
ticketSchmea.statics.findByEvent = async (event: {id: string, version: number}) => {
    return await Ticket.findOne({_id: event.id, version: event.version - 1})
}

ticketSchmea.methods.isReserved = async function(){
    const existingOrders = await Order.findOne({
        ticket: this,
        status: {
            $nin: OrderStatus.Cancelled
        }
    })
    return !!existingOrders;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchmea);


export {Ticket, TicketDoc}