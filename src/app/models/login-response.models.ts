import { UsuarioResponse } from "./usuario-login.response";

export class LoginResponse {
    [x: string]: any;
    success: boolean=false;
    usuario: UsuarioResponse = new UsuarioResponse();
    token:  string="";
    refreshToken:  string="";
    message:  string="";
}
