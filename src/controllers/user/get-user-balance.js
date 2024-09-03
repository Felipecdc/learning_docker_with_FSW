import { UserNotFoundError } from "../../errors/user.js";
import { ok } from "../helpers";
import {
    checkIfIdIsValid,
    invalidIdResponse,
    serverError,
    userNotFoundResponse,
} from "../helpers.js";

export class GetUserBalanceController {
    constructor(getUserBalanceUseCase) {
        this.getUserBalanceUseCase = getUserBalanceUseCase;
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId;

            const userIdIsValid = checkIfIdIsValid(userId);

            if (!userIdIsValid) {
                return invalidIdResponse();
            }

            const balance = await this.getUserBalanceUseCase.execute({
                userId,
            });

            return ok(balance);
        } catch (error) {
            console.log(error);
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse();
            }
            return serverError();
        }
    }
}
