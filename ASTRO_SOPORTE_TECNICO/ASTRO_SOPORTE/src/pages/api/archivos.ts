import type { APIRoute } from "astro";
import { getTokenSRR } from "../../utils/auth";

export const POST: APIRoute = async ({ request, cookies }) => {
    try {
        const token = getTokenSRR(cookies);

        if (!token) {
            return new Response(JSON.stringify({ success: false, message: "No autenticado" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        const url = new URL(request.url);
        const solicitudId = url.searchParams.get("solicitudId");

        if (!solicitudId) {
            return new Response(JSON.stringify({ success: false, message: "Falta el id de la solicitud" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const formData = await request.formData();

        const denoResponse = await fetch(`http://127.0.0.1:8010/solicitudes/${solicitudId}/archivos`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: formData,
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