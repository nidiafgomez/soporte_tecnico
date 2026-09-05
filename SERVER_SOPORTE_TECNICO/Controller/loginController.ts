import { Context } from "../Dependencies/dependencias.ts";
import { Usuario } from "../Model/usuarioModel.ts";
import { crearToken } from "../Helpers/jwt.ts";

export const postLogin = async (ctx: Context) => {
    const { request, response } = ctx;

    try {
        const contenido = request.headers.get("Content-Length");

        if (contenido === "0") {
            response.status = 400;
            response.body = {
                success: false,
                message: "cuerpo de solicitud vacío"
            };
            return;
        }

        const body = await request.body.json();

        if (!body.email || !body.password) {
            response.status = 400;
            response.body = {
                success: false,
                message: "Datos incompletos"
            };
            return;
        }

        const objUsuario = new Usuario(null, null, { email: body.email, password: body.password });
        const result = await objUsuario.iniciarSesion();

        if (result.success && result.data) {
            const _token = await crearToken(String(result.data.id));

            response.status = 200;
            response.body = {
                success: true,
                access_token: _token,
                data: {
                    id: result.data.id,
                    nombres: result.data.nombres,
                    apellidos: result.data.apellidos,
                    email: result.data.email,
                    rol: result.data.rol
                }
            };

        } else {
            response.status = 401;
            response.body = {
                success: false,
                message: "Credenciales inválidas"
            };
        }

    } catch (error) {
        response.status = 500;
        response.body = { error: "Error en la solicitud: " + error };
        return;
    }
}