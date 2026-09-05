import { Router } from "../Dependencies/dependencias.ts";
import { postRegistro } from "../Controller/usuarioController.ts";

const UsuarioRouter = new Router();

UsuarioRouter.post("/registro", postRegistro);

export { UsuarioRouter };