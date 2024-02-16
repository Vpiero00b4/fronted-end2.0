import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request.models';
import { Observable } from 'rxjs';
import { LoginResponse } from '../../../models/login-response.models';
import { urlConstans } from '../../../constans/url.constans';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  Persona: any;



  constructor(
    private http:HttpClient

  ) { }
    login(request:LoginRequest):Observable<LoginResponse>
    {//POSIBLE ERROR DE URL
      return this.http.post<LoginResponse>(urlConstans.auth,request);
    }
    
}
