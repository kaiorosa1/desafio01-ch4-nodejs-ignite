import { ProfileMap } from "../../mappers/ProfileMap";
import { v4 as uuidv4 } from "uuid";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUserUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        showUserProfileUserUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });

    it("should be able to show a user profile", async () => {
        // create a user
        const user = await createUserUseCase.execute({
            name: "John",
            email: "john@example.com",
            password: "john123"
        });

        // show user profile
        const user_id = user.id as string;
        const userFound = await showUserProfileUserUseCase.execute(user_id);
        const response = ProfileMap.toDTO(userFound);

        expect(response).toHaveProperty("id");
        expect(response).toHaveProperty("created_at");
    });

    it("should not be able to show a user profile of a nonexistent user", async () => {

        await expect(async () => {
            // create a user
            const user = await createUserUseCase.execute({
                name: "John",
                email: "john@example.com",
                password: "john123"
            });
            // show user profile
            const user_id = uuidv4();
            const userFound = await showUserProfileUserUseCase.execute(user_id);
            const response = ProfileMap.toDTO(userFound);

        }).rejects.toBeInstanceOf(ShowUserProfileError);


    });
});