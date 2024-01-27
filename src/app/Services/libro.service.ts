import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Libro } from '../Interface/libro';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private endPoint:string = environment.endPoint; 
  private apiUrl:string = this.endPoint + 'api/';// Reemplaza con la URL real de tu API

  constructor(private http: HttpClient) {}

  getLibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.apiUrl}/Libro`);
  }

  add(modelo:Libro):Observable<Libro>{
    return this.http.post<Libro>(`${this.apiUrl}Libro/guardar`,modelo);
  }

  update(IdLibro:number,modelo:Libro):Observable<Libro>{
    return this.http.put<Libro>(`${this.apiUrl}Libro/actualizar/${IdLibro}`,modelo);
  }

  delete(IdLibro:number):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}Libro/eliminar/${IdLibro}`);
  }
}
