import { TodoType } from "../../api/src/types/types";

export interface UserPayload {
  _id: string;
  email: string;
  accessToken: string;
}

export interface UserInformation {
  _id: string;
  email: string;
  createdDate: number;
  updatedDate: number;
  todoList: TodoType[];
}

export interface APIError {
  code: number;
  message: string;
}
