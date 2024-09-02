import { UserNotFoundError } from "../../errors/user.js";

export class UpdateTransactionUseCase {
    constructor(updateTransactionRepository, getUserByIdRepository) {
        this.updateTransactionRepository = updateTransactionRepository;
        this.getUserByIdRepository = getUserByIdRepository;
    }
    async execute(params) {
        const userId = await this.getUserByIdRepository.execute(params.userId);

        if (!userId) {
            throw new UserNotFoundError();
        }

        const transaction = await this.updateTransactionRepository.execute(
            params
        );

        return transaction;
    }
}
