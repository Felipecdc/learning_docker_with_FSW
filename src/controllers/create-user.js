import { EmailALreadyInUseError } from "../errors/user.js";
import {
    checkIfEmailIsValid,
    checkIfPasswordIsValid,
    emailIsAlreadyInUserResponse,
    invalidPasswordResponse,
    badRequest,
    created,
    serverError,
} from "./helpers/index.js";

export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase;
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body;

            const requiredFields = [
                "first_name",
                "last_name",
                "email",
                "password",
            ];

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badRequest({ message: `Missing params: ${field}` });
                }
            }

            const passwordIsValid = checkIfPasswordIsValid(params.password);

            if (!passwordIsValid) {
                return invalidPasswordResponse();
            }

            const emailIsNotValid = checkIfEmailIsValid(params.email);

            if (!emailIsNotValid) {
                return emailIsAlreadyInUserResponse();
            }

            const createdUser = await this.createUserUseCase.execut(params);

            return created(createdUser);
        } catch (error) {
            if (error instanceof EmailALreadyInUseError) {
                return badRequest({ message: error.message });
            }
            console.log(error);
            return serverError();
        }
    }
}
