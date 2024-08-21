import { hash } from "bcrypt";
import { EmailALreadyInUseError } from "../errors/user.js";
import { PostgresUpdateUserRepository } from "../repositories/postgres/update-user.js";
import { PostgresGetUserByEmailRepository } from "../repositories/postgres/get-user-by-email.js";

export class UpdateUserUseCase {
    async execute(userId, updateUserParams) {
        if (updateUserParams.email) {
            const postgresGetUserByEmailRepository =
                new PostgresGetUserByEmailRepository();

            const userWithProvidedEmail =
                await postgresGetUserByEmailRepository.execute(
                    updateUserParams.email
                );

            if (userWithProvidedEmail && updateUserParams.id !== userId) {
                throw new EmailALreadyInUseError(updateUserParams.email);
            }
        }

        const user = {
            ...updateUserParams,
        };

        if (updateUserParams.password) {
            const hashedPassword = await hash(updateUserParams.password, 10);

            user.password = hashedPassword;
        }

        const postgresUpdateUserRepository = new PostgresUpdateUserRepository();

        const updatedUser = await postgresUpdateUserRepository.execute(
            userId,
            user
        );

        return updatedUser;
    }
}
