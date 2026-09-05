import { Context } from "../Dependencies/dependencias.ts";
import { Usuario } from "../Model/usuarioModel.ts";

export const postRegistro = async (ctx: Context) => {
    const { request, response } = ctx;

    try {
        const body = await request.body.json();

        if (!body.nombres || !body.apellidos || !body.email || !body.password || !body.rol_idrol) {
            response.status = 400;
            response.body = {
                success: false,
                message: "Todos los campos son obligatorios"
            };
            return;
        }

        const objUsuario = new Usuario({
            id: null,
            nombres: body.nombres,
            apellidos: body.apellidos,
            email: body.email,
            password: body.password,
            rol_idrol: body.rol_idrol
        });

        const result = await objUsuario.registrarUsuario();

        if (result.success) {
            response.status = 201;
            response.body = {
                success: true,
                message: result.message
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
            message: "Error al registrar usuario: " + error
        };
    }
}