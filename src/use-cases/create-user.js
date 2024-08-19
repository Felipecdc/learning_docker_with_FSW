import { v4 as uuidv4 } from "uuid";
import { hash } from "bcrypt";
import { PostgresCreateUserRepository } from "../repositories/postgres/create-user.js";
import { PostgresGetUserByEmailRepository } from "../repositories/postgres/get-user-by-email.js";

export class CreateUserUseCase {
    async execut(createUserParams) {
        const postgresGetUserByEmailRepository =
            new PostgresGetUserByEmailRepository();

        const userWithProvidedEmail =
            await postgresGetUserByEmailRepository.execute(
                createUserParams.email
            );

        if (userWithProvidedEmail) {
            throw new Error("The providade e-mail is already in use.");
        }

        const userId = uuidv4();

        const hashedPassword = await hash(createUserParams.password, 10);

        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        };

        const postgresCreateUserRepository = new PostgresCreateUserRepository();

        const createUser = await postgresCreateUserRepository.execute(user);

        return createUser;
    }
}
