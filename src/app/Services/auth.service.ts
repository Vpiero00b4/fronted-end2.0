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

    return this.htpp.get("https://libsaber-h6befwejedhaakb9.canadacentral-01.azurewebsites.net/Persona",{headers:httpHeaders});

  } 
  login(request:any){

    return this.htpp.post("https://libsaber-h6befwejedhaakb9.canadacentral-01.azurewebsites.net/api/Auth",request);
    

  }
}
