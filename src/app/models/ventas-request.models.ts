import { DetalleVentaRequest } from "./detallle-venta-request.models";

export class VentaRequest {
  idVentas: number = 0;
  totalPrecio: number = 0;
  tipoComprobante: string = "";
  fechaVenta: string = ""; // o Date si manejás objetos Date directamente
  nroComprobante: string = "";
  idPersona: number = 0;
  idUsuario: number = 0;
  idCaja: number = 0;
  tipoPago: string = "";
  detallesVenta: DetalleVentaRequest[] = [];
}
