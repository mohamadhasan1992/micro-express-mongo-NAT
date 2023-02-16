import { OrderCreatedListener } from "../order-created-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";
import { OrderCreatedEvent, OrderStatus } from "@microtickets_mh/common";

const setup = async() => {
    // create an instance of listener
    const listener = new OrderCreatedListener(natsWrapper.client);
    // create and save ticket
    const ticket = await Ticket.build({
        title: 'concert',
        price: 30,
        userId: new mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();

    // create fake event
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        userId: "order user id",
        expiresAt: 'fake',
        version: 0,
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, ticket, data, msg}
}

it('lockes ticket using orderId', async() => {
    const {listener, ticket, data, msg} = await setup();

    await listener.onMessage(data, msg);

    // expect to find ticket and check orderId
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).toBeDefined();
    expect(updatedTicket!.orderId).toEqual(data.id);
})


it('calls ack msg', async() => {
    const {listener, ticket, data, msg} = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async() => {
    const {listener, ticket, data, msg} = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})