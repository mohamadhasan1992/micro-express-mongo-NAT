import { natsWrapper } from "./nats-wrapper";

// connecting to mongo
const startDb = async() => {
    
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

    }catch(err){
        console.log(err)
    }
}

startDb()
