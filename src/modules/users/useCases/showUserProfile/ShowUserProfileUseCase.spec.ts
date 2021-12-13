import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Show user profile", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    });

    it("should be enable to show a profile user", async () => {
        const user = await createUserUseCase.execute({
            email: "josi@gmail.com",
            name: "Josilene",
            password: "123",
        });

        const user_id = user.id as string;
        const userProfile = await showUserProfileUseCase.execute(user_id);

        expect(userProfile).toHaveProperty("id");
        expect(userProfile).toHaveProperty("name");
        expect(userProfile).toHaveProperty("email");
        expect(userProfile.name).toEqual(user.name);
        expect(userProfile.email).toEqual(user.email);
    });

    it("should be not enable to show a profile if user don't exists", async () => {
        expect(async () => {
            await showUserProfileUseCase.execute("45825585");
        }).rejects.toBeInstanceOf(ShowUserProfileError);
    });
});