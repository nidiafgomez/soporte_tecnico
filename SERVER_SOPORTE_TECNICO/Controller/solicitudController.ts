import { Context } from "../Dependencies/dependencias.ts";
import { Solicitud } from "../Model/solicitudModel.ts";
import { enviarCorreo } from "../Services/emailService.ts";

export const postCrearSolicitud = async (ctx: Context) => {
    const { request, response, state } = ctx;

    try {
        const body = await request.body.json();

        if (!body.asunto || !body.descripcion) {
            response.status = 400;
            response.body = {
                success: false,
                message: "El asunto y la descripcion son obligatorios"
            };
            return;
        }

        const usuarioId = Number(state.user.sub);

        const objSolicitud = new Solicitud({
            id: null,
            usuario_id: usuarioId,
            asunto: body.asunto,
            descripcion: body.descripcion,
            prioridad: body.prioridad || "Media"
        });

        const result = await objSolicitud.crearSolicitud();

        if (result.success && result.id) {
            const infoUsuario = await objSolicitud.obtenerEmailUsuario(result.id);

            if (infoUsuario) {
                enviarCorreo(
                    infoUsuario.email,
                    "Solicitud registrada",
                    `Su solicitud #${result.id} ha sido registrada correctamente.`
                ).catch((err) => console.error("Error al enviar correo:", err));
            }

            response.status = 201;
            response.body = {
                success: true,
                message: result.message,
                id: result.id
            };
        } else {
            response.status = 400;
            response.body = {
                success: false,
                message: result.message
            };
        }

    } catch (error) {
        response.status = 500;
        response.body = {
            success: false,
            message: "Error al crear la solicitud: " + error
        };
    }
}

export const getMisSolicitudes = async (ctx: Context) => {
    const { response, state } = ctx;

    try {
        const usuarioId = Number(state.user.sub);
        const objSolicitud = new Solicitud();
        const solicitudes = await objSolicitud.listarPorUsuario(usuarioId);

        response.status = 200;
        response.body = {
            success: true,
            data: solicitudes
        };

    } catch (error) {
        response.status = 500;
        response.body = {
            success: false,
            message: "Error al listar solicitudes: " + error
        };
    }
}

export const getTodasLasSolicitudes = async (ctx: Context) => {
    const { response } = ctx;

    try {
        const objSolicitud = new Solicitud();
        const solicitudes = await objSolicitud.listarTodas();

        response.status = 200;
        response.body = {
            success: true,
            data: solicitudes
        };

    } catch (error) {
        response.status = 500;
        response.body = {
            success: false,
            message: "Error al listar solicitudes: " + error
        };
    }
}

export const getSolicitudesTecnico = async (ctx: Context) => {
    const { response, state } = ctx;

    try {
        const tecnicoId = Number(state.user.sub);
        const objSolicitud = new Solicitud();
        const solicitudes = await objSolicitud.listarParaTecnico(tecnicoId);

        response.status = 200;
        response.body = {
            success: true,
            data: solicitudes
        };

    } catch (error) {
        response.status = 500;
        response.body = {
            success: false,
            message: "Error al listar solicitudes: " + error
        };
    }
}

export const putCambiarEstado = async (ctx: Context) => {
    const { request, response, params } = ctx as any;

    try {
        const id = Number(params.id);
        const body = await request.body.json();

        if (!body.estado) {
            response.status = 400;
            response.body = { success: false, message: "El estado es obligatorio" };
            return;
        }

        const objSolicitud = new Solicitud();
        const result = await objSolicitud.cambiarEstado(id, body.estado);

        const infoUsuario = await objSolicitud.obtenerEmailUsuario(id);

        if (infoUsuario) {
            let mensaje = `Su solicitud #${id} ha cambiado al estado '${body.estado}'.`;

            if (body.estado === "Cerrada") {
                mensaje = `Su solicitud #${id} ha sido solucionada.`;
            }

            enviarCorreo(infoUsuario.email, "Actualizacion de su solicitud", mensaje)
                .catch((err) => console.error("Error al enviar correo:", err));
        }

        response.status = 200;
        response.body = { success: true, message: result.message };

    } catch (error) {
        response.status = 500;
        response.body = { success: false, message: "Error al cambiar estado: " + error };
    }
}

export const putAsignarTecnico = async (ctx: Context) => {
    const { request, response, params, state } = ctx as any;

    try {
        const id = Number(params.id);
        const tecnicoId = Number(state.user.sub);

        const objSolicitud = new Solicitud();
        const result = await objSolicitud.asignarTecnico(id, tecnicoId);

        const infoUsuario = await objSolicitud.obtenerEmailUsuario(id);
        const infoTecnico = await objSolicitud.obtenerNombreTecnico(tecnicoId);

        if (infoUsuario && infoTecnico) {
            enviarCorreo(
                infoUsuario.email,
                "Tecnico asignado a su solicitud",
                `Su solicitud #${id} ha sido tomada por el tecnico ${infoTecnico.nombres} ${infoTecnico.apellidos}.`
            ).catch((err) => console.error("Error al enviar correo:", err));
        }

        response.status = 200;
        response.body = { success: true, message: result.message };

    } catch (error) {
        response.status = 500;
        response.body = { success: false, message: "Error al asignar tecnico: " + error };
    }
}