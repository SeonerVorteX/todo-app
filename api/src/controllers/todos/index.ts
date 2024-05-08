import { Request, Response } from "express";
import { ErrorManager } from "../../helpers/managers/ErrorManager";
import logger from "../../utils/logger";
import { APIError } from "../../errors/APIError";
import { UserModel } from "../../models";
import { RequestIdentity } from "types/types";
import { v4 as uuidv4 } from "uuid";
import { get } from "lodash";

export const fetchTodos = async (req: Request, res: Response) => {
    try {
        const identity: RequestIdentity = get(req, "identity");
        const { todoList } = await UserModel.findById(
            identity.user._id.toString()
        ).select("-__v");

        return res.status(200).json(todoList).end();
    } catch (err) {
        const errorHandler = new ErrorManager(res);
        logger.error("An error occured while fetching todos");
        logger.error(`${err.name}: ${err.message}`);
        errorHandler.handleError(
            new APIError("system", "server", "INTERNAL_SERVER_ERROR")
        );
    }
};

export const addTodo = async (req: Request, res: Response) => {
    try {
        const errorHandler = new ErrorManager(res);
        const identity: RequestIdentity = get(req, "identity");
        const { todoList } = await UserModel.findById(
            identity.user._id.toString()
        ).select("+todoList");

        const { title, content, isCompleted } = req.body;

        if (!title) {
            errorHandler.addError(
                new APIError("todo", "payload", "MISSING_TODO_DETAILS"),
                { p: "title" }
            );
        }

        if (!content) {
            errorHandler.addError(
                new APIError("todo", "payload", "MISSING_TODO_DETAILS"),
                { p: "content" }
            );
        }

        if (errorHandler.hasErrors()) {
            return errorHandler.handleErrors();
        }

        let id = uniqueId();
        todoList.push({
            id,
            title,
            content,
            isCompleted: isCompleted == false ? false : true,
        });

        await UserModel.findByIdAndUpdate(identity.user._id.toString(), {
            todoList,
        });

        return res.status(200).json(todoList).end();
    } catch (err) {
        const errorHandler = new ErrorManager(res);
        logger.error("An error occured while adding todo");
        logger.error(`${err.name}: ${err.message}`);
        errorHandler.handleError(
            new APIError("system", "server", "INTERNAL_SERVER_ERROR")
        );
    }
};

export const updateTodo = async (req: Request, res: Response) => {
    try {
        const errorHandler = new ErrorManager(res);
        const identity: RequestIdentity = get(req, "identity");
        const { todoList } = await UserModel.findById(
            identity.user._id.toString()
        ).select("+todoList");

        const { id: todoId } = req.params;

        if (!todoId) {
            return errorHandler.handleError(
                new APIError("todo", "payload", "MISSING_TODO_ID")
            );
        }

        const todo = todoList.find((t) => t.id.toString() == todoId);

        if (!todo) {
            return errorHandler.handleError(
                new APIError("todo", "payload", "TODO_NOT_FOUND")
            );
        }

        const { title, content, isCompleted } = req.body;

        if (!title) {
            errorHandler.addError(
                new APIError("todo", "payload", "MISSING_TODO_DETAILS"),
                { p: "title" }
            );
        }

        if (!content) {
            errorHandler.addError(
                new APIError("todo", "payload", "MISSING_TODO_DETAILS"),
                { p: "content" }
            );
        }

        if (isCompleted !== false && isCompleted !== true) {
            errorHandler.addError(
                new APIError("todo", "payload", "INVALID_TODO_DETAILS"),
                { p: "isCompleted" }
            );
        }

        if (errorHandler.hasErrors()) {
            return errorHandler.handleErrors();
        }

        if (todo.title == title && todo.content == content) {
            if (
                (isCompleted === false || isCompleted === true) &&
                todo.isCompleted === isCompleted
            ) {
                return res.status(200).json(todoList).end();
            }
        }

        const index = todoList.findIndex((t) => t.id == todo.id);

        todoList[index].title = title;
        todoList[index].content = content;
        if (isCompleted === false || isCompleted === true) {
            todoList[index].isCompleted = isCompleted;
        }
        todoList[index].updatedDate = Date.now();

        await UserModel.findByIdAndUpdate(identity.user._id.toString(), {
            todoList,
        });

        return res.status(200).json(todoList).end();
    } catch (err) {
        const errorHandler = new ErrorManager(res);
        logger.error("An error occured while updating todo");
        logger.error(`${err.name}: ${err.message}`);
        errorHandler.handleError(
            new APIError("system", "server", "INTERNAL_SERVER_ERROR")
        );
    }
};

export const deleteTodo = async (req: Request, res: Response) => {
    try {
        const errorHandler = new ErrorManager(res);
        const identity: RequestIdentity = get(req, "identity");
        const { todoList } = await UserModel.findById(
            identity.user._id.toString()
        ).select("+todoList");

        const { id: todoId } = req.params;

        if (!todoId) {
            return errorHandler.handleError(
                new APIError("todo", "payload", "MISSING_TODO_ID")
            );
        }

        const todo = todoList.find((t) => t.id.toString() == todoId);

        if (!todo) {
            return errorHandler.handleError(
                new APIError("todo", "payload", "TODO_NOT_FOUND")
            );
        }

        const index = todoList.findIndex((t) => t.id == todo.id);

        todoList.splice(index, 1);

        await UserModel.findByIdAndUpdate(identity.user._id.toString(), {
            todoList,
        });

        return res.status(200).json(todoList).end();
    } catch (err) {
        const errorHandler = new ErrorManager(res);
        logger.error("An error occured while deleting todo");
        logger.error(`${err.name}: ${err.message}`);
        errorHandler.handleError(
            new APIError("system", "server", "INTERNAL_SERVER_ERROR")
        );
    }
};

function uniqueId() {
    return uuidv4();
}
