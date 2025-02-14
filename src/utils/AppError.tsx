export abstract class AppError extends Error {
   private _message: string
   private _code: string
    constructor(message: string, code:string = "APP_ERROR") {
        super(message);
        this._message = message;
        this._code = code;
    }

    /**
     * @override default returned value when object is treated as value
     * @returns {string} [code - message]
     */
    public valueOf(): string {
        return `[${this._code}] ${this._message}`;
    }

    /** @override default
     * @returns {string} [code - message]
     */
    public toString(): string {
        return this.valueOf();
    }
}

export class NetworkError extends AppError {
    constructor(message: string) {
        super(message, "NETWORK_ERROR");
    }
}

export class InvalidError extends AppError {
    constructor(message: string) {
        super(message, "INVALID_ERROR");
    }
}

export class AuthError extends AppError {
    constructor(message: string) {
        super(message, "AUTH_ERROR");
    }
}