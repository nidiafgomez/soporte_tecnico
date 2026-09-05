import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();

        const denoResponse = await fetch("http://127.0.0.1:8010/registro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
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