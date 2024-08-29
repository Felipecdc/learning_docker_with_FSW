import { userNotFoundResponse } from "../../controllers/helpers/index.js";

export class GetTransacationByUserIdUseCase {
    constructor(getTransacationByUserIdRepository, getUserByIdRepository) {
        (this.getTransacationByUserIdRepository =
            getTransacationByUserIdRepository),
            (this.getUserByIdRepository = getUserByIdRepository);
    }
    async execute(params) {
        const user = this.getUserByIdRepository.execute(params.userId);

        if (!user) {
            return userNotFoundResponse();
        }

        const transactions = this.getTransacationByUserIdRepository.execute(
            params.userId
        );

        return transactions;
    }
}
