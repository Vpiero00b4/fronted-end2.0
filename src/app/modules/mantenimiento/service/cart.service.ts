import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlConstants } from '../../../constans/url.constans';
import { Cart } from '../../../models/cart-request.models';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) { }

  postCart(cartDetails: any): Observable<any> {
    // Usamos UrlConstants.api para construir la URL del endpoint de Cart
    return this.http.post(`${UrlConstants.api}/Cart`, cartDetails);
  }

  addToCart(cart: Cart) {
    return this.http.post(`${UrlConstants.api}/Cart`, cart);
  }
}
