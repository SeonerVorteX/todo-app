import { get } from "lodash";
import { Request, Response } from "express";
import { UserModel, getUserByEmail, getUserById } from "../../models/user";
import { APIError } from "../../errors/APIError";
import { ErrorManager } from "../../helpers/managers/ErrorManager";
import { hash, passwordMatches } from "../../helpers/security/passwordHash";
import { generateTokens } from "../../helpers/security/jwt";
import { RequestIdentity } from "../../types/types";
import { validateEmail, validatePassword } from "../../utils";
import logger from "../../utils/logger";

export const login = async (req: Request, res: Response) => {
    try {
        const errorHandler = new ErrorManager(res);
        if (get(req, "identity.user")) {
            return errorHandler.handleError(
                new APIError(
                    "system",
                    "authentication",
                    "ALREADY_AUTHENTICATED"
                )
            );
        }

        const { email, password } = req.body;

        if (!email) {
            errorHandler.addError(
                new APIError("registration", "email", "MISSING_EMAIL")
            );
        }

        if (!password) {
            errorHandler.addError(
                new APIError("registration", "password", "MISSING_PASSWORD")
            );
        }

        if (errorHandler.hasErrors()) return errorHandler.handleErrors();

        const user = await UserModel.findOne({ email }).select(
            "+authentication.password"
        );

        if (!user) {
            return errorHandler.handleError(
                new APIError("registration", "email", "EMAIL_DOES_NOT_EXIST")
            );
        }

        if (!(await passwordMatches(password, user.authentication.password))) {
            return errorHandler.handleError(
                new APIError("registration", "password", "INCORRECT_PASSWORD")
            );
        }

        const { accessToken } = await generateTokens(user.toObject());
        user.authentication.accessToken = accessToken;
        user.updatedDate = Date.now();

        res.status(200)
            .json({
                user: {
                    _id: user._id,
                    email: user.email,
                    accessToken: user.authentication.accessToken,
                },
            })
            .end();

        await user.save();
    } catch (error) {
        const errorHandler = new ErrorManager(res);
        logger.error("An error occured while logging user in");
        logger.error(`${error.name}: ${error.message}`);
        errorHandler.handleError(
            new APIError("system", "server", "INTERNAL_SERVER_ERROR")
        );
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const errorHandler = new ErrorManager(res);

        if (get(req, "identity.user")) {
            return errorHandler.handleError(
                new APIError(
                    "system",
                    "authentication",
                    "ALREADY_AUTHENTICATED"
                )
            );
        }

        const { email, password } = req.body;

        if (!email) {
            errorHandler.addError(
                new APIError("registration", "email", "MISSING_EMAIL")
            );
        }

        if (!password) {
            errorHandler.addError(
                new APIError("registration", "password", "MISSING_PASSWORD")
            );
        }

        if (errorHandler.hasErrors()) return errorHandler.handleErrors();

        if (
            validateEmail(email, errorHandler) &&
            validatePassword(password, errorHandler)
        ) {
            const existingUser = await getUserByEmail(email);

            if (existingUser) {
                return errorHandler.handleError(
                    new APIError(
                        "registration",
                        "email",
                        "EMAIL_ALREADY_EXISTS"
                    )
                );
            }

            const hashedPassword = await hash(password);
            const user = await UserModel.create({
                email,
                authentication: { password: hashedPassword },
            });
            const { accessToken } = await generateTokens(user.toObject());
            user.authentication.accessToken = accessToken;

            res.status(201).json({
                user: {
                    _id: user._id,
                    email: user.email,
                    accessToken: user.authentication.accessToken,
                },
            });

            await user.save();
        }
    } catch (error) {
        const errorHandler = new ErrorManager(res);
        logger.error("An error occured while registering user");
        logger.error(`${error.name}: ${error.message}`);
        errorHandler.handleError(
            new APIError("system", "server", "INTERNAL_SERVER_ERROR")
        );
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const errorHandler = new ErrorManager(res);
        const identity = get(req, "identity") as RequestIdentity;

        if (!identity) {
            return errorHandler.handleError(
                new APIError("system", "authentication", "NOT_AUTHENTICATED")
            );
        }

        const user = await getUserById(identity.user._id.toString()).select(
            "+authentication.password"
        );
        user.authentication.accessToken = null;
        user.updatedDate = Date.now();

        res.status(200)
            .json({ status: 200, message: "Logged out successfully" })
            .end();

        await user.save();
    } catch (error) {
        console.error(error);
        const errorHandler = new ErrorManager(res);
        logger.error("An error occured while logging user out");
        logger.error(`${error.name}: ${error.message}`);
        errorHandler.handleError(
            new APIError("system", "server", "INTERNAL_SERVER_ERROR")
        );
    }
};
