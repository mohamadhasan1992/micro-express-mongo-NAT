import { Listener } from "@microtickets_mh/common";
import { OrderCreatedEvent } from "@microtickets_mh/common/build/events/order-created-event";
import { Subjects } from "@microtickets_mh/common/build/events/subjects";
import { queueGroupName } from "./queue-group-name";
import {Message} from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";


export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message){
        // enqueue a job
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        await expirationQueue.add(
            {
                orderId: data.id
            },{
                delay
            });
        msg.ack();
    }
}