import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe("Get Statement", () => {
    beforeEach(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    });

    it("should be get statement deposit", async () => {
        const user = await createUserUseCase.execute({
            email: "josi@gmail.com",
            name: "Josilene",
            password: "123",
        });

        const user_id = user.id as string;

        const statementDeposit = await createStatementUseCase.execute({
            user_id,
            type: OperationType.DEPOSIT,
            amount: 10.0,
            description: ""
        });

        const statement_id = statementDeposit.id as string;

        const result = await getStatementOperationUseCase.execute({
            user_id,
            statement_id,
        });

        expect(result).toHaveProperty("id");
        expect(result.amount).toBe(10);
        expect(result.id).toBe(statementDeposit.id);
        expect(result.user_id).toBe(statementDeposit.user_id);
    });

    it("should be get statement withdraw", async () => {
        const user = await createUserUseCase.execute({
            email: "josi@gmail.com",
            name: "Josilene",
            password: "123",
        });

        const user_id = user.id as string;

        await createStatementUseCase.execute({
            user_id,
            type: OperationType.DEPOSIT,
            amount: 10.0,
            description: "Deposit"
        });

        const statementWithdraw = await createStatementUseCase.execute({
            user_id,
            type: OperationType.WITHDRAW,
            amount: 5.0,
            description: "Withdraw"
        });

        const statement_id = statementWithdraw.id as string;
        const result = await getStatementOperationUseCase.execute({
            user_id,
            statement_id
        });

        expect(result).toHaveProperty("id");
        expect(result.amount).toBe(5);
        expect(result.id).toBe(statementWithdraw.id);
        expect(result.user_id).toBe(statementWithdraw.user_id);
    });

    it("should be not get statement if user don't exists", async () => {
        expect(async () => {

            const statementDeposit = await createStatementUseCase.execute({
                user_id: "1235654545",
                type: OperationType.DEPOSIT,
                amount: 10.0,
                description: ""
            });

            const statement_id = statementDeposit.id as string;
            await getStatementOperationUseCase.execute({
                user_id: "123568",
                statement_id
            });
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
    });

    it("should be not get statement if statement don't exists", async () => {
        expect(async () => {

            const user = await createUserUseCase.execute({
                email: "josi@gmail.com",
                name: "Josilene",
                password: "123",
            });

            const user_id = user.id as string;

            await getStatementOperationUseCase.execute({
                user_id,
                statement_id: "1236589"
            });
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
    });
});