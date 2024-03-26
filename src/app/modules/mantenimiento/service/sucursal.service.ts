import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlConstants } from '../../../constans/url.constans';
import { SucursalResponse } from '../../../models/sucursal-response.models';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {
  private apiUrl = UrlConstants.sucursal; // Utiliza la URL de sucursales desde UrlConstants

  constructor(private http: HttpClient) { }

  getAll(): Observable<SucursalResponse[]> {
    return this.http.get<SucursalResponse[]>(this.apiUrl);
  }
}
