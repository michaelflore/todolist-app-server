export interface TodoI {
    id: string;
    title: string;
    completed: boolean;
}

export interface AddTodoRequestBody {
    title: string;
    completed: boolean;
}