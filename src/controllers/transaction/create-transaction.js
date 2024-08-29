import { created, serverError } from "../helpers/http.js";
import {
    checkIfIdIsValid,
    checkIfTypeIsValid,
    invalidAmountResponse,
    invalidIdResponse,
    invalidTypeResponse,
    requiredFieldIsMissing,
    validateRequiredFileds,
} from "../helpers/index.js";
import { checkIfAmountIsValid } from "../helpers/index.js";

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
            return serverError();
        }
    }
}
