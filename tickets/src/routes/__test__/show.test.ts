import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";



it('returns a 404 if cant find tickets', async() => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
            .get(`/api/tickets/${id}`)
            .send() 
            .expect(404)

})
it('returns a ticket if find tickets', async() => {
    // create ticket and get id
    let title = 'ticket 1';
    let price = 10;

    const ticket = await request(app)
                    .post('/api/tickets')
                    .set('Cookie', global.signin())
                    .send({
                        title,
                        price
                    }).expect(201);

    await request(app)
            .get(`/api/tickets/${ticket.body.id}`)
            .send()
            .expect(200)
})