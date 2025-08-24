import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CrudService } from '../../shared/services/crud.service';
import { UrlConstants } from '../../../constans/url.constans';
import { UsuarioResponse } from '../../../models/usuario-login.response';
import { UsuarioRequest } from '../../../models/usuario-login.request';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends CrudService<UsuarioRequest, UsuarioResponse> {

  constructor(
    protected http: HttpClient,
  ) {
    super(http, UrlConstants.usuario);
  }

  obtenerUsuariosPaginados(page: number, pageSize: number): Observable<{ data: UsuarioResponse[], total: number }> {
    const url = `${UrlConstants.usuario}/paginado?page=${page}&pageSize=${pageSize}`;
    return this.http.get<any>(url).pipe(
      map(res => ({
        data: res.items,       // ✅ usuarios están aquí
        total: res.total       // ✅ total global
      })),
      catchError(error => {
        console.error('Error al obtener usuarios paginados', error);
        return throwError(() => error);
      })
    );
  }


}
