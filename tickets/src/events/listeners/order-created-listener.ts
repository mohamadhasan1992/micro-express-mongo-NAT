import { Listener, OrderCreatedEvent, Subjects } from "@microtickets_mh/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'],msg: Message){
        // find ticket 
        const ticket = await Ticket.findById(data.ticket.id);
        if(!ticket){
            throw new Error('Ticket Not Found!')
        }
        // update orderId of ticket
        ticket.set({orderId: data.id});
        await ticket.save();

        // publish an evnt
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        })
        // ack the message
        msg.ack();
    } 
}