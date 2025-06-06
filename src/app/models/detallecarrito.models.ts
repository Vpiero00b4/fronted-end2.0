import { ItemCarrito } from "./Itemcarrito-request.models";
import { LibroRequest } from "./libro-request.models";

export interface DatalleCarrito {
  items: {
    libro: LibroRequest;
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
