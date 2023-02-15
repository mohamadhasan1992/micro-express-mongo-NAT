import mongoose from "mongoose";
import request from "supertest"
import { app } from "../../app"
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";

it('delete user', async() => {
    // create ticket
    const ticket = Ticket.build({
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
})
