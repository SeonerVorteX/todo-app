import { Router } from "express";
import {
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
} from "../../controllers/todos";
import { isAuthenticated } from "../../middlewares";

const router = Router();

export default (): Router => {
    router.get("/", isAuthenticated, fetchTodos);
    router.post("/", isAuthenticated, addTodo);
    router.put("/:id", isAuthenticated, updateTodo);
    router.delete("/:id", isAuthenticated, deleteTodo);
    return router;
};
