import mongoose from "mongoose";
import "express-errors";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";


// connecting to mongo
const startDb = async() => {
    if(!process.env.JWT_KEY){
        throw new Error('JWTKEY must be defined!')
    }
    if(!process.env.MONGO_URL){
        throw new Error('MONGO_URL must be defined!')
    }
    if(!process.env.NATS_CLIENT_ID){
        throw new Error('NATSCLIENTID must be defined!')
    }
    if(!process.env.NATS_URL){
        throw new Error('NATS_URL must be defined!')
    }
    if(!process.env.NATS_CLUSTER_ID){ 
        throw new Error('NATS_CLUSTER_ID must be defined!')
    }
    
    try{
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
        natsWrapper.client.on('close', () => {
            console.log('Nats connection closed');
            process.exit();
        });

        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();


        await mongoose.connect(process.env.MONGO_URL);
        console.log('tickets-DB connection successed')
    }catch(err){
        console.log(err)
    }
}

startDb()
app.listen(3000, () => {
    console.log('tickets is listening on port 30000!!!!')
})