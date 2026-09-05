import type { APIRoute } from "astro";

export const POST : APIRoute = async({request})=>{
    try {
        const body = await request.json();

        const DenoResponse = await fetch('http://127.0.0.1:8010/login',{
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                email: body.email,
                password: body.password
            }),
        });

        const data = await DenoResponse.json();

        if(DenoResponse.ok && data.access_token){
            const maxAge = 60*60*1;

            const cookieHeader = [
                `jwt_token=${data.access_token}`,
                `HttpOnly`,
                `SameSite=Lax`,
                `Path=/`,
                `Max-Age=${maxAge}`,
            ].join('; ');

            return new Response(JSON.stringify({success: true, rol: data.data.rol}),{
                status: 200,
                headers:{
                    'Content-Type' : 'application/json',
                    'Set-Cookie' : cookieHeader
                },
            });
        }

        return new Response(JSON.stringify({message: data.message || 'credenciales incorrectas'}),{
            status: 401,
            headers:{
                'Content-Type' : 'application/json'},
        });

    } catch (error) {
        return new Response(JSON.stringify({message: 'Error al conectar con el servidor'}),{
            status: 500,
            headers:{
                'Content-Type' : 'application/json'},
        });
    }
}