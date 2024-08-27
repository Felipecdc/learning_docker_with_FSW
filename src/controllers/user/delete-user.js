import {
    checkIfIdIsValid,
    invalidIdResponse,
    serverError,
    ok,
    userNotFoundResponse,
} from "../helpers/index.js";

export class DeleteUserController {
    constructor(deleteUserUseCase) {
        this.deleteUserUseCase = deleteUserUseCase;
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId;

            const idIsValid = checkIfIdIsValid(userId);

            if (!idIsValid) {
                return invalidIdResponse();
            }

            const deleteUser = await this.deleteUserUseCase.execute(userId);

            if (!deleteUser) {
                return userNotFoundResponse();
            }

            return ok(deleteUser);
        } catch (error) {
            console.log(error);
            return serverError();
        }
    }
}
