import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";


let connection: Connection;
describe("Show User Profile Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();

    });

    afterAll(async () => {
        // await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to show a profile for a given user", async () => {
        // create a new user
        await request(app)
            .post("/api/v1/users")
            .send({
                name: "Amanda Blaire",
                email: "amandablaire@example.com",
                password: "123"
            });
        
        // authenticate 
        const tokenInfo = await request(app)
        .post("/api/v1/sessions")
        .send({
            email: "amandablaire@example.com",
            password: "123"
        });

        const token = tokenInfo.body.token;

        const response = await request(app)
            .get("/api/v1/profile")
            .set({
                Authorization: `Bearer ${token}`
            })
        
        await expect(response.body).toHaveProperty("id");
        await expect(response.body).toHaveProperty("created_at");

    });

    it("should not be able to show a profile for a nonexistent user", async () => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlciI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.R4ccooDjMNPtMwse0AioMBVfYrbDh8h86S4RL5N8XD4"
        const response = await request(app)
            .get("/api/v1/profile")
            .set({
                Authorization: `Bearer ${token}`
            })
            
       expect(response.status).toBe(401);

    });


});