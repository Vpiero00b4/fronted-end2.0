import { Inject, Injectable } from '@angular/core';
import { CrudInterface } from '../interfaces/crud-interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CrudService<T, Y> implements CrudInterface<T, Y> {

  constructor(
    protected _http: HttpClient,
    @Inject('url_service') public url_service: string
  ) { }

  // OBTIENE LA LISTA DE UNA TABLA
  getAll(): Observable<Y[]> {
    return this._http.get<Y[]>(this.url_service);
  }

  // INSERTA UN REGISTRO
  create(request: T): Observable<Y> {
    return this._http.post<Y>(this.url_service, request);
  }

  // ACTUALIZA UN REGISTRO
  update(request: T): Observable<Y> {
    return this._http.put<Y>(this.url_service, request);
  }

  // ELIMINA UN REGISTRO
  delete(id: number): Observable<number> {
    return this._http.delete<number>(`${this.url_service}/${id}`);
}
}