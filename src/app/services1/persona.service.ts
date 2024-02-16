import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UrlConstants } from "../../constants/url.constants";
import { PersonaRequest } from "../../models/persona.request.model";
@Injectable({
    providedIn: 'root'
  })
  
export class PersonaService {

    private urlTraer : string = UrlConstants.traerPersona;
    private urlGuardar: string = UrlConstants.guardarPersona;
    private urlActualizar: string = UrlConstants.actualizarPersona;
    private urlEliminar: string = UrlConstants.eliminarPersona;

    constructor (
        protected htpp:HttpClient
    ){

    }
    
    getAll(token:string)
    {
        
        const httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
      return this.htpp.get(this.urlTraer,{headers:httpHeaders});

    }
  
    create(token:string,request:PersonaRequest){
        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          })
          return this.htpp.post(this.urlGuardar,request,{headers:httpHeaders});
    }
    update(token:string,request:PersonaRequest){
        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          })
          return this.htpp.put(this.urlActualizar,request,{headers:httpHeaders});
    } 
    
  
    delete(token:string,idPersona:number){
        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          })
          return this.htpp.delete(this.urlEliminar + idPersona.toString(),{headers:httpHeaders});
    }  
} 