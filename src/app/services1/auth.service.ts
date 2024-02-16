import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  constructor(
    protected htpp:HttpClient
  ) 
  {

   }
  Persona(token:string){


  const httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  })

    return this.htpp.get("https://localhost:7143/Persona",{headers:httpHeaders});

  } 
  login(request:any){

    return this.htpp.post("https://localhost:7143/api/Auth",request);
    

  }
}
