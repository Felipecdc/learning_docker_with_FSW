import { EmailALreadyInUseError } from "../errors/user.js";
import { CreateUserUseCase } from "../use-cases/create-user.js";
import { badRequest, created, serverError } from "./helpers.js";
import validator from "validator";

export class CreateUserController {
    async execute(httpRequest) {
        try {
            const params = httpRequest.body;

            const requiredFields = [
                "first_name",
                "last_name",
                "email",
                "password",
            ];

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badRequest({ message: `Missing params: ${field}` });
                }
            }

            const passwordIsNotValid = params.password.length < 6;

            if (passwordIsNotValid) {
                return badRequest({
                    message: "Password must be at least 6 characters.",
                });
            }

            const emailIsNotValid = validator.isEmail(params.email);

            if (!emailIsNotValid) {
                return badRequest({
                    message: "Invalid e-mail, Please provide a valid one.",
                });
            }

            const createUserUseCase = new CreateUserUseCase();

            const createdUser = await createUserUseCase.execut(params);

            return created(createdUser);
        } catch (error) {
            if (error instanceof EmailALreadyInUseError) {
                return badRequest({ message: error.message });
            }
            console.log(error);
            return serverError();
        }
    }
}
