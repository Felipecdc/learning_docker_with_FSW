import { UserNotFoundError } from "../../errors/user.js";
import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    requiredFieldIsMissing,
    serverError,
    userNotFoundResponse,
} from "../helpers/index.js";

export class GetTransactionByUserIdController {
    constructor(getTransactionByUserIdUseCase) {
        this.getTransactionByUserIdUseCase = getTransactionByUserIdUseCase;
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.query.userId;

            if (!userId) {
                return requiredFieldIsMissing("userId");
            }

            const userIdIsValid = checkIfIdIsValid(userId);

            if (!userIdIsValid) {
                return invalidIdResponse();
            }

            const transactions = await this.getTransactionByUserIdUseCase({
                userId,
            });

            return ok(transactions);
        } catch (error) {
            console.log(error);
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse();
            }
            return serverError();
        }
    }
}
