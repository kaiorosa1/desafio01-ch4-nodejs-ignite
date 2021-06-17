import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { v4 as uuidv4 } from "uuid";

let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

let createStatementUseCase: CreateStatementUseCase;
enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
    });

    it("should be able to create a deposit statement", async () => {
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
        const type = OperationType.DEPOSIT;
        const amount = 10;
        const description = "a deposit made in John's account"
        const statement = await createStatementUseCase.execute({
            user_id,
            type,
            amount,
            description
        });

        expect(statement).toHaveProperty("id");
    });

    it("should not be able create a statement for a nonexistent user", async () => {
        await expect(async () => {
            //create a user
            const user = await createUserUseCase.execute({
                name: "John",
                email: "john@example.com",
                password: "john123"
            });

            const user_id = uuidv4();
            const type = OperationType.DEPOSIT;
            const amountDeposit = 100;
            const descriptionDeposit = "a deposit made in John's account";
            const statementDeposit = await createStatementUseCase.execute({
                user_id,
                type,
                amount: amountDeposit,
                description: descriptionDeposit
            });


        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
    });

    it("should be able to create a withdraw statement", async () => {
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
        const type = OperationType.DEPOSIT;
        const amountDeposit = 10;
        const descriptionDeposit = "a deposit made in John's account"
        const statementDeposit = await createStatementUseCase.execute({
            user_id,
            type,
            amount: amountDeposit,
            description: descriptionDeposit
        });

        const amountWithdraw = 5;
        const descriptionWithdraw = "a withdraw made in John's account"
        const statementWithdraw = await createStatementUseCase.execute({
            user_id,
            type,
            amount: amountWithdraw,
            description: descriptionDeposit
        });

        expect(statementWithdraw).toHaveProperty("id");
    });

    it("should not be able to withdraw more funds than available to the user", async () => {
        await expect(async () => {
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
            const type = OperationType.DEPOSIT;
            const amountDeposit = 100;
            const descriptionDeposit = "a deposit made in John's account";
            const statementDeposit = await createStatementUseCase.execute({
                user_id,
                type,
                amount: amountDeposit,
                description: descriptionDeposit
            });

            const amountWithdraw = 300;
            const typeWithdraw = OperationType.WITHDRAW;
            const descriptionWithdraw = "a withdraw made in John's account";
            const statementWithdraw = await createStatementUseCase.execute({
                user_id,
                type: typeWithdraw,
                amount: amountWithdraw,
                description: descriptionDeposit
            });

        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
    });

});