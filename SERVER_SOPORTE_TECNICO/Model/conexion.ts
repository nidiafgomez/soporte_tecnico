import { Client } from "../Dependencies/dependencias.ts";

const conexion = new Client();

await conexion.connect({
    hostname: "127.0.0.1",
    username: "root",
    password: "",
    db: "soporte_tecnico_db",
    port: 3306,
});

export { conexion };