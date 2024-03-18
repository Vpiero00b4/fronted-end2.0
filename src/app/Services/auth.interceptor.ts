import { Injectable } from '@angular/core';
import { HttpRequest,HttpHandler,HttpEvent,HttpInterceptor } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators'

@Injectable()
  export class AuthInterceptor implements HttpInterceptor  {
  constructor(
    private router: Router,
  ){}
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token =sessionStorage.getItem("token")
    //puedo obtener otras variabless
    let request =req
    if(token){
      request=req.clone(
        {
          setHeaders:{
            authorization:`Bearer ${token}`
          }
      });
    }

    return next.handle(req);
    
  }
};
