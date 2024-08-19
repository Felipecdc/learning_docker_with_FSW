export class EmailALreadyInUseError extends Error {
    constructor(email) {
        super(`The e-mail ${email} is already in use.`);
        this.name = "EmailALreadyInUseError";
    }
}
