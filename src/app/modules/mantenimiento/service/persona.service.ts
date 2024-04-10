import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { CrudService } from '../../shared/services/crud.service';
import { UrlConstants } from '../../../constans/url.constans';
import { PersonaRequest } from '../../../models/persona-request-models';
import { PersonaResponse } from '../../../models/persona-response-models';

@Injectable({
  providedIn: 'root'
})
export class PersonaService extends CrudService<PersonaRequest, PersonaResponse> {
  constructor(protected http: HttpClient) {
    super(http, UrlConstants.persona);
  }

  obtenerPersonaPorDocumento(tipoDocumento: string, numeroDocumento: string): Observable<PersonaResponse> {
    // Validación de los parámetros de entrada podría ser más compleja dependiendo de los requerimientos de negocio
    if (!tipoDocumento || !numeroDocumento) {
      return throwError(new Error('Tipo de documento o número de documento inválido.'));
    }
    
    const url = `${UrlConstants.persona}/dni/${tipoDocumento}/${numeroDocumento}`;
    return this.http.get<PersonaResponse>(url).pipe(
      catchError((error) => {
        console.error('Error al obtener la persona:', error);
        return throwError(error);
      })
    );
  }

  obtenerPersonaPorId(idPersona: number): Observable<PersonaResponse> {
    if (!idPersona) {
      return throwError(new Error('ID de persona inválido.'));
    }
    
    const url = `${UrlConstants.persona}/${idPersona}`;
    return this.http.get<PersonaResponse>(url).pipe(
      catchError((error) => {
        console.error('Error al obtener la persona por ID:', error);
        return throwError(error);
      })
    );
  }

  // ...otros métodos y validaciones...
}
