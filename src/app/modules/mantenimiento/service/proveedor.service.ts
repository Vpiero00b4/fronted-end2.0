import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlConstants } from '../../../constans/url.constans';
import { ProveedorResponse } from '../../../models/proveedor-response.models';
import { Provedor } from '../../../models/libro-request.models';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private apiUrl = UrlConstants.proveedor; // Utiliza la URL de proveedores desde UrlConstants

  constructor(private http: HttpClient) { }

  getAll(): Observable<ProveedorResponse[]> {
    return this.http.get<ProveedorResponse[]>(this.apiUrl);
  }

  getProveedor(): Observable<Provedor[]> {
    return this.http.get<any>(`${this.apiUrl}`);
  }
}
