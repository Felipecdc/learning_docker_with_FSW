import { v4 as uuidv4 } from "uuid";
import { hash } from "bcrypt";
import { EmailALreadyInUseError } from "../../errors/user.js";

export class CreateUserUseCase {
    constructor(getUserByEmailRepository, createUserRepository) {
        (this.createUserRepository = createUserRepository),
            (this.getUserByEmailRepository = getUserByEmailRepository);
    }
    async execut(createUserParams) {
        const userWithProvidedEmail =
            await this.getUserByEmailRepository.execute(createUserParams.email);

        if (userWithProvidedEmail) {
            throw new EmailALreadyInUseError(createUserParams.email);
        }

        const userId = uuidv4();

        const hashedPassword = await hash(createUserParams.password, 10);

        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        };

        const createUser = await this.createUserRepository.execute(user);

        return createUser;
    }
}
