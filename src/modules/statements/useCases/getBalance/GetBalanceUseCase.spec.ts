import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Get Balance", () => {
    beforeEach(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("should be able to authenticate an user", async () => {
        const user = await createUserUseCase.execute({
            email: "josi@gmail.com",
            name: "Josilene",
            password: "123",
        });

        const user_id = user.id as string;
        const result = await getBalanceUseCase.execute({ user_id });

        expect(result).toHaveProperty("statement");
        expect(result).toHaveProperty("balance");
    });

    it("should be not get balance if user don't exists", async () => {
        expect(async () => {
            await getBalanceUseCase.execute({ user_id: "45825585" });
        }).rejects.toBeInstanceOf(GetBalanceError);
    });
});