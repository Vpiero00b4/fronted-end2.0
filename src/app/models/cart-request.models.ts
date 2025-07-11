export interface Cart {
  items: {
    libro: {
      idLibro: number;
      titulo: string;
      isbn?: string;
      tamanno?: string;
      descripcion?: string;
      condicion?: string;
      impresion?: string;
      tipoTapa?: string;
      estado?: boolean;
      idSubcategoria?: number;
      idTipoPapel?: number;
      tipoPapelDescripcion?: string;
      idProveedor?: number;
      imagen?: string;
      estadoDescripcion?: string;
    };
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
    sub: string | null;
  };
  tipoComprobante: string;
  tipoPago: string;
  descuento: number;
  vuelto: number;
  efectivoRecibido: number;
  montoDigital: number;
}
