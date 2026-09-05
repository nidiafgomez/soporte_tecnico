import { Router } from "../Dependencies/dependencias.ts";
import { postLogin } from "../Controller/loginController.ts";

const LoginRouter = new Router();

LoginRouter.post("/login", postLogin);

export { LoginRouter };