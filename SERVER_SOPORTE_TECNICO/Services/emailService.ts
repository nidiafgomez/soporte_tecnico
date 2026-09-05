import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

export const enviarCorreo = async (destinatario: string, asunto: string, mensaje: string) => {
    const client = new SMTPClient({
        connection: {
            hostname: Deno.env.get("SMTP_HOST") || "",
            port: Number(Deno.env.get("SMTP_PORT")) || 465,
            tls: true,
            auth: {
                username: Deno.env.get("SMTP_USER") || "",
                password: Deno.env.get("SMTP_PASSWORD") || "",
            },
        },
    });

    await client.send({
        from: Deno.env.get("SMTP_USER") || "",
        to: destinatario,
        subject: asunto,
        content: mensaje,
    });

    await client.close();
};