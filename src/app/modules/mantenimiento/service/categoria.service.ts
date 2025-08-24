import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaResponse } from '../../../models/categoria-response.models';
import { UrlConstants } from '../../../constans/url.constans';
import { LibroResponse } from '../../../models/libro-response.models';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<CategoriaResponse[]> {
    return this.http.get<CategoriaResponse[]>(UrlConstants.categoria);
  }

  getCategoriaById(id: number): Observable<CategoriaResponse> {
    return this.http.get<CategoriaResponse>(`${UrlConstants.categoria}/${id}`);
  }

  createCategoria(categoria: CategoriaResponse): Observable<CategoriaResponse> {
    return this.http.post<CategoriaResponse>(UrlConstants.categoria, categoria);
  }

  updateCategoria(categoria: CategoriaResponse): Observable<CategoriaResponse> {
    return this.http.put<CategoriaResponse>(`${UrlConstants.categoria}/${categoria.idCategoria}`, categoria);
  }
  
  getCategoriasConLibros(id: number): Observable<LibroResponse[]> {
    return this.http.get<LibroResponse[]>(`${UrlConstants.categoria}/${id}/libros`);
  }
  
  getCategoriaSub(id:number):Observable<any>{
    return this.http.get<any>(`${UrlConstants.categoria}/${id}/subcategorias`)
  }
}
