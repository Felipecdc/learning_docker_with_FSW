import { DeleteUserUseCase } from "../use-cases/index.js";
import {
    checkIfIdIsValid,
    invalidIdResponse,
    serverError,
    ok,
    userNotFoundResponse,
} from "./helpers/index.js";

export class DeleteUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId;

            const idIsValid = checkIfIdIsValid(userId);

            if (!idIsValid) {
                return invalidIdResponse();
            }

            const deleteUserUseCase = new DeleteUserUseCase();

            const deleteUser = await deleteUserUseCase.execute(userId);

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
