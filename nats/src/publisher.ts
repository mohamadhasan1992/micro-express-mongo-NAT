import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";



// create client
const stan = nats.connect(
    'ticketing',
    "abs",
    {
        url: 'http://localhost:4222'
    }
);

stan.on('connect', async() => {
    console.log('publisher connects to nats')

    const publisher = new TicketCreatedPublisher(stan);
    try{
        await publisher.publish({
            id: '21365',
            title: "hello",
            price: 20
        })
    }catch(err){
        console.error(err)
    }
})