import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import { v4 as uuidv4 } from "uuid";

let connection: Connection;
describe("Get Statement Operation Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();

    });

    afterAll(async () => {
        await connection.close();
    });

    it("should be able to get a specific statement", async () => {
        // create a user 
        await request(app)
            .post("/api/v1/users")
            .send({
                name: "Statement User Test",
                email: "usertest3@example.com",
                password: "1234"
            });

        //authenticate user 
        const tokenInfo = await request(app)
            .post("/api/v1/sessions")
            .send({
                email: "usertest3@example.com",
                password: "1234"
            });

        const token = tokenInfo.body.token;
        
        const depositInfo = await request(app)
        .post("/api/v1/statements/deposit")
        .send({
            amount: 100,
            description: "this is a deposit for User Test 3"
        })
        .set({
            Authorization: `Bearer ${token}`
        });

        const statement = depositInfo.body;
        const statement_id = statement.id as string;

        const response = await request(app)
            .get(`/api/v1/statements/${statement_id}`)
            .set({
                Authorization: `Bearer ${token}`
            })

        await expect(response.status).toBe(200);
        await expect(response.body).toHaveProperty("id");
        await expect(response.body).toHaveProperty("amount");
        await expect(response.body).toHaveProperty("created_at");
    });

    it("should not be able to get a specific statement for a invalid user", async () => {
    
        const token = "invalidtokenvalue";
        
        const depositInfo = await request(app)
        .post("/api/v1/statements/deposit")
        .send({
            amount: 100,
            description: "this is a deposit for User Test 3"
        })
        .set({
            Authorization: `Bearer ${token}`
        });

        const statement = depositInfo.body;
        const statement_id = statement.id as string;

        const response = await request(app)
            .get(`/api/v1/statements/${statement_id}`)
            .set({
                Authorization: `Bearer ${token}`
            })

        await expect(response.status).toBe(401);
       
    });

    it("should be able to get a statement with an invalid id", async () => {
        // create a user 
        await request(app)
            .post("/api/v1/users")
            .send({
                name: "Statement User",
                email: "usertest4@example.com",
                password: "1234"
            });

        //authenticate user 
        const tokenInfo = await request(app)
            .post("/api/v1/sessions")
            .send({
                email: "usertest4@example.com",
                password: "1234"
            });

        const token = tokenInfo.body.token;
        
        const depositInfo = await request(app)
        .post("/api/v1/statements/deposit")
        .send({
            amount: 100,
            description: "this is a deposit for User Test 4"
        })
        .set({
            Authorization: `Bearer ${token}`
        });

        const statement = depositInfo.body;
        const statement_id = uuidv4();

        const response = await request(app)
            .get(`/api/v1/statements/${statement_id}`)
            .set({
                Authorization: `Bearer ${token}`
            })

        await expect(response.status).toBe(404);
        
    });

});