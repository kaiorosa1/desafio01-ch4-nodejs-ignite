import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";


let connection: Connection;
describe("Authenticate User Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();

    });

    afterAll(async () => {
        await connection.close();
    });

    it("should be able to authenticate a user", async () => {
        //create a user
        await request(app)
        .post("/api/v1/users")
        .send({
            name: "Paul Smith",
            email: "paulsmith@example.com",
            password: "123"
        });
        // authenticate user
        const response = await request(app)
            .post("/api/v1/sessions")
            .send({
                email: "paulsmith@example.com",
                password: "123"
            });

        await expect(response.status).toBe(200);
        await expect(response.body).toHaveProperty("token");
    });

    it("should not be able to authenticate with a nonexisting email", async () => {
        // authenticate user
        const response = await request(app)
            .post("/api/v1/sessions")
            .send({
                email: "mollydolly@example.com",
                password: "123"
            });

        await expect(response.status).toBe(401);
        
    });

    it("should not be able to authenticate with a wrong password", async () => {
        // authenticate user
        const response = await request(app)
            .post("/api/v1/sessions")
            .send({
                email: "paulsmith@example.com",
                password: "1343"
            });

        await expect(response.status).toBe(401);
        
    });
});