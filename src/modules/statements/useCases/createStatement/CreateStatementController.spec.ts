import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";


let connection: Connection;
describe("Create Statement Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();

    });

    afterAll(async () => {
        await connection.close();
    });

    it("should be able to make a deposit", async () => {
        // create a user 
        await request(app)
            .post("/api/v1/users")
            .send({
                name: "Statement User Test 2",
                email: "usertest2@example.com",
                password: "1234"
            });

        //authenticate user 
        const tokenInfo = await request(app)
            .post("/api/v1/sessions")
            .send({
                email: "usertest2@example.com",
                password: "1234"
            });

        const token = tokenInfo.body.token;

        const response = await request(app)
            .post("/api/v1/statements/deposit")
            .send({
                amount: 100,
                description: "this is a deposit for User Test 2"
            })
            .set({
                Authorization: `Bearer ${token}`
            })

        await expect(response.status).toBe(201);
    });

    it("should be able to make a withdrawal", async () => {

        //authenticate user 
        const tokenInfo = await request(app)
            .post("/api/v1/sessions")
            .send({
                email: "usertest2@example.com",
                password: "1234"
            });

        const token = tokenInfo.body.token;

        const response = await request(app)
            .post("/api/v1/statements/withdraw")
            .send({
                amount: 30,
                description: "this is a withdrawal for User Test 2"
            })
            .set({
                Authorization: `Bearer ${token}`
            })

        await expect(response.status).toBe(201);
    });

    it("should not be able to make a withdrawal for more funds than available", async () => {

        //authenticate user 
        const tokenInfo = await request(app)
            .post("/api/v1/sessions")
            .send({
                email: "usertest2@example.com",
                password: "1234"
            });

        const token = tokenInfo.body.token;

        const response = await request(app)
            .post("/api/v1/statements/withdraw")
            .send({
                amount: 1000,
                description: "this is an invalid withdrawal for User Test 2"
            })
            .set({
                Authorization: `Bearer ${token}`
            })

        await expect(response.status).toBe(400);
    });

    it("should not be able to make deposit for a nonexistent user", async () => {

        const token = "tokentestnotvalid";

        const response = await request(app)
            .post("/api/v1/statements/deposit")
            .send({
                amount: 1000,
                description: "this is a desposit for a nonexistent user"
            })
            .set({
                Authorization: `Bearer ${token}`
            })

        await expect(response.status).toBe(401);
    });
});