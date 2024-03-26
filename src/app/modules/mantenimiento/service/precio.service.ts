import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PrecioResponse } from '../../../models/precio-response.models';
import { UrlConstants } from '../../../constans/url.constans';

@Injectable({
  providedIn: 'root'
})
export class PrecioService {
  private apiUrl = UrlConstants.precio;

  constructor(private http: HttpClient) { }

  getAll(): Observable<PrecioResponse[]> {
    return this.http.get<PrecioResponse[]>(this.apiUrl);
  }

  getByLibroId(libroId: number): Observable<PrecioResponse[]> {
    return this.http.get<PrecioResponse[]>(`${this.apiUrl}/libro/${libroId}`);
  }
}
