import nats,{Stan} from "node-nats-streaming";

class NatsWrapper{
    private _client?:Stan;
    // if connection is not completed it must return error
    get client(){
        if(!this._client){
            throw new Error('Cannot access client before connection!')
        }
        return this._client;
    }
    connect(clusterId: string, clientId: string, url: string): Promise<void>{
        this._client = nats.connect(clusterId, clientId, {url});

        

        return new Promise((resolve, reject) => {
            this.client.on('connect', () => {
                console.log('connected to nats');
                resolve();
            });
            this.client.on('error', (err) => {
                reject(err)
            })

        })
    }
}


export const natsWrapper = new NatsWrapper();