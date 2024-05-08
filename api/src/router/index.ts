import { Router } from "express";
import user from "./user";
import me from "./me";
import todos from "./todos";

const router = Router();

export default (): Router => {
    router.use("/auth", user());
    router.use("/@me", me());
    router.use("/todos", todos());
    return router;
};
