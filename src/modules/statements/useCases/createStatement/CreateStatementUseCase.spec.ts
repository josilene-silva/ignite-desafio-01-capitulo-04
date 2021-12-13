import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateStatementError} from "./CreateStatementError";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {
    beforeEach(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("should be create statement deposit", async () => {
        const user = await createUserUseCase.execute({
            email: "josi@gmail.com",
            name: "Josilene",
            password: "123",
        });

        const user_id = user.id as string;

        const result = await createStatementUseCase.execute({
            user_id,
            type: OperationType.DEPOSIT,
            amount: 10.0,
            description: ""
        });

        expect(result).toHaveProperty("id");
    });

    it("should be create statement withdraw", async () => {
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

        await createStatementUseCase.execute({
            user_id,
            type: OperationType.WITHDRAW,
            amount: 5.0,
            description: "Withdraw"
        });

        const result = await getBalanceUseCase.execute({ user_id });

        expect(result.balance).toEqual(5);
    });

    it("should be not create statement if user don't exists", async () => {
        expect(async () => {
            await createStatementUseCase.execute({
                user_id: "12356sas8",
                type: OperationType.DEPOSIT,
                amount: 10.0,
                description: ""
            });
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    });

    it("should be not create statement if insufficient funds", async () => {
        expect(async () => {

            const user = await createUserUseCase.execute({
                email: "josi@gmail.com",
                name: "Josilene",
                password: "123",
            });

            const user_id = user.id as string;

            await createStatementUseCase.execute({
                user_id,
                type: OperationType.WITHDRAW,
                amount: 10.0,
                description: ""
            });
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    });
});