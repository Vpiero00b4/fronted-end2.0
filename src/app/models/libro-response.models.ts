import { KardexResponse } from "./kardex-response.models";



export class LibroResponse {
    idLibro: number = 0;
    titulo: string = "";
    isbn: string = "";
    tamanno: string = "";
    descripcion: string = "";
    condicion: string = "";
    impresion: string = "";
    tipoTapa: string = "";
    estado: boolean=false ;
    idSubcategoria: number = 0;
    idTipoPapel: number = 0;
    idProveedor: number = 0;
    imagen: File | null = null;
    estadoDescripcion?:string="";
    precioVenta?: number = 0; 
    idPrecios?: number=0;
    porcUtilidad?: number=0; 
    stock?: number=0;
    precio: any;
    displayText?: string;
    kardex?:KardexResponse;
    editandoStock?: boolean = false;
    stockTemporal?: number;
    idCategoria?: number=0;
    constructor() {
    this.imagen = null; // Asignamos null por defecto en el constructor
     }
     [key: string]: any;
}