import mongoose from "mongoose";
import request from "supertest"
import { app } from "../../app"
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";


const buildTicket = async() => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save()
    return ticket
};

it('fetched order for a particular user', async() => {
    // generate 3 tickt
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    let userA = global.signin()
    let userB = global.signin()
    // generate orders for ticket 1 user 1 
    await request(app)
        .post('/api/orders')
        .set('Cookie', userA)
        .send({ticketId: ticketOne.id})
        .expect(201);
    // generate orders for ticket 2 user 2
    await request(app)
        .post('/api/orders')
        .set('Cookie', userB)
        .send({ticketId: ticketTwo.id})
        .expect(201);
    await request(app)
        .post('/api/orders')
        .set('Cookie', userB)
        .send({ticketId: ticketThree.id})
        .expect(201);


    // make request to get orders user 2
    const responseB = await request(app)
            .get('/api/orders')
            .set('Cookie', userB)
            .expect(200)

    // make sure only get orders for user 2
    expect(responseB.body.length).toEqual(2)

    const responseA = await request(app)
            .get('/api/orders')
            .set('Cookie', userA)
            .expect(200)
    expect(responseA.body.length).toEqual(1) 

})
