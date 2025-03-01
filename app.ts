import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";

import gql from "graphql-tag";
import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { expressMiddleware } from '@apollo/server/express4';

import mockedDb from "./database";
import { AddTodoRequestBody } from "./types";
import { delay } from "./utils";

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); //server can accept JSON as content-type
app.use(cors());

const products = [
    {
        id: "1",
        name: "Laptop",
        price: 99.99
    },
    {
        id: "2",
        name: "Headphones",
        price: 30
    },
    {
        id: "3",
        name: "Keyboard",
        price: 30.50
    }
];

const cart = {
    id: "1",
    products: [],
    total: 0
}

const typeDefs = gql`
    type Product {
        id: ID!
        name: String!
        price: Float!
    }

    input CreateProductInput {
        name: String!
        price: Float!
    }
    
    type Cart {
        id: ID!
        products: [Product!]!
        total: Float!
    }

    type Query {
        products: [Product!]!
        getCart: Cart
    }
    
    type Mutation {
        createProduct(product: CreateProductInput!): Product!
    }
`;

const resolvers = {
    Query: {
        products: () => products,
        getCart: () => cart
    },
    Mutation: {
        createProduct: (_, args) => {
            const newProduct = {
                id: crypto.randomUUID(),
                ...args.product
            }

            products.push(newProduct);

            return newProduct;
        }
    }
}

const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

// Note you must call `start()` on the `ApolloServer`
// instance before passing the instance to `expressMiddleware`
const runner = async () => {
    await server.start();
    
    app.use(
        '/graphql',
        cors(),
        express.json(),
        expressMiddleware(server)
    );
}

runner();

app.get("/", (req: Request, res: Response) => {
    res.send("Todolist API");
});

// GET list
// GET search query
// GET filter query
app.get("/api/todolist", async (req: Request, res: Response) => {

    let todolist = mockedDb.db;

    await delay(400);

    if(req.query.filter) {
        const query = (req.query.filter as string);

        if(query === "completed") {
            todolist = todolist.filter((todo) => {
                return todo.completed === true;
            });
        }

        if(query === "pending") {
            todolist = todolist.filter((todo) => {
                return todo.completed === false;
            });
        }

    }

    if(req.query.search) {
        const query = (req.query.search as string).toLowerCase();

        todolist = todolist.filter((todo) => {
            return todo.title.toLowerCase().includes(query);
        });
    }

    res.status(200).jsonp(todolist);
    
});

// GET a todo
app.get( "/api/todolist/:todoId", async (req: Request, res: Response) => {
    const todoId = req.params.todoId;

    const response = mockedDb.db;

    const todo = response.find(value => value.id === todoId);

    await delay(400);

    if(todo === undefined) {
        res.status(404).jsonp({ error: true, message: "Item not found." });
        return;
    }

    res.status(200).jsonp(todo);

});

// POST new todo
app.post("/api/todolist", async (req: Request<{}, {}, AddTodoRequestBody>, res: Response) => {
    const todoBody = req.body;

    // add uuid
    const genId = crypto.randomUUID();

    const newTodo = {
        id: genId,
        title: todoBody.title,
        completed: todoBody.completed
    };
    
    const response = mockedDb.db;
    
    response.unshift(newTodo);

    await delay(400);

    res.status(200).jsonp(response[0]);
 
});

// PATCH todo
app.patch("/api/todolist/:todoId", async (req: Request, res: Response) => {
    const todoId = req.params.todoId;
    const updatedTodo = req.body;

    const response = mockedDb.db;

    const index = response.findIndex(value => value.id === todoId);

    await delay(400);

    if(index === -1) {
        res.status(404).jsonp({ error: true, message: "Item not found." });
        return;
    }
    
    const todo = response[index];

    if(updatedTodo.title !== undefined) {
        todo.title = updatedTodo.title;
    }

    if(updatedTodo.completed !== undefined) {
        todo.completed = updatedTodo.completed;
    }

    res.status(200).jsonp(todo);
 
});

// Delete todo
app.delete("/api/todolist/:todoId", async (req: Request, res: Response) => {
    const todoId = req.params.todoId;

    const response = mockedDb.db;

    const index = response.findIndex(value => value.id === todoId);

    await delay(400);

    if(index === -1) {
        res.status(404).jsonp({ error: true, message: "Item not found." });
        return;
    }
    
    const deletedItem = response.splice(index, 1)[0];

    res.status(200).jsonp(deletedItem);

});

export default app;