import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from '../../shared/services/crud.service';
import { UrlConstants } from '../../../constans/url.constans';
import { LibroResponse } from '../../../models/libro-response.models';
import { VentaRequest } from '../../../models/ventas-request.models';
import { VentaResponse } from '../../../models/ventas-response.models';
import { DetalleVentaResponse } from '../../../models/detallle-venta-response.models';
import { DatalleCarrito } from '../../../models/detallecarrito.models';

@Injectable({
  providedIn: 'root'
})
export class VentasService extends CrudService<VentaRequest, VentaResponse> {

  constructor(protected http: HttpClient) {
    super(http, UrlConstants.venta);
  }
  enviarVenta(venta: VentaRequest): Observable<any> {
    return this.http.post(`${UrlConstants.api}/Cart`, venta);
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
  

}
