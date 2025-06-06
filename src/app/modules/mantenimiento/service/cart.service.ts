import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlConstants } from '../../../constans/url.constans';
import { Cart } from '../../../models/cart-request.models';
import { VentaResponse } from '../../../models/ventas-response.models';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) { }

  postCart(cartDetails: any): Observable<any> {
    // Usamos UrlConstants.api para construir la URL del endpoint de Cart
    return this.http.post(`${UrlConstants.vacio}DetalleVenta/registrar-venta-detalle
`, cartDetails);
  }

addToCart(cart: Cart): Observable<VentaResponse> {
  return this.http.post<VentaResponse>(`${UrlConstants.vacio}DetalleVenta/registrar-venta-detalle
`, cart);
}

}
