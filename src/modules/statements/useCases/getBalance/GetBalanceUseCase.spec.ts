import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { v4 as uuidv4 } from "uuid";

let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Get Balance", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory);
    });

    it("should be able to list all statements and balance", async () => {
        //create a user
        const user = await createUserUseCase.execute({
            name: "John",
            email: "john@example.com",
            password: "john123"
        });

        // autenticate user 
        const tokenInfo = await authenticateUserUseCase.execute({
            email: user.email,
            password: "john123"
        });

        const user_id = tokenInfo.user.id as string;

        const response = await getBalanceUseCase.execute({ user_id });

        expect(response).toHaveProperty("statement");
        expect(response).toHaveProperty("balance");

    });

    it("should not be able to list all statements and balance with unauthenticated user", () => {
        expect(async () => {
            //create a user
            const user = await createUserUseCase.execute({
                name: "John",
                email: "john@example.com",
                password: "john123"
            });

            // autenticate user 
            const tokenInfo = await authenticateUserUseCase.execute({
                email: user.email,
                password: "john123"
            });

            // user is not athenticated
            const user_id = uuidv4();

            const response = await getBalanceUseCase.execute({ user_id });

        }).rejects.toBeInstanceOf(GetBalanceError);


    });

});