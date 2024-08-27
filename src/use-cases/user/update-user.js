import { hash } from "bcrypt";
import { EmailALreadyInUseError } from "../../errors/user.js";

export class UpdateUserUseCase {
    constructor(getUserByEmailRepository, updateUserRepository) {
        (this.getUserByEmailRepository = getUserByEmailRepository),
            (this.updateUserRepository = updateUserRepository);
    }
    async execute(userId, updateUserParams) {
        if (updateUserParams.email) {
            const userWithProvidedEmail =
                await this.getUserByEmailRepository.execute(
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

        const updatedUser = await this.updateUserRepository.execute(
            userId,
            user
        );

        return updatedUser;
    }
}
