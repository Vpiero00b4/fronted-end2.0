import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlConstants } from '../../../constans/url.constans';

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  constructor(private http: HttpClient) { }

  getCajas(): Observable<any> {
    return this.http.get(`${UrlConstants.caja}`);
  }

  getCajaById(id: number): Observable<any> {
    return this.http.get(`${UrlConstants.caja}/${id}`);
  }

  createCaja(cajaData: any): Observable<any> {
    return this.http.post(`${UrlConstants.caja}`, cajaData);
  }

  updateCaja(cajaData: any): Observable<any> {
  return this.http.put(`${UrlConstants.caja}`, cajaData);
}

}
