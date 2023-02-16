import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";
import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus } from "@microtickets_mh/common";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async() => {
    // create an instance of listener
    const listener = new OrderCancelledListener(natsWrapper.client);
    // create and save ticket
    const orderId = new mongoose.Types.ObjectId().toHexString(); 
    const ticket = Ticket.build({
        title: 'concert',
        price: 30,
        userId: new mongoose.Types.ObjectId().toHexString(),
    });
    ticket.set({ orderId: orderId });
    await ticket.save();

    // create fake event
    const data: OrderCancelledEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: ticket.id,
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, ticket, data, msg}
}

it('unLockes ticket using orderId', async() => {
    const {listener, ticket, data, msg} = await setup();

    await listener.onMessage(data, msg);

    // expect to find ticket and check orderId
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(natsWrapper.client.publish).toHaveBeenCalled();

})


// it('calls ack msg', async() => {
//     const {listener, ticket, data, msg} = await setup();

//     await listener.onMessage(data, msg);

//     expect(msg.ack).toHaveBeenCalled();
// });

// it('publishes a ticket updated event', async() => {
//     const {listener, ticket, data, msg} = await setup();
//     await listener.onMessage(data, msg);
//     expect(natsWrapper.client.publish).toHaveBeenCalled();
// })