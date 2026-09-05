import { Router } from "../Dependencies/dependencias.ts";
import { authMiddleware } from "../Middlewares/validarJWT.ts";
import {
    postCrearSolicitud,
    getMisSolicitudes,
    getTodasLasSolicitudes,
    getSolicitudesTecnico,
    putCambiarEstado,
    putAsignarTecnico
} from "../Controller/solicitudController.ts";

const SolicitudRouter = new Router();

SolicitudRouter.post("/solicitudes", authMiddleware, postCrearSolicitud);
SolicitudRouter.get("/solicitudes/mis-solicitudes", authMiddleware, getMisSolicitudes);
SolicitudRouter.get("/solicitudes/tecnico", authMiddleware, getSolicitudesTecnico);
SolicitudRouter.get("/solicitudes", authMiddleware, getTodasLasSolicitudes);
SolicitudRouter.put("/solicitudes/:id/estado", authMiddleware, putCambiarEstado);
SolicitudRouter.put("/solicitudes/:id/asignar", authMiddleware, putAsignarTecnico);

export { SolicitudRouter };