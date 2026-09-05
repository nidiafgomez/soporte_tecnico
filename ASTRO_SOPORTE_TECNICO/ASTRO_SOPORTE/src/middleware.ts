import {defineMiddleware} from 'astro/middleware';
import { isAuthenticatedSSR } from './utils/auth';

const RUTAS_PROTEGIDAS = [
    '/home',
    '/usuarios',
];

const RUTAS_PUBLICAS = [
    '/',
];

export const onRequest = defineMiddleware(({url, cookies, redirect}, next) => {
    const estaAutenticado = isAuthenticatedSSR(cookies);
    const path = url.pathname;

    const esRutaProtegida = RUTAS_PROTEGIDAS.some(ruta => path === ruta);
    const esRutaPublica = RUTAS_PUBLICAS.some(ruta => path === ruta);

    if (esRutaProtegida && !estaAutenticado) {
        return redirect('/');
    }

    if (esRutaPublica && estaAutenticado) {
        return redirect('/usuarios');
    }

    return next();
})