export interface UserPayload {
  _id: string;
  email: string;
  accessToken: string;
}

export interface APIError {
  code: number;
  message: string;
}
