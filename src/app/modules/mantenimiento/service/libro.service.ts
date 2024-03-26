import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CrudService } from '../../shared/services/crud.service';
import { LibroRequest } from '../../../models/libro-request.models';
import { LibroResponse } from '../../../models/libro-response.models';
import { KardexResponse } from '../../../models/kardex-response.models';
import { PrecioResponse } from '../../../models/precio-response.models';
import { SucursalResponse } from '../../../models/sucursal-response.models';
import { ProveedorResponse } from '../../../models/proveedor-response.models';
import { UrlConstants } from '../../../constans/url.constans';

@Injectable({
  providedIn: 'root'
})
export class LibroService extends CrudService<LibroRequest, LibroResponse> {

  constructor(
    protected http: HttpClient,
  ) { 
    super(http, UrlConstants.libro);      
  }

  // Método para obtener el kardex de un libro
  getKardexByLibroId(libroId: number): Observable<KardexResponse[]> {
    return this.http.get<KardexResponse[]>(`${UrlConstants.kardex}/libro/${libroId}`);
  }

  // Método para obtener el precio de un libro
  getPrecioByLibroId(libroId: number): Observable<PrecioResponse[]> {
    return this.http.get<PrecioResponse[]>(`${UrlConstants.precio}/libro/${libroId}`);
  }

  // Método para obtener la sucursal de un libro
  getSucursalByLibroId(libroId: number): Observable<SucursalResponse[]> {
    return this.http.get<SucursalResponse[]>(`${UrlConstants.sucursal}/libro/${libroId}`);
  }

  // Método para obtener el proveedor de un libro
  getProveedorByLibroId(libroId: number): Observable<ProveedorResponse[]> {
    return this.http.get<ProveedorResponse[]>(`${UrlConstants.proveedor}/libro/${libroId}`);
  }

}
