import { UserNotFoundError } from "../../errors/user.js";
import {
    checkIfIdIsValid,
    created,
    invalidIdResponse,
    requiredFieldIsMissing,
    serverError,
    userNotFoundResponse,
    validateRequiredFileds,
} from "../helpers/index.js";
import {
    checkIfAmountIsValid,
    checkIfTypeIsValid,
    invalidAmountResponse,
    invalidTypeResponse,
} from "../helpers/transaction.js";

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase;
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body;

            const requiredFields = [
                "name",
                "user_id",
                "date",
                "amount",
                "type",
            ];

            const { ok: someRequiredFieldWereProvided, missingField } =
                validateRequiredFileds(params, requiredFields);

            if (!someRequiredFieldWereProvided) {
                return requiredFieldIsMissing(missingField);
            }

            const userIdIsValid = checkIfIdIsValid(params.user_id);

            if (!userIdIsValid) {
                return invalidIdResponse();
            }

            const amountIsValid = checkIfAmountIsValid(params.amount);

            if (!amountIsValid) {
                return invalidAmountResponse();
            }

            const type = params.type.trim().toUpperCase();

            const typeIsValid = checkIfTypeIsValid(type);

            if (!typeIsValid) {
                return invalidTypeResponse();
            }

            const transaction = await this.createTransactionUseCase.execute({
                ...params,
                type,
            });

            return created(transaction);
        } catch (error) {
            console.log(error);
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse();
            }
            return serverError();
        }
    }
}
