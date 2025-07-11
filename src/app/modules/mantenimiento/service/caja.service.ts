import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
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
obtenerCajasPaginadas(page: number, pageSize: number): Observable<{ data: any[], total: number }> {
  const url = `${UrlConstants.caja}/paginado?page=${page}&pageSize=${pageSize}`;
  return this.http.get<any>(url).pipe(
    map(res => ({
      data: res.items,   // ✅ cajas están aquí
      total: res.total   // ✅ total global
    })),
    catchError(error => {
      console.error('Error al obtener cajas paginadas', error);
      return throwError(() => error);
    })
  );
}
// caja.service.ts
getRetirosPorCajaId(cajaId: number) {
  return this.http.get<any[]>(`https://localhost:7143/api/RetiroDeCaja?cajaId=${cajaId}`);
}


}
