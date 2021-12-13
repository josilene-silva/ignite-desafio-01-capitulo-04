import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create user use case", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("should be enable to create a new user", async () => {
        const user = await createUserUseCase.execute({
            email: "josi@gmail.com",
            name: "Josilene",
            password: "123",
        });

        expect(user).toHaveProperty("id");
    });

    it("should not be able to create a new user with the same email", async () => {
        expect(async () => {
            await createUserUseCase.execute({
                email: "error@gmail.com",
                name: "Error",
                password: "123",
            });

            await createUserUseCase.execute({
                email: "error@gmail.com",
                name: "Error",
                password: "123",
            });
        }).rejects.toBeInstanceOf(CreateUserError);
    });
});