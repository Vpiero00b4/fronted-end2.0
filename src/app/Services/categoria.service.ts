import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

import { identifierName } from '@angular/compiler';
import { Categorium } from '../Interface/categorium';
@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private endPoint:string = environment.endPoint; 
  private apiUrl:string = this.endPoint + "Categorium";
  constructor(private http: HttpClient) {}

  getList(): Observable<Categorium[]> {
    return this.http.get<Categorium[]>(`${this.apiUrl}/lista`);
  }

  add(modelo:Categorium):Observable<Categorium>{
    return this.http.post<Categorium>(`${this.apiUrl}/Guardar`,modelo);
  }

  update(nombreCategoria:string,modelo:Categorium):Observable<Categorium>{
    return this.http.put<Categorium>(`${this.apiUrl}/Actualizar`,modelo);
  }

  delete(idCategoria:number):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/Eliminar/${idCategoria}`);
  }
}

