import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it('returns 404 if provided id does not exist', async() => {
    const validId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
    .put(`/api/tickets/${validId}`)
    .set('Cookie', global.signin())
    .send({
        title: 'title 1',
        price: 20
    })
    .expect(404);

})


it('returns 401 if user not authenticated', async() => {
    const validId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
    .put(`/api/tickets/${validId}`)
    .send({
        title: 'title 1',
        price: 20
    })
    .expect(401);
})
it('returns 401 if user doesnt own ticket', async() => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'title1',
            price: 20
        });
    await request(app)
            .put(`/api/tickets/${response.body.id}`)
            .set('Cookie', global.signin())
            .send({
                title: 'title2',
                price: 30
            }).expect(401)
})
it('returns 400 if provided title doew not valid', async() => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie )
        .send({
            title: 'title 1',
            price: 20
        });
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title: '',
        }).expect(400);
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title: 'title 2',
            price: -20
        }).expect(400);
})
it('updated ticket successfully', async() => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie )
        .send({
            title: 'title 1',
            price: 20
        });
    let updateResponse = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title: 'title 2',
            price: 40
        });
        expect(updateResponse.body.title).toEqual('title 2')
        expect(updateResponse.body.price).toEqual(40)
})