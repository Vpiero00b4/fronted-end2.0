//import { Comprobante } from 'ruta-donde-se-encuentre-comprobante';
//import { Usuario } from 'ruta-donde-se-encuentre-usuario';

export class PersonaResponse {
    idPersona: number=0;
    cargo: string | null="";
    nombres: string | null ="";
    correo: string | null="";
    tipoDocumento: string | null="";
    numDocumento: number | null=0;
    razonSocial: string | null="";
    //comprobantes: Comprobante[] = ['1', '2', '3'];
    //usuarios: Usuario[] = [1, 2, 3, 4, ];
}