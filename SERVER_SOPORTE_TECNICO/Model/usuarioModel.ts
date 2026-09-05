import { conexion } from "./conexion.ts";

interface UserData{
    id : number | null;
    nombres: string;
    apellidos: string;
    email: string;
    password: string;
    rol_idrol: number;
}

interface LoginData {
    email: string;
    password: string;
}
export class Usuario{

    public _ObjUsuario : UserData | null;
    public _idUsuario : number | null;
    public _ObjLoginUsuario: LoginData | null;

    constructor(ObjUsuario: UserData | null = null,idUsuario : number | null = null, ObjLoginUsuario: LoginData | null = null){
        this._ObjUsuario = ObjUsuario;
        this._idUsuario = idUsuario;
        this._ObjLoginUsuario = ObjLoginUsuario
    }

    public async iniciarSesion(): Promise<|{success:true; message: string; data: Record<string, any>} | {success: false; message:string; data?:undefined}>{
        try {
            const email = this._ObjLoginUsuario?.email;
            const password = this._ObjLoginUsuario?.password

            const [usuario] = await conexion.query(`SELECT usuarios.*, rol.descripcion as rol FROM usuarios INNER JOIN rol ON usuarios.rol_idrol = rol.idrol WHERE email=?`,[email])

                if (usuario && password === usuario.password) {
                    return {
                        success: true,
                        message:"sesion iniciada",
                        data: usuario,
                    } 
                }
                    else {
                        return {
                        success: false,
                        message:"usuario no encontrado o credenciales incorrectas",
                    } 
                }
                
        } catch (error) {
            return {
                success:false,
                message:"Error interno del servidor: " + error
            }
        }
    }

    public async registrarUsuario(): Promise<{ success: boolean; message: string }> {
        try {
            const usuario = this._ObjUsuario;

            if (!usuario) {
                return { success: false, message: "No se recibieron datos del usuario" };
            }

            await conexion.execute(
                `INSERT INTO usuarios (nombres, apellidos, email, password, rol_idrol) VALUES (?, ?, ?, ?, ?)`,
                [usuario.nombres, usuario.apellidos, usuario.email, usuario.password, usuario.rol_idrol]
            );

            return { success: true, message: "Usuario registrado con exito" };

        } catch (error) {
            return { success: false, message: "Error al registrar usuario: " + error };
        }
    }
}