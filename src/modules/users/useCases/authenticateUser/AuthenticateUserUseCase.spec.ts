import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";


let usersRepositoryInMemory: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate a user", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });
    it("should be able to authenticate an user", async () => {
        // create a user
        const user = await createUserUseCase.execute({
            name: "John",
            email: "john@example.com",
            password: "john123"
        });

        // console.log("User", user);

        // authenticate the created user
        const tokenInfo = await authenticateUserUseCase.execute({
            email: user.email,
            password: "john123"
        });
        // console.log("tokenInfo", tokenInfo);

        expect(tokenInfo).toHaveProperty("token");
    });
});