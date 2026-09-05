import type { APIRoute } from "astro";
import { getTokenSRR } from "../../utils/auth";

export const GET: APIRoute = async ({ url, cookies }) => {
    try {
        const token = getTokenSRR(cookies);
        const id = url.searchParams.get("id");

        if (!token || !id) {
            return new Response(JSON.stringify({ success: false, message: "Faltan datos" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const denoResponse = await fetch(`http://127.0.0.1:8010/solicitudes/${id}/archivos-lista`, {
            headers: { "Authorization": `Bearer ${token}` },
        });

        const data = await denoResponse.json();

        return new Response(JSON.stringify(data), {
            status: denoResponse.status,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: "Error al conectar" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};