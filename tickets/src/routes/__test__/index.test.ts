import request from 'supertest';
import { app } from '../../app';


const createTicket = () => {
    let title = 'ticket 1';
    let price = 10;

    return request(app)
                     .post('/api/tickets')
                     .set('Cookie', global.signin())
                     .send({
                         title,
                         price
                     });
}

it('can fetch a list of tickets', async() => {
     // create ticket and get id
    await createTicket();
    await createTicket();
    await createTicket();

    const response = await request(app)
        .get('/api/tickets')
        .send()
    
    expect(response.body.length).toEqual(3)
 
})