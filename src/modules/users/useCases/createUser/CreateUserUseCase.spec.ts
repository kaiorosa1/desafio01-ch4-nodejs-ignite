import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepostoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create a new user", ()=> {
    beforeEach(()=> {
        usersRepostoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepostoryInMemory);
    });

    it("should be able to create a new user", async ()=> {
        const user = await createUserUseCase.execute({
            name: "John",
            email: "john@example.com",
            password: "john123"
        });

        expect(user).toHaveProperty("id");

    });

    it("should not be be able to create a new user with an existing email", async ()=> {
       expect(async ()=> {
        await createUserUseCase.execute({
            name: "John Tomato",
            email: "johntomato@example.com",
            password: "john123"
        });

        await createUserUseCase.execute({
            name: "John 2 Tomato",
            email: "johntomato@example.com",
            password: "john123"
        });
       }).rejects.toBeInstanceOf(CreateUserError);


    });
});