import { Context } from "../Dependencies/dependencias.ts";
import { Archivo } from "../Model/archivoModel.ts";

export const postSubirArchivo = async (ctx: Context) => {
    const { request, response, params } = ctx as any;

    try {
        const solicitudId = Number(params.id);

        const formData = await request.body.formData();
        const file = formData.get("file") as File;

        if (!file || !file.name) {
            response.status = 400;
            response.body = {
                success: false,
                message: "No se envio ningun archivo"
            };
            return;
        }

        const ext = file.name.split(".").pop();
        const newName = `${crypto.randomUUID()}.${ext}`;

        const arrayBuffer = await file.arrayBuffer();
        await Deno.writeFile(`./uploads/${newName}`, new Uint8Array(arrayBuffer));

        const rutaArchivo = `http://localhost:8010/archivos/${newName}`;

        const objArchivo = new Archivo({
            solicitud_id: solicitudId,
            nombre_archivo: file.name,
            ruta_archivo: rutaArchivo,
            tipo_archivo: file.type
        });

        const result = await objArchivo.guardarArchivo();

        response.status = 200;
        response.body = {
            success: true,
            message: "Archivo subido con exito",
            url: rutaArchivo
        };

    } catch (error) {
        response.status = 500;
        response.body = {
            success: false,
            message: "Error al subir archivo: " + error
        };
    }
}

export const getMostrarArchivo = async (ctx: Context) => {
    const { response, params } = ctx as any;

    try {
        const filename = params.filename;
        const file = await Deno.readFile(`./uploads/${filename}`);

        response.headers.set("Content-Type", "application/octet-stream");
        response.body = file;

    } catch (error) {
        response.status = 404;
        response.body = {
            success: false,
            message: "Archivo no encontrado"
        };
    }
}

export const getListaArchivos = async (ctx: Context) => {
    const { response, params } = ctx as any;

    try {
        const solicitudId = Number(params.id);
        const objArchivo = new Archivo();
        const archivos = await objArchivo.listarPorSolicitud(solicitudId);

        response.status = 200;
        response.body = {
            success: true,
            data: archivos
        };

    } catch (error) {
        response.status = 500;
        response.body = {
            success: false,
            message: "Error al listar archivos: " + error
        };
    }
}