import { EmailALreadyInUseError } from "../../errors/user.js";
import {
    checkIfEmailIsValid,
    checkIfIdIsValid,
    emailIsAlreadyInUserResponse,
    invalidIdResponse,
    invalidPasswordResponse,
    badRequest,
    ok,
    serverError,
} from "../helpers/index.js";

export class UpdateUserController {
    constructor(updateUserUseCase) {
        this.updateUserUseCase = updateUserUseCase;
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId;

            const isIdValid = checkIfIdIsValid(userId);

            if (!isIdValid) {
                return invalidIdResponse();
            }

            const params = httpRequest.body;

            const allowedFields = [
                "first_name",
                "last_name",
                "email",
                "password",
            ];

            const someFieldIsNotAllowed = Object.keys(params).some(
                (key) => !allowedFields.includes(key)
            );

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: "Some provided field id not allowed.",
                });
            }

            if (params.password) {
                const passwordIsValid = checkIfPasswordIsValid(params.password);

                if (!passwordIsValid) {
                    return invalidPasswordResponse();
                }
            }

            if (params.email) {
                const emailIsNotValid = checkIfEmailIsValid(params.email);

                if (!emailIsNotValid) {
                    return emailIsAlreadyInUserResponse();
                }
            }

            const updateUser = await this.updateUserUseCase.execute(
                userId,
                params
            );

            return ok(updateUser);
        } catch (error) {
            if (error instanceof EmailALreadyInUseError) {
                return badRequest({ message: error.message });
            }
            console.log(error);
            return serverError();
        }
    }
}
