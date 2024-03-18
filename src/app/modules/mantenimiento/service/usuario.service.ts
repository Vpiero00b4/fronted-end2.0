import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from '../../shared/services/crud.service';
import { UrlConstants } from '../../../constans/url.constans';
import { UsuarioResponse } from '../../../models/usuario-login.response';
import { UsuarioRequest } from '../../../models/usuario-login.request';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends CrudService<UsuarioRequest,UsuarioResponse> {

  constructor(
    protected http: HttpClient,
    ) { 
      super(http,UrlConstants.usuario);
      
    }

  //  getAll():Observable<UsuarioResponse[]>{
    
    
  //    return this._http.get<UsuarioResponse[]>(UrlConstants.traerUsuario,);
  //  }
  //  create(request:UsuarioRequest):Observable<UsuarioResponse>{
  //    return this._http.post<UsuarioResponse>(UrlConstants.guardarUsuario,request);
  //  }
  //  update(request:UsuarioRequest):Observable<UsuarioResponse>{
  //    return this._http.put<UsuarioResponse>(UrlConstants.actualizarUsuario,request);

  //  }

  //  delete(id:number):Observable<number>{
  //    return this._http.delete<number>(`${UrlConstants.eliminarUsuario}${id}`);

  //  }
}
