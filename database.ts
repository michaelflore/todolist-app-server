import list from "./mockdata.json";
import { TodoI } from "./types";

class MockedDb {
    db: TodoI[];

    constructor() {
        this.db = list.todoList.map((value) => ( {...value} ));
    }

    resetDB(): void {
        this.db = list.todoList.map((value) => ( {...value} ));
    }
}

export default new MockedDb();