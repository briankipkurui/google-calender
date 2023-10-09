import { CustomError } from "./custom-error";

export class NotFoundGenericError extends CustomError {
    statusCode = 400;

    constructor(public message: string) {
        super(message);

        Object.setPrototypeOf(this, NotFoundGenericError.prototype);
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}