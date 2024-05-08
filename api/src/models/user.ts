import { Schema, model } from "mongoose";
import { AuthenticationType, TodoType } from "types/types";

export interface UserType {
    email: string;
    password: string;
    authentication?: AuthenticationType;
    todoList?: TodoType[];
    createdDate?: number;
    updatedDate?: number;
}

export const UserSchema = new Schema<UserType>({
    email: { type: String, required: true, unique: true },
    authentication: {
        password: { type: String, required: true, select: false },
        accessToken: { type: String, select: false },
    },
    todoList: [
        {
            id: { type: String, required: true },
            title: { type: String, required: true },
            content: { type: String, required: true },
            isCompleted: { type: Boolean, default: true },
            createdDate: { type: Number, default: Date.now() },
            updatedDate: { type: Number, default: null },
        },
    ],
    createdDate: { type: Number, default: Date.now() },
    updatedDate: { type: Number, default: null },
});

export const UserModel = model<UserType>("User", UserSchema);

// Functions
export const getUserByEmail = (email: string, select?: string) =>
    UserModel.findOne({ email }).select(select);
export const getUserByAccessToken = (accessToken: string, select?: string) =>
    UserModel.findOne({
        "authentication.accessToken": accessToken,
    }).select(select);
export const getUserById = (id: string, select?: string) =>
    UserModel.findById(id).select(select);
export const createUser = (values: Record<string, any>) =>
    new UserModel(values).save().then((user: any) => user.toObject());
export const deleteUserById = (id: string) =>
    UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) =>
    UserModel.findByIdAndUpdate(id, values);
