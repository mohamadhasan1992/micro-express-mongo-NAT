import { CustomError } from "./custom-error";



export class UnAuthorizedError extends CustomError{
    statusCode = 403;
    constructor(){
        super()

        Object.setPrototypeOf(this, UnAuthorizedError.prototype)

    }
    serializeError(): { message: string; field?: string | undefined; }[] {
        return[{message: 'authorization error!'}]
    }
}