import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlConstants } from '../../../constans/url.constans';

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  constructor(private http: HttpClient) { }

  // Obtener todas las cajas
  getCajas(): Observable<any> {
    return this.http.get(`${UrlConstants.caja}`);
  }

  // Obtener una caja por ID
  getCajaById(id: number): Observable<any> {
    return this.http.get(`${UrlConstants.caja}/${id}`);
  }

  // Crear una nueva caja
  createCaja(cajaData: any): Observable<any> {
    return this.http.post(`${UrlConstants.caja}`, cajaData);
  }

  // Actualizar una caja existente
  updateCaja(cajaData: any): Observable<any> {
    return this.http.put(`${UrlConstants.caja}`, cajaData);
  }
}
