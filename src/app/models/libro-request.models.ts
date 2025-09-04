import { KardexResponse } from "./kardex-response.models";

export class LibroRequest {
  idLibro: number = 0;
  titulo: string = "";
  isbn: string = "";
  // tamanno: string = "";
  descripcion: string = "";
  condicion: string = "";
  impresion: string = "";
  tipoTapa: string = "";
  estado: boolean = false;
  idSubcategoria: number = 0;
  idTipoPapel: number = 0;
  idProveedor: number = 0;
  // imagen: File | string | null = null;
  kardex?: KardexResponse;

}

export interface Autor {
  idAutor: number;
  nombre?: string;
  apellido?: string;
  codigo?: number;
  descripcion?: string;
}
// models/libro-request.models.ts
export interface Libro {
  idLibro: number;
  titulo?: string;
  isbn?: number;
  tamanno?: string;
  descripcion?: string;
  condicion?: string;
  impresion?: string;
  tipoTapa?: string;
  estado: boolean;
  idSubcategoria: number;
  idTipoPapel: number;
  idProveedor: number;
  imagen: string;
}

export interface Libroconautor {
  libro: Libro;
  autor: Autor | null;
}


export interface TipoPapel {
  idTipoPapel: number;
  descripcion: string;
}

export interface SubCategoria {
  id: number;
  descripcion?: string;
  idCategoria: number;
  categoriaNombre?: string;
}

export interface Categoria {
  idCategoria: number;
  categoria1: string;
}
export interface Provedor {
  idProveedor: number;
  razonSocial: string;
}

export interface Precio {
  idPrecios: number;
  precioVenta: number;
  porcUtilidad: number | null;
}

export interface Kardex {
  idSucursal: number;
  stock: number;
}

export interface LibroInventarioDto {
  idLibro: number;
  titulo?: string;
  isbn?: string;
  tamanno?: string;
  descripcion?: string;
  imagen?: string;
  stock: number;
  precio: number;
  tipoPapel: string;
  idProveedor: number;
  nombreProveedor: string;
  editandoStock?: boolean;
  stockTemporal?: number;
  idTipoPapel: number;
  imprecion?:string;
  porcUtilidad:string;
  condicion?:string;
  estado?:string;
  [key: string]: any; // 🔹 permite libro[col.key]
}
