import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from '../../shared/services/crud.service';
import { UrlConstants } from '../../../constans/url.constans';
import { PersonaRequest } from '../../../models/persona-request-models';
import { PersonaResponse } from '../../../models/persona-response-models';
  
@Injectable({
  providedIn: 'root'
})
export class PersonaService extends CrudService<PersonaRequest,PersonaResponse> {

  constructor(
    protected http: HttpClient,
    ) { 
      super(http,UrlConstants.persona);
      
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
