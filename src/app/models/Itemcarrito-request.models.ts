import { LibroRequest } from "./libro-request.models";

export interface ItemCarrito {
    libro: LibroRequest;
    PrecioVenta: number;
    Cantidad: number;
  }