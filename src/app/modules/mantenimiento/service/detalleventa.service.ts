import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DetalleVentaResponse } from '../../../models/detallle-venta-response.models';
import { UrlConstants } from '../../../constans/url.constans';
import { VentaRequest } from '../../../models/ventas-request.models';
export interface Prediccion {
  fecha: string;
  cantidadPredicha: number;
  dimFecha: {
    nombreDia: string;
    esFinDeSemana: boolean;
    tipoDia: string;
    estacion: string;
    trimestre: string;
  };
}
@Injectable({
  providedIn: 'root'
})
export class DetalleVentaService {
  constructor(private http: HttpClient) { }

  registrarVenta(venta: VentaRequest): Observable<DetalleVentaResponse> {
    return this.http.post<DetalleVentaResponse>(UrlConstants.DetalleVenta, venta);
  }
  obtenerPredicciones(idLibro: number, horizonte: number = 7): Observable<Prediccion[]> {
    return this.http.get<Prediccion[]>(`${UrlConstants.DetalleVentas}/predecir-ventas/${idLibro}?horizonte=${horizonte}`);
  }

  getPDFVentasDetalles(fecha: Date): Observable<Blob> {
    const fechaStr = `${(fecha.getMonth() + 1).toString().padStart(2, '0')}/` +
      `${fecha.getDate().toString().padStart(2, '0')}/` +
      `${fecha.getFullYear()}`;

    return this.http.get(`${UrlConstants.DetalleVentas}/reporte-detalle-ventas`, {
      params: { fecha: fechaStr },
      responseType: 'blob' // necesario para descargar archivos
    });
  }
}

