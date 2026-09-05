import { conexion } from "./conexion.ts";

interface SolicitudData {
    id: number | null;
    usuario_id: number;
    asunto: string;
    descripcion: string;
    prioridad: string;
}

export class Solicitud {

    public _ObjSolicitud: SolicitudData | null;
    public _idSolicitud: number | null;

    constructor(ObjSolicitud: SolicitudData | null = null, idSolicitud: number | null = null) {
        this._ObjSolicitud = ObjSolicitud;
        this._idSolicitud = idSolicitud;
    }

    public async obtenerEmailUsuario(solicitudId: number) {
        const { rows } = await conexion.execute(
            `SELECT usuarios.email, usuarios.nombres 
             FROM solicitudes 
             INNER JOIN usuarios ON solicitudes.usuario_id = usuarios.id
             WHERE solicitudes.id = ?`,
            [solicitudId]
        );
        return rows?.[0] || null;
    }

    public async obtenerNombreTecnico(tecnicoId: number) {
        const { rows } = await conexion.execute(
            `SELECT nombres, apellidos FROM usuarios WHERE id = ?`,
            [tecnicoId]
        );
        return rows?.[0] || null;
    }

    public async crearSolicitud(): Promise<{ success: boolean; message: string; id?: number }> {
        try {
            const s = this._ObjSolicitud;

            const resultado = await conexion.execute(
                `INSERT INTO solicitudes (usuario_id, asunto, descripcion, prioridad) VALUES (?, ?, ?, ?)`,
                [s?.usuario_id, s?.asunto, s?.descripcion, s?.prioridad || "Media"]
            );

            return {
                success: true,
                message: "Solicitud creada con exito",
                id: resultado.lastInsertId,
            };

        } catch (error) {
            return { success: false, message: "Error al crear la solicitud: " + error };
        }
    }

    public async listarPorUsuario(usuarioId: number) {
        const { rows } = await conexion.execute(
            `SELECT * FROM solicitudes WHERE usuario_id = ? ORDER BY fecha_creacion DESC`,
            [usuarioId]
        );
        return rows;
    }

    public async listarTodas() {
        const { rows } = await conexion.execute(
            `SELECT solicitudes.*, usuarios.nombres, usuarios.apellidos 
             FROM solicitudes 
             INNER JOIN usuarios ON solicitudes.usuario_id = usuarios.id
             ORDER BY fecha_creacion DESC`
        );
        return rows;
    }

    public async listarParaTecnico(tecnicoId: number) {
        const { rows } = await conexion.execute(
            `SELECT solicitudes.*, usuarios.nombres, usuarios.apellidos 
             FROM solicitudes 
             INNER JOIN usuarios ON solicitudes.usuario_id = usuarios.id
             WHERE solicitudes.tecnico_id = ? OR solicitudes.tecnico_id IS NULL
             ORDER BY fecha_creacion DESC`,
            [tecnicoId]
        );
        return rows;
    }

    public async cambiarEstado(id: number, estado: string) {
        await conexion.execute(
            `UPDATE solicitudes SET estado = ? WHERE id = ?`,
            [estado, id]
        );
        return { success: true, message: "Estado actualizado" };
    }

    public async asignarTecnico(id: number, tecnicoId: number) {
        await conexion.execute(
            `UPDATE solicitudes SET tecnico_id = ? WHERE id = ?`,
            [tecnicoId, id]
        );
        return { success: true, message: "Tecnico asignado" };
    }

    public async obtenerPorId(id: number) {
        const { rows } = await conexion.execute(
            `SELECT * FROM solicitudes WHERE id = ?`,
            [id]
        );
        return rows?.[0] || null;
    }
}