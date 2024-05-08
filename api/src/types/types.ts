import { ObjectId } from "mongoose";
import { Logger } from "winston";

export interface RequestIdentity {
    user: UserType;
}

export interface UserType {
    _id: ObjectId;
    email: string;
    authentication?: AuthenticationType;
    createdDate?: number;
    updatedDate?: number;
}

export interface TodoType {
    id: string;
    title: string;
    content: string;
    isCompleted?: boolean;
    createdDate?: number;
    updatedDate?: number;
}

export interface AuthenticationType {
    password: string;
    accessToken: string;
}

export interface APILogger extends Logger {
    database?: (message: string) => void;
    request?: (message: string) => void;
}
