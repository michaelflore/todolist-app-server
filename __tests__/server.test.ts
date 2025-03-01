import supertest from "supertest";
import app from "../app";
import type { Server } from 'http';
// import database from '../database';

// jest.mock("../database");

let server: Server;

beforeAll(() => {
    server = app.listen(4000 ,() => {
        "Test server is running"
    });
})

describe("Testing Root", () => {
    test("should return hello world. 200 status code", async () => {
        const response = await supertest(app).get("/");

        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toEqual(expect.stringContaining("text/html; charset=utf-8"));
    });
});

describe("Testing Todo API", () => {

    describe("GET /api/todolist", () => {
        test("should return the products. 200 status code", async () => {

            // (database.getProducts as jest.Mock).mockResolvedValue(mockProducts);

            const response = await supertest(app).get("/api/todolist");

            expect(response.status).toBe(200);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            expect(response.body.length).toBe(4);
            // expect(database.getProducts).toHaveBeenCalled();
        });
    });

    describe("POST /api/todolist", () => {
        test("Should add new todo. 200 status code", async () => {
            // const mockNewTodo = {
            //     title: "Buy New Tools",
            //     completed: false
            // };

            // (database.createProduct as jest.Mock).mockResolvedValue(mockSavedProduct);

            const response = await supertest(app).post("/api/todolist").send({
                title: "Buy New Tools",
                completed: false
            });

            expect(response.status).toBe(200);
            expect(response.body.id).toBeDefined();
            expect(typeof response.body.id).toBe("string");
        });
    });

});

afterAll(() => {
    server.close();
});
