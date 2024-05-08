import { Router } from "express";
import { login, register, logout } from "../../controllers/user/authentication";

export const authentication = (router: Router) => {
    router.post("/register", register);
    router.post("/login", login);
    router.get("/logout", logout);
};
