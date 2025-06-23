import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CrudService } from '../../shared/services/crud.service';
import { LibroRequest } from '../../../models/libro-request.models';
import { LibroResponse } from '../../../models/libro-response.models';
import { UrlConstants } from '../../../constans/url.constans';
import { KardexResponse } from '../../../models/kardex-response.models';
import { PrecioResponse } from '../../../models/precio-response.models';
import { SucursalResponse } from '../../../models/sucursal-response.models';
import { ProveedorResponse } from '../../../models/proveedor-response.models';
import { PaginatedResponse } from '../../../models/PaginatedResponse';
import { kardex } from '../../../models/kardex.models';


@Injectable({
  providedIn: 'root'
})
export class LibroService extends CrudService<LibroRequest, LibroResponse> {
  constructor(protected http: HttpClient) { 
    super(http, UrlConstants.libro);      
  }

  getAllLibros(): Observable<LibroResponse[]> {
    return this.http.get<LibroResponse[]>(`${this.url_service}`);
  }

  getLibroById(id: number): Observable<LibroResponse> {
    return this.http.get<LibroResponse>(`${this.url_service}/${id}`);
  }

  getKardexByLibroId(libroId: number): Observable<KardexResponse> {
    return this.http.get<KardexResponse>(`${UrlConstants.kardex}/${libroId}`);
  }

  

  getUltimoPrecioByLibroId(libroId: number): Observable<PrecioResponse> {
    return this.http.get<PrecioResponse>(`${UrlConstants.precio}/${libroId}`);
  }

  getSucursalByLibroId(libroId: number): Observable<SucursalResponse[]> {
    return this.http.get<SucursalResponse[]>(`${UrlConstants.sucursal}/libro/${libroId}`);
  }

  getProveedorByLibroId(libroId: number): Observable<ProveedorResponse[]> {
    return this.http.get<ProveedorResponse[]>(`${UrlConstants.proveedor}/libro/${libroId}`);
  }

  getStockByLibroId(libroId: number): Observable<number> {
    return this.http.get<number>(`${UrlConstants.stock}/${libroId}`);
  }

  getLibrosPaginated(page: number, pageSize: number): Observable<PaginatedResponse<LibroResponse>> {
    const url = `${UrlConstants.api}/Libro/Paginator?page=${page}&pageSize=${pageSize}`;
    return this.http.get<PaginatedResponse<LibroResponse>>(url);
  }
  getAllPaginated(pageIndex: number, pageSize: number): Observable<PaginatedResponse<LibroResponse>> {
    // Usar `UrlConstants.libro` que ya tiene la base correcta y no `UrlConstants.api`
    const url = `${UrlConstants.libro}/Paginator?page=${pageIndex}&pageSize=${pageSize}`;
    return this.http.get<PaginatedResponse<LibroResponse>>(url);
  }

  createFormData(libroData: FormData): Observable<LibroResponse> {
    return this.http.post<LibroResponse>(this.url_service, libroData);
  }
  crearLibro(formData: FormData): Observable<LibroResponse> {
  return this.http.post<LibroResponse>(this.url_service, formData);
}


}
