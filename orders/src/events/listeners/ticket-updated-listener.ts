import { Listener, Subjects, TicketUpdatedEvent } from "@microtickets_mh/common";
import { queueGroupName } from "./queue-group-name";
import {Message} from "node-nats-streaming"
import { Ticket } from "../../models/ticket";



export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {

        // check for version for concurrency
        const ticket = await Ticket.findOne({_id: data.id, version: data.version - 1});
        if(!ticket){
            throw new Error('Tickets not Found!')
        }

        const {title, price} = data;
        ticket.set({title, price});
        await ticket.save();

        msg.ack();
    }
}