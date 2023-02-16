import { OrderStatus } from "@microtickets_mh/common";
import mongoose from "mongoose";
import request from "supertest"
import { app } from "../../app"
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it('return error if ticket dows not exist', async() => {
    const ticketId = new mongoose.Types.ObjectId();
    await request(app)
            .post('/api/orders')
            .set('Cookie', global.signin())
            .send({
                ticketId
            }).expect(404);
})
it('return error if ticket already taken', async() => {
    // create ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20
    });
    await ticket.save();
    
    // create reserved order for ticket
    const order = Order.build({
        ticket,
        userId: 'randomId',
        status: OrderStatus.Created,
        expiresAt: new Date()
    });
    await order.save();
    await request(app)      
            .post('/api/orders')
            .set('Cookie', global.signin())
            .send({
                ticketId: ticket.id
            }).expect(400);
})
it('reserve ticket', async() => {
    // create ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20
    });
    await ticket.save();
    
    const order = await request(app)      
            .post('/api/orders')
            .set('Cookie', global.signin())
            .send({
                ticketId: ticket.id
            }).expect(201);
})


it('emits an order created event', async() => {
    // create ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20
    });
    await ticket.save();

    const order = await request(app)      
            .post('/api/orders')
            .set('Cookie', global.signin())
            .send({
                ticketId: ticket.id
            }).expect(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})