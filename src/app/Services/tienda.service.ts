import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { identifierName } from '@angular/compiler';
import { Tiendum } from '../Interface/tienda';
@Injectable({
  providedIn: 'root'
})
export class tiendaService {
  private endPoint:string = environment.endPoint; 
  private apiUrl:string = this.endPoint + "Tienda";
  constructor(private http: HttpClient) {}

  getList(): Observable<Tiendum[]> {
    return this.http.get<Tiendum[]>(`${this.apiUrl}/lista`);
  }

  add(modelo:Tiendum):Observable<Tiendum>{
    return this.http.post<Tiendum>(`${this.apiUrl}/Guardar`,modelo);
  }

  update(descripcion:string,modelo:Tiendum):Observable<Tiendum>{
    return this.http.put<Tiendum>(`${this.apiUrl}/Actualizar`,modelo);
  }

  delete(idTiendum:number):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/Eliminar/${idTiendum}`);
  }
}