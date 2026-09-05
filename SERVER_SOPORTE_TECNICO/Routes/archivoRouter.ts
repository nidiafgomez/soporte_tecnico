import { Router } from "../Dependencies/dependencias.ts";
import { authMiddleware } from "../Middlewares/validarJWT.ts";
import { postSubirArchivo, getMostrarArchivo } from "../Controller/archivoController.ts";

const ArchivoRouter = new Router();

ArchivoRouter.post("/solicitudes/:id/archivos", authMiddleware, postSubirArchivo);
ArchivoRouter.get("/archivos/:filename", getMostrarArchivo);

export { ArchivoRouter };