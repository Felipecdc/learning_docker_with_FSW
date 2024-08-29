import validator from "validator";
import { badRequest, created, serverError } from "../helpers/http.js";
import { checkIfIdIsValid, invalidIdResponse } from "../helpers/user.js";

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase;
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body;

            const requiredFields = [
                "user_id",
                "name",
                "date",
                "amount",
                "type",
            ];

            for (const field of requiredFields) {
                if (
                    !params[field] ||
                    params[field].toString().trim().length === 0
                ) {
                    return badRequest({ message: `Missing params: ${field}` });
                }
            }

            const userIdIsValid = checkIfIdIsValid(params.user_id);

            if (!userIdIsValid) {
                return invalidIdResponse();
            }

            const amount = params.amount;

            if (amount <= 0) {
                return badRequest({
                    message: "The amount must be greater than 0.",
                });
            }

            const amountIsValid = validator.isCurrency(amount.toString(), {
                digits_after_decimal: [2],
                allow_negatives: false,
                decimal_separator: ".",
            });

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
                    message: "The type must be EARNING, EXPENSE or INVESTMENT",
                });
            }

            const transaction = await this.createTransactionUseCase.execute({
                ...params,
                type,
            });

            return created(transaction);
        } catch (error) {
            console.log(error);
            return serverError();
        }
    }
}
