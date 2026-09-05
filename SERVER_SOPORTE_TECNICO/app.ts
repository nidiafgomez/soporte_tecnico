import { Application, oakCors } from "./Dependencies/dependencias.ts";
import { LoginRouter } from "./Routes/loginRouter.ts";
import { UsuarioRouter } from "./Routes/usuarioRouter.ts";
import { SolicitudRouter } from "./Routes/solicitudRouter.ts";
import { ArchivoRouter } from "./Routes/archivoRouter.ts";

const app = new Application();

app.use(oakCors());

const routes = [LoginRouter, UsuarioRouter, SolicitudRouter, ArchivoRouter];

routes.forEach(router => {
    app.use(router.routes());
    app.use(router.allowedMethods());
})

console.log("servidor corriendo por el puerto 8010");

app.listen({ port: 8010 });