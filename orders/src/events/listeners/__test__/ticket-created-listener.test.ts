import { TicketCreatedEvent } from "@microtickets_mh/common";
import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import {Message} from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";


const setup = async() => {
    // create an instance of listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    // create fake data event
    const data:TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
    }
    // create fake message object
    // @ts-ignore
    const msg:Message = {
        ack: jest.fn()
    }

    return {listener, data, msg}
}



it('creates and save a ticket', async() => {
    const {listener, data, msg} = await setup();
    // call onMessage function
    await listener.onMessage(data, msg);
    // make sure ticket was created
    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
});
it('acks the message', async() => {
    const {listener, data, msg} = await setup();
    // call onMessage function
    await listener.onMessage(data, msg);
    // make sure event ack
    expect(msg.ack).toHaveBeenCalled();

});