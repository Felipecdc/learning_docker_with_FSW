import { UserNotFoundError } from "../../errors/user.js";
export class GetTransacationByUserIdUseCase {
    constructor(getTransacationByUserIdRepository, getUserByIdRepository) {
        (this.getTransacationByUserIdRepository =
            getTransacationByUserIdRepository),
            (this.getUserByIdRepository = getUserByIdRepository);
    }
    async execute(params) {
        const user = this.getUserByIdRepository.execute(params.userId);

        if (!user) {
            throw new UserNotFoundError(params.userId);
        }

        const transactions = this.getTransacationByUserIdRepository.execute(
            params.userId
        );

        return transactions;
    }
}
