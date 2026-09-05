import type { APIRoute } from "astro";
import { getTokenSRR } from "../../utils/auth";

export const GET: APIRoute = async ({ cookies }) => {
    try {
        const token = getTokenSRR(cookies);

        if (!token) {
            return new Response(JSON.stringify({ success: false, message: "No autenticado" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        const denoResponse = await fetch("http://127.0.0.1:8010/solicitudes", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await denoResponse.json();

        return new Response(JSON.stringify(data), {
            status: denoResponse.status,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: "Error al conectar con el servidor" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};