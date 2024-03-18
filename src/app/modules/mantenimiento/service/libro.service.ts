import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from '../../shared/services/crud.service';
import { UrlConstants } from '../../../constans/url.constans';
import { LibroRequest } from '../../../models/libro-request.models';
import { LibroResponse } from '../../../models/libro-response.models';
  
@Injectable({
  providedIn: 'root'
})
export class LibroService extends CrudService<LibroRequest,LibroResponse> {

  constructor(
    protected http: HttpClient,
    ) { 
      super(http,UrlConstants.libro);
      
    }

  //  getAll():Observable<PersonaResponse[]>{
    
    
  //    return this._http.get<PersonaResponse[]>(UrlConstants.traerPersona,);
  //  }
  //  create(request:PersonaRequest):Observable<PersonaResponse>{
  //    return this._http.post<PersonaResponse>(UrlConstants.guardarPersona,request);
  //  }
  //  update(request:PersonaRequest):Observable<PersonaResponse>{
  //    return this._http.put<PersonaResponse>(UrlConstants.actualizarPersona,request);

  //  }

  //  delete(id:number):Observable<number>{
  //    return this._http.delete<number>(`${UrlConstants.eliminarPersona}${id}`);

  //  }
}
