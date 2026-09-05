import { verificarTokenAcceso } from "../Helpers/jwt.ts";
import { Context, Next } from "../Dependencies/dependencias.ts";

export async function authMiddleware(ctx: Context, next: Next) {

    const authHeader = ctx.request.headers.get("Authorization");

    if (!authHeader) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Acceso no autorizado" };
        return;
    }

    const token = authHeader.split(" ")[1];
    const usuario = await verificarTokenAcceso(token);

    if (!usuario) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Token inválido" };
        return;
    }

    ctx.state.user = usuario;
    await next();
};