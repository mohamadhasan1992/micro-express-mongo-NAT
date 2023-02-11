import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
    statusCode = 500;
    reason = 'Error connecting ro database!'
    constructor(){
        super();
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }

    serializeError(){
        return [
            {
                message: this.reason
            }
        ]
    }
}