import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubCategoria } from '../../../models/libro-request.models';
import { UrlConstants } from '../../../constans/url.constans';

@Injectable({
  providedIn: 'root'
})
export class SubCategoriaService {
 private apiUrl= UrlConstants.subCategoria
 private apicateUrl = UrlConstants.categoria
  constructor(
    private http: HttpClient
  ) {

  }

   getList(): Observable<SubCategoria[]> {
    return this.http.get<SubCategoria[]>(`${this.apiUrl}`);
  }
  getCategoriaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apicateUrl}${id}`);
  }

  createSubcategoria(subcategoria: any) {
    return this.http.post(`${this.apiUrl}`, subcategoria);
  }
  update(subcategoria: any) {
    return this.http.put(`${this.apiUrl}`, subcategoria)
  }
  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
  obtenerSubcategorias(categoriaId?: number, page: number = 1, pageSize: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);
  
    if (categoriaId) {
      params = params.set('categoriaId', categoriaId);
    }
  
    return this.http.get(`${this.apiUrl}/filtrar`, { params });
  }
}

