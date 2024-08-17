import { v4 as uuidv4 } from "uuid";
import { hash } from "bcrypt";
import { PostgresCreateUserRepository } from "../repositories/postgres/create-user.js";

export class CreateUserUseCase {
    async execut(createUserParams) {
        // TODO: verificar se user ja existe

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
