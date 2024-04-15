// subcategoria.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LibroResponse } from '../../../models/libro-response.models';
import { UrlConstants } from '../../../constans/url.constans';
import { SubcategoriaResponse } from '../../../models/subcategoria-response.models';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriaService {
  constructor(private http: HttpClient) {}

  // Obtener todas las subcategorías
  getSubcategorias(): Observable<SubcategoriaResponse[]> {
    const url = `${UrlConstants.subcategoria}`;
    return this.http.get<SubcategoriaResponse[]>(url);
  }

  // Obtener una subcategoría por ID
  getSubcategoriaPorId(id: number): Observable<SubcategoriaResponse> {
    const url = `${UrlConstants.subcategoria}/${id}`;
    return this.http.get<SubcategoriaResponse>(url);
  }

  // Crear una nueva subcategoría
  crearSubcategoria(subcategoria: SubcategoriaResponse): Observable<SubcategoriaResponse> {
    const url = `${UrlConstants.subcategoria}`;
    return this.http.post<SubcategoriaResponse>(url, subcategoria);
  }

  // Actualizar una subcategoría existente
  actualizarSubcategoria(subcategoria: SubcategoriaResponse): Observable<SubcategoriaResponse> {
    const url = `${UrlConstants.subcategoria}/${subcategoria.id}`;
    return this.http.put<SubcategoriaResponse>(url, subcategoria);
  }

  // Eliminar una subcategoría por ID
  eliminarSubcategoria(id: number): Observable<any> {
    const url = `${UrlConstants.subcategoria}/${id}`;
    return this.http.delete<any>(url);
  }

  // Obtener libros por ID de subcategoría
  getLibrosBySubcategoria(subcategoriaId: number): Observable<LibroResponse[]> {
    const url = `${UrlConstants.subcategoria}/librosbysubcategoria/${subcategoriaId}`;
    return this.http.get<LibroResponse[]>(url);
  }
}
