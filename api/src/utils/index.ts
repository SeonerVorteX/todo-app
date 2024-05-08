import { config } from "dotenv";
import { ErrorManager } from "../helpers/managers/ErrorManager";
import { APIError } from "../errors/APIError";
import { Request, Response, NextFunction } from "express";
import logger from "./logger";
config();

export const base = (path?: string): string => {
    return path ? process.env.BASE_URL + path : process.env.BASE_URL;
};

export const host = (path?: string): string => {
    return path ? process.env.HOST_URL + path : process.env.HOST_URL;
};

export const validateEmail = (
    email: string,
    errorHandler: ErrorManager
): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailRegex.test(email)) {
        errorHandler.addError(
            new APIError("registration", "email", "INVALID_EMAIL")
        );
    }

    if (errorHandler.hasErrors()) {
        errorHandler.handleErrors();
        return false;
    } else {
        return true;
    }
};

export const validatePassword = (
    password: string,
    errorHandler: ErrorManager
): boolean => {
    const minLength = 8;

    const charRegex = /[a-zA-ZİŞĞÜÖÇƏ]/u;
    const digitRegex = /\d/;

    if (password.length < minLength) {
        errorHandler.addError(
            new APIError("registration", "password", "INVALID_LENGTH")
        );
    }

    if (!charRegex.test(password)) {
        errorHandler.addError(
            new APIError("registration", "password", "MISSING_CHAR")
        );
    }

    if (!digitRegex.test(password)) {
        errorHandler.addError(
            new APIError("registration", "password", "MISSING_DIGIT")
        );
    }

    if (errorHandler.hasErrors()) {
        errorHandler.handleErrors();
        return false;
    } else {
        return true;
    }
};

export const requestLogger = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    logger.info(`Request (${req.method}) => "${req.path}"`);
    next();
};
