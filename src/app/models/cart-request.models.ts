import { ItemCarrito } from "./Itemcarrito-request.models";

export interface Cart {
  items: {
    libro: any;  // Puedes tiparlo como LibroResponse si lo tienes
    precioVenta: number;
    cantidad: number;
    descuento: number;
  }[];
  totalAmount: number;
  persona: {
    idPersona: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    correo: string;
    tipoDocumento: string;
    numeroDocumento: string;
    telefono: string;
    sub: string;
  };
  tipoComprobante: string;
  tipoPago: string;
}
