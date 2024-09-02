import { UserNotFoundError } from "../../errors/user.js";
import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    requiredFieldIsMissing,
    serverError,
    userNotFoundResponse,
} from "../helpers/index.js";

export class GetTransactionsByUserIdController {
    constructor(getTransactionsByUserIdUseCase) {
        this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase;
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

            const transactions =
                await this.getTransactionsByUserIdUseCase.execute({ userId });

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
