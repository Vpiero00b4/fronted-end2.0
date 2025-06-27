import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlConstants } from '../../../constans/url.constans';
import { Autor } from '../../../models/libro-request.models';

@Injectable({
  providedIn: 'root'
})
export class AutorService {
 private apiUrl= UrlConstants.autor
 constructor(private http: HttpClient) {}

  // Buscar autor por nombre o algún otro criterio
  searchAutor(nombre: string): Observable<any> {
    const params = new HttpParams().set('nombre', nombre);
    return this.http.get<any>(`${this.apiUrl}/GetByName`, { params });
  }

  // Crear un nuevo autor
  createAutor(autor: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, autor);
  }

  getAutores():Observable<Autor[]>{
    return this.http.get<any>(`${this.apiUrl}`)
  }
}
