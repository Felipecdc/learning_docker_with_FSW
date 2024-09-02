import { UserNotFoundError } from "../../errors/user.js";
import {
    badRequest,
    checkIfAmountIsValid,
    checkIfIdIsValid,
    checkIfTypeIsValid,
    invalidAmountResponse,
    invalidIdResponse,
    invalidTypeResponse,
    ok,
    serverError,
    userNotFoundResponse,
} from "../helpers/index.js";

export class UpdateTransactionController {
    constructor(updateTransactionUseCase) {
        this.updateTransactionUseCase = updateTransactionUseCase;
    }
    async execute(httpRequest) {
        try {
            const idIsValid = checkIfIdIsValid(httpRequest.params.userId);

            if (!idIsValid) {
                return invalidIdResponse();
            }

            const params = httpRequest.body;

            const allowedFields = ["name", "date", "amount", "type"];

            const someFieldsIsNotAllowed = Object.keys(params).some(
                (field) => !allowedFields.includes(field)
            );

            if (someFieldsIsNotAllowed) {
                return badRequest({
                    message: "Some provided field is not allowed.",
                });
            }

            if (params.amount) {
                const amountIsValid = checkIfAmountIsValid(params.amount);

                if (!amountIsValid) {
                    return invalidAmountResponse();
                }
            }

            if (params.type) {
                const typeIsValid = checkIfTypeIsValid(params.type);

                if (!typeIsValid) {
                    return invalidTypeResponse();
                }
            }

            const transaction = this.updateTransactionUseCase.execute(
                httpRequest.params.userId
            );

            return ok(transaction);
        } catch (error) {
            console.log(error);
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse();
            }
            return serverError();
        }
    }
}
