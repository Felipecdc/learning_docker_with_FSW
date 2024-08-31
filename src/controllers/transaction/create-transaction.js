import validator from "validator";
import { UserNotFoundError } from "../../errors/user.js";
import {
    badRequest,
    checkIfIdIsValid,
    created,
    invalidIdResponse,
    requiredFieldIsMissing,
    serverError,
    userNotFoundResponse,
    validateRequiredFileds,
} from "../helpers/index.js";

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

            const amountIsValid = validator.isCurrency(
                params.amount.toString(),
                {
                    digits_after_decimal: [2],
                    allow_negatives: false,
                    decimal_separator: ".",
                }
            );

            if (!amountIsValid) {
                return badRequest({
                    message: "The amount must be a valid currency.",
                });
            }

            const type = params.type.trim().toUpperCase();

            const typeIsValid = ["EARNING", "EXPENSE", "INVESTMENT"].includes(
                type
            );

            if (!typeIsValid) {
                return badRequest({
                    message: "The type must be EARNING, EXPENSE or INVESTMENT.",
                });
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
