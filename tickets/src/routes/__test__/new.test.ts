import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('has a routehandler listening to /api/tickets for post request', async() => {
    const response = await request(app)
                            .post('/api/tickets')
                            .send({});
    expect(response.status).not.toEqual(404);
})

it('checks authentication', async() => {
    const response = await request(app)
                            .post('/api/tickets')
                            .send({});
    expect(response.status).toBe(401);
})

it('returns a status other than 401 if the user is signed in', async() => {
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});
    // if it is not authenticated must be 401
    expect(response.status).not.toEqual(401);
})

it('checks for title validation', async() => {
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: "",
        price: 10
    });
    expect(response.status).toBe(400);

})


it('checks for prices validation', async() => {
    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: "test title",
        price: -10
    })
    .expect(400);
    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: "test title"
    })
    .expect(400);
})

it('creates valid tickt', async() => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);
    let title = 'ticket 1';
    let price = 10;
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title,
            price
        }).expect(201)
    tickets = await Ticket.find({});
    expect(tickets[0].price).toEqual(price)
    expect(tickets[0].title).toEqual(title)
    expect(tickets.length).toBe(1);

})
