import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { v4 as uuidv4 } from "uuid";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { AppError } from "../../../../shared/errors/AppError";

let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe("Get Statement Operation", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
        getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
    });

    it("should be able to get a specific user statement", async () => {
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

        // create statement 
        const type = OperationType.DEPOSIT;
        const amount = 10;
        const description = "a deposit made in John's account"
        const statement = await createStatementUseCase.execute({
            user_id,
            type,
            amount,
            description
        });

        const statement_id = statement.id as string;

        const response = await getStatementOperationUseCase.execute({
            user_id,
            statement_id
        })

        expect(response).toHaveProperty("id");

    });

    it("should not be able to get a specific statement for a nonexistent user", async () => {
        await expect(async () => {
            //create a user
            const user = await createUserUseCase.execute({
                name: "John2",
                email: "john2@example.com",
                password: "john123"
            });

            // autenticate user 
            const tokenInfo = await authenticateUserUseCase.execute({
                email: user.email,
                password: "john123"
            });

            const user_id = tokenInfo.user.id as string

            // create statement 
            const type = OperationType.DEPOSIT;
            const amount = 10;
            const description = "a deposit made in John's account"
            const statement = await createStatementUseCase.execute({
                user_id,
                type,
                amount,
                description
            });

            const statement_id = statement.id as string;

            const response = await getStatementOperationUseCase.execute({
                user_id: uuidv4(),
                statement_id
            })

        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
    });

    it("should not be able to get a specific statement with a invalid statement", async () => {
        await expect(async () => {
            //create a user
            const user = await createUserUseCase.execute({
                name: "John3",
                email: "john3@example.com",
                password: "john123"
            });

            // autenticate user 
            const tokenInfo = await authenticateUserUseCase.execute({
                email: user.email,
                password: "john123"
            });

            const user_id = tokenInfo.user.id as string

            // create statement 
            const type = OperationType.DEPOSIT;
            const amount = 10;
            const description = "a deposit made in John's account"
            const statement = await createStatementUseCase.execute({
                user_id,
                type,
                amount,
                description
            });

            const statement_id = statement.id as string;

            const response = await getStatementOperationUseCase.execute({
                user_id,
                statement_id: " "
            })

        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
    });

});