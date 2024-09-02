import {
    CreateTransactionController,
    GetTransactionsByUserIdController,
} from "../../controllers/index.js";
import {
    PostgresCreateTransactionRepository,
    PostgresGetUserByIdRepository,
    PostgresGetTransactionsByUserIdRepository,
} from "../../repositories/postgres/index.js";
import {
    CreateTransactionUseCase,
    GetTransactionsByUserIdUseCase,
} from "../../use-cases/index.js";

export const makeCreateTransactionController = () => {
    const createTransactionRepository =
        new PostgresCreateTransactionRepository();

    const getUserByIdRepository = new PostgresGetUserByIdRepository();

    const createTransactionsUseCase = new CreateTransactionUseCase(
        createTransactionRepository,
        getUserByIdRepository
    );

    const createTransactionController = new CreateTransactionController(
        createTransactionsUseCase
    );

    return createTransactionController;
};

export const makeGetTrasactionsByUserIdController = () => {
    const getTransactionsByUserIdRepository =
        new PostgresGetTransactionsByUserIdRepository();

    const getUserByIdRepository = new PostgresGetUserByIdRepository();

    const getTransactionsByUserIdUseCase = new GetTransactionsByUserIdUseCase(
        getTransactionsByUserIdRepository,
        getUserByIdRepository
    );

    const getTransactionsByUserIdController =
        new GetTransactionsByUserIdController(getTransactionsByUserIdUseCase);

    return getTransactionsByUserIdController;
};
