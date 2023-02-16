import mongoose from "mongoose";
import request from "supertest"
import { app } from "../../app"
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it('delete user', async() => {
    // create ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20
    });
    await ticket.save();
    // create Order
    const user = global.signin();
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);
    // delete order
    const {body: deletedOrder} = await request(app)
            .patch(`/api/orders/${order.id}`)
            .set('Cookie', user)
            .send({
            }).expect(200);
});


it('emits a order cancelled', async() => {
     // create ticket
     const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20
    });
    await ticket.save();
    // create Order
    const user = global.signin();
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);
    // delete order
    const {body: deletedOrder} = await request(app)
            .patch(`/api/orders/${order.id}`)
            .set('Cookie', user)
            .send({
            }).expect(200)
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})
