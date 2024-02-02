import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { identifierName } from '@angular/compiler';
import { Almacen } from '../Interface/almacen';
@Injectable({
  providedIn: 'root'
})
export class almacenService {
  private endPoint:string = environment.endPoint; 
  private apiUrl:string = this.endPoint + "Almacen";
  constructor(private http: HttpClient) {}

  getList(): Observable<Almacen[]> {
    return this.http.get<Almacen[]>(`${this.apiUrl}/lista`);
  }

  add(modelo:Almacen):Observable<Almacen>{
    return this.http.post<Almacen>(`${this.apiUrl}/Guardar`,modelo);
  }

  update(nroEstante:string,librosEstante:string,ubicacion:string,modelo:Almacen):Observable<Almacen>{
    return this.http.put<Almacen>(`${this.apiUrl}/Actualizar`,modelo);
  }

  delete(idAlmacen:number):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/Eliminar/${idAlmacen}`);
  }
}
