export interface APIError {
    code?: number;
    status: number;
    message: string;
}

export interface ErrorPayload {
    code: number;
    message: string;
}

export type ErrorFields<
    T extends keyof APIErrors,
    U extends keyof APIErrors[T]
> = {
    [key in U]: ErrorPayload | ErrorPayload[];
};

export interface MultipleErrorPayload {
    errors: ErrorFields<any, any>;
}

// System
export type ServerErrors = {
    INTERNAL_SERVER_ERROR: APIError;
};

export type SystemAuthenticationErrors = {
    NOT_AUTHENTICATED: APIError;
    AUTHENTICATION_FAILED: APIError;
    ALREADY_AUTHENTICATED: APIError;
};

export type SystemAuthorizationErrors = {
    MISSING_AUTHORIZATION: APIError;
    NOT_AUTHORIZED: APIError;
    AUTHORIZATION_FAILED: APIError;
};

export type SystemPayloadErrors = {
    INVALID_PAYLOAD: APIError;
    MISSING_PROPERTY: APIError;
    INVALID_PROPERTY: APIError;
    INCORRECT_PROPERTY: APIError;
};

export type SystemErrors = {
    server: ServerErrors;
    authentication: SystemAuthenticationErrors;
    authorization: SystemAuthorizationErrors;
    payload: SystemPayloadErrors;
};

// Registration
export type RegistrationEmailErrors = {
    MISSING_EMAIL: APIError;
    INVALID_EMAIL: APIError;
    EMAIL_ALREADY_EXISTS: APIError;
    EMAIL_DOES_NOT_EXIST: APIError;
    EMAIL_LINKED_TO_GOOGLE: APIError;
};

export type RegistrationPasswordErrors = {
    MISSING_PASSWORD: APIError;
    INVALID_LENGTH: APIError;
    MISSING_LOWERCASE: APIError;
    MISSING_UPPERCASE: APIError;
    MISSING_CHAR: APIError;
    MISSING_DIGIT: APIError;
    INCORRECT_PASSWORD: APIError;
};

export type RegitrationErrors = {
    email: RegistrationEmailErrors;
    password: RegistrationPasswordErrors;
};

// Todo Errors
export type TodoPayloadErrors = {
    MISSING_TODO_ID: APIError;
    INVALID_TODO: APIError;
    INVALID_TODO_DETAILS: APIError;
    MISSING_TODO_DETAILS: APIError;
    TODO_NOT_FOUND: APIError;
};

export type TodoErrors = {
    payload: TodoPayloadErrors;
};

export type APIErrors = {
    system: SystemErrors;
    registration: RegitrationErrors;
    todo: TodoErrors;
};
