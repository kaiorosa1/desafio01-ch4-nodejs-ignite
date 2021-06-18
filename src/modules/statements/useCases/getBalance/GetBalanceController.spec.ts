import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";


let connection: Connection;
describe("Get Balance Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();

    });

    afterAll(async () => {
        await connection.close();
    });

    it("should be able to get a user balance", async () => {
        // create a user 
        await request(app)
            .post("/api/v1/users")
            .send({
                name: "Statement User Test",
                email: "usertest@example.com",
                password: "1234"
            });

        //authenticate user 
        const tokenInfo = await request(app)
            .post("/api/v1/sessions")
            .send({
                email: "usertest@example.com",
                password: "1234"
            });

        const token = tokenInfo.body.token;

        const response = await request(app)
            .get("/api/v1/statements/balance")
            .set({
                Authorization: `Bearer ${token}`
            })

        await expect(response.body).toHaveProperty("statement");
        await expect(response.body).toHaveProperty("balance");

    });

    it("should not be able to get a balance for a nonexistent user", async () => {

        const token = "generatetedtoken";

        const response = await request(app)
            .get("/api/v1/statements/balance")
            .set({
                Authorization: `Bearer ${token}`
            })

        await expect(response.status).toBe(401);


    });

});