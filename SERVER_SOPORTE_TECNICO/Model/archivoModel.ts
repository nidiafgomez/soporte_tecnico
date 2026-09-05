import { conexion } from "./conexion.ts";

interface ArchivoData {
    solicitud_id: number;
    nombre_archivo: string;
    ruta_archivo: string;
    tipo_archivo: string;
}

export class Archivo {

    public _ObjArchivo: ArchivoData | null;

    constructor(ObjArchivo: ArchivoData | null = null) {
        this._ObjArchivo = ObjArchivo;
    }

    public async guardarArchivo(): Promise<{ success: boolean; message: string }> {
        try {
            const a = this._ObjArchivo;

            await conexion.execute(
                `INSERT INTO archivos (solicitud_id, nombre_archivo, ruta_archivo, tipo_archivo) VALUES (?, ?, ?, ?)`,
                [a?.solicitud_id, a?.nombre_archivo, a?.ruta_archivo, a?.tipo_archivo]
            );

            return { success: true, message: "Archivo guardado con exito" };

        } catch (error) {
            return { success: false, message: "Error al guardar archivo: " + error };
        }
    }

    public async listarPorSolicitud(solicitudId: number) {
        const { rows } = await conexion.execute(
            `SELECT * FROM archivos WHERE solicitud_id = ?`,
            [solicitudId]
        );
        return rows;
    }
}