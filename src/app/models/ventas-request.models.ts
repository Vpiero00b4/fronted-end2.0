import { DetalleVentaRequest } from "./detallle-venta-request.models";

export class VentaRequest {
    idVentas: number = 0;
    nombreProducto:string = "";
    totalPrecio: number = 0;
    tipoComprobante: string = "";
    fechaVenta: string = "";
    nroComprobante: string = "";
    idPersona: number = 0;
    idUsuario: number = 0;
    DetallesVenta: DetalleVentaRequest[] = [];

  }