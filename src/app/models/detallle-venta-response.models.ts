export class DetalleVentaResponse {
  idVentas: number = 0;
  idLibro: number = 0;
  nombreProducto: string = "";
  precioUnit: number = 0;
  cantidad: number = 0;
  importe: number = 0;
  // Propiedades opcionales del libro
  isbn?: string = "";
  descripcion?: string = "";
  idProveedor?: number = 0;
  idTipoPapel?: number = 0; // Asegúrate de asignar un valor por defecto si es necesario
  idSubcategoria?: number = 0; // Asegúrate de asignar un valor por defecto si es necesario
  condicion?: string = "";
  impresion?: string = "";
  tipoTapa?: string = "";
  estado?: boolean = false;
  tamanno?: string = "";
}
