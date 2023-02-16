import { Listener, OrderCancelledEvent, Subjects } from "@microtickets_mh/common"
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";


export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        // find ticket
        const ticket = await Ticket.findById(data.ticket.id);
        if(!ticket){
            throw new Error('ticket not found')
        }
        // unset orderId
        ticket.set({orderId: undefined});
        await ticket.save();

        // publishe event
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        });

        msg.ack();
    }
}