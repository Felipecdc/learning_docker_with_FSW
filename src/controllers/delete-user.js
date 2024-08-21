import { DeleteUserUseCase } from "../use-cases/index.js";
import {
    checkIfIdIsValid,
    invalidIdResponse,
    serverError,
    ok,
} from "./helpers/index.js";

export class DeleteUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.id;

            const idIsValid = checkIfIdIsValid(userId);

            if (!idIsValid) {
                return invalidIdResponse();
            }

            const deleteUserUseCase = new DeleteUserUseCase();

            const deleteUser = await deleteUserUseCase.execute(userId);

            return ok(deleteUser);
        } catch (error) {
            console.log(error);
            return serverError();
        }
    }
}
