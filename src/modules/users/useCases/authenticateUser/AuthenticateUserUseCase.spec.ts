import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


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

        // authenticate the created user
        const tokenInfo = await authenticateUserUseCase.execute({
            email: user.email,
            password: "john123"
        });

        expect(tokenInfo).toHaveProperty("token");
    });

    it("should not be able to authenticate an user with a wrong email", async () => {
        await expect(async () => {
            // create a user
            const user = await createUserUseCase.execute({
                name: "John",
                email: "john@example.com",
                password: "john123"
            });

            // authenticate the created user
            const tokenInfo = await authenticateUserUseCase.execute({
                email: "wrong@example.com",
                password: "john123"
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);


    });

    it("should be able to authenticate an user with the wrong password", async () => {
        await expect(async () => {
            // create a user
            const user = await createUserUseCase.execute({
                name: "John",
                email: "john@example.com",
                password: "john123"
            });

            // authenticate the created user
            const tokenInfo = await authenticateUserUseCase.execute({
                email: user.email,
                password: "john1234"
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);


    });
});