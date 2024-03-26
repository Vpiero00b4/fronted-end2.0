import { Injectable } from '@angular/core';
import { HttpRequest,HttpHandler,HttpEvent,HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators'
import { alert_error, alert_warning } from '../../functions/general.functions';

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

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
          let error = err.error;
          let title: string = "Error en el servidor | comuníquese con el área de T.I";
          switch (err.status) {
              case 400: //BAD REQUEST
                alert_error("Error de bad request","Datos enviados incorrectos");
              break;
              case 401:// NO TIENES TOKEN, TOKEN INVALIDO | no tenes permisos
              alert_error("Su Sesion ha caducado","Vuelva a Realizar el Login");

              break;
              case 404://NOT FOUND
              alert_warning("RECURSO NO ENCONTRADO",);

              break;
              case 403:// NO TIENES PERMISOS PARA EJECUTAR DETEMINADAS ACCIONES
              alert_error("Permisos insuficientes","Coordine con su administrador");

                   
              break;
              case 500://ERROR NO CONTROLAD
              alert_error("ocurrio un problema","intentelo mas tarde");

              break;
              case 0://ERROR NO CONTROLAD
              alert_error("ocurrio un problema","No Podemos Comunicarnos con el Servicio");

              break;
              default:
                break;
          }
          return throwError(() => err);
      })
    );
  }
}
