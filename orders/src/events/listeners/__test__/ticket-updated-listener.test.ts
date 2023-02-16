import { TicketUpdatedEvent } from "@microtickets_mh/common";
import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import {Message} from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedListener } from "../ticket-updated-listener";


const setup = async() => {
    // create an instance of listener
    const listener = new TicketUpdatedListener(natsWrapper.client);
    // create and save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 10,
    })
    await ticket.save();
    // create fake data event
    const data:TicketUpdatedEvent['data'] = {
        id: ticket.id,
        title: "cinema",
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 1,
    }
    // create fake message object
    // @ts-ignore
    const msg:Message = {
        ack: jest.fn()
    }

    return {listener, data, msg}
}



it('updates a ticket', async() => {
    const {listener, data, msg} = await setup();
    // call onMessage function
    await listener.onMessage(data, msg);
    // make sure ticket was updated
    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
    expect(ticket!.version).toEqual(1);

});
it('acks the message', async() => {
    const {listener, data, msg} = await setup();
    // call onMessage function
    await listener.onMessage(data, msg);
    // make sure event ack
    expect(msg.ack).toHaveBeenCalled();

});


it('does not call ack if the event has a skipped version', async() => {
    const {listener, data, msg} = await setup();
    // call onMessage function
    data.version = 10;
    try{
        await listener.onMessage(data, msg);
    }catch(err){

    }
    // make sure event ack
    expect(msg.ack).not.toHaveBeenCalled();

})