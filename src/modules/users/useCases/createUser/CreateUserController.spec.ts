import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";


let connection: Connection;
describe("Create User Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();

    });

    afterAll(async () => {
        await connection.close();
    });

    it("should be able to create a new user", async () => {

        const response = await request(app)
            .post("/api/v1/users")
            .send({
                name: "John Test",
                email: "john@example.com",
                password: "123"
            });

        await expect(response.status).toBe(201);
    });

    it("should not be able to create a user with an existing email", async () => {
        await request(app)
            .post("/api/v1/users")
            .send({
                name: "John Twice",
                email: "johnTwicc@example.com",
                password: "123"
            });

        const response = await request(app)
            .post("/api/v1/users")
            .send({
                name: "John Twice",
                email: "johnTwicc@example.com",
                password: "123"
            });

        await expect(response.status).toBe(400);

    });

    
});