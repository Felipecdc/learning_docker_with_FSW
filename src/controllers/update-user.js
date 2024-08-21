import validator from "validator";
import { badRequest, ok, serverError } from "./helpers.js";
import { EmailALreadyInUseError } from "../errors/user.js";
import { UpdateUserUseCase } from "../use-cases/update-user.js";

export class UpdateUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId;

            const isIdValid = validator.isUUID(userId);

            if (!isIdValid) {
                return badRequest({
                    message: "The provided id is not valid.",
                });
            }

            const updateUserParams = httpRequest.body;

            const allowedFields = [
                "first_name",
                "last_name",
                "email",
                "password",
            ];

            const someFieldIsNotAllowed = Object.keys(updateUserParams).some(
                (key) => !allowedFields.includes(key)
            );

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: "Some provided field id not allowed.",
                });
            }

            if (updateUserParams.password) {
                const passwordIsNotValid = updateUserParams.password.length < 6;

                if (passwordIsNotValid) {
                    return badRequest({
                        message: "Password must be at least 6 characters.",
                    });
                }
            }

            if (updateUserParams.email) {
                const emailIsNotValid = validator.isEmail(
                    updateUserParams.email
                );

                if (!emailIsNotValid) {
                    return badRequest({
                        message: "Invalid e-mail. Please provide a valid one.",
                    });
                }
            }

            const updateUserUseCase = new UpdateUserUseCase();

            const updateUser = await updateUserUseCase.execute(
                userId,
                updateUserParams
            );

            return ok(updateUser);
        } catch (error) {
            if (error instanceof EmailALreadyInUseError) {
                return badRequest({ message: error.message });
            }
            console.log(error);
            return serverError();
        }
    }
}
