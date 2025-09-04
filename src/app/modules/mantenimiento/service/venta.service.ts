import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from '../../shared/services/crud.service';
import { UrlConstants } from '../../../constans/url.constans';
import { LibroResponse } from '../../../models/libro-response.models';
import { VentaRequest } from '../../../models/ventas-request.models';
import { VentaResponse } from '../../../models/ventas-response.models';
import { DetalleVentaResponse } from '../../../models/detallle-venta-response.models';
import { DatalleCarrito } from '../../../models/detallecarrito.models';
import { Cart } from '../../../models/cart-request.models';

@Injectable({
  providedIn: 'root'
})
export class VentasService extends CrudService<VentaRequest, VentaResponse> {

  constructor(protected http: HttpClient) {
    super(http, UrlConstants.venta);
  }
  enviarVenta(venta: VentaRequest): Observable<any> {
    return this.http.post(`${UrlConstants.api}/Cart1`, venta);
  }
  // Método para buscar productos por nombre u otro criterio
  searchProducts(query: string): Observable<LibroResponse[]> {
    return this.http.get<LibroResponse[]>(`${UrlConstants.libro}?query=${query}`);
  }
  crearVenta(venta: VentaRequest): Observable<VentaResponse> {
    return this.http.post<VentaResponse>(UrlConstants.venta, venta);
  }

  actualizarVenta(id: number, venta: VentaRequest): Observable<VentaResponse> {
    return this.http.put<VentaResponse>(`${UrlConstants.venta}/${id}`, venta);
  }
  buscarVentasPorFecha(fechaInicio: string, fechaFin: string): Observable<VentaResponse[]> {
    return this.http.get<VentaResponse[]>(`${UrlConstants.venta}/buscar?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }
  getDetallesVenta(idVenta: number): Observable<DetalleVentaResponse[]> {
    return this.http.get<DetalleVentaResponse[]>(`${UrlConstants.venta}/${idVenta}/detallesVenta`);
  }
  enviarCarrito(carrito: DatalleCarrito): Observable<any> {
    // Asegúrate de tener la URL correcta y cambiar 'apiUrl' por la variable que tengas para tu URL base
    return this.http.post(`${UrlConstants}/api/Cart`, carrito);
  }
  getVentaPDF(idVenta: number): Observable<Blob> {
    return this.http.get(`https://localhost:7143/Venta/${idVenta}/pdf`, { responseType: 'blob' });
  }
  obtenerVentasPorFechas(fechaInicio: string, fechaFin: string): Observable<VentaResponse[]> {
    const url = `${UrlConstants.venta}/ObtenerPorFechas`;
    const params = new HttpParams().set('fechaInicio', fechaInicio).set('fechaFin', fechaFin);
    return this.http.get<VentaResponse[]>(url, { params });
  }
  getVentas(): Observable<VentaResponse[]> {
    return this.http.get<VentaResponse[]>(UrlConstants.venta);
  }
  getVentasPaginadas(page: number, pageSize: number) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(`${UrlConstants.venta}/Paginator`, { params });
  }
  registrarVentaConDetalle(venta: Cart): Observable<any> {
    return this.http.post(`${UrlConstants.DetalleVenta}`, venta);
  }

  getVentasPorComporbante(nroComprobante: string): Observable<VentaResponse[]> {
    return this._http.get<VentaResponse[]>(`${UrlConstants.venta}/nroComprobante/${nroComprobante}`)
  }

  getPDFVentas(fecha: Date): Observable<Blob> {
    const fechaStr = `${(fecha.getMonth() + 1).toString().padStart(2, '0')}/` +
      `${fecha.getDate().toString().padStart(2, '0')}/` +
      `${fecha.getFullYear()}`;

    return this._http.get(`${UrlConstants.venta}/resumen-ingresos`, {
      params: { fecha: fechaStr },
      responseType: 'blob' // necesario para descargar archivos
    });
  }


}