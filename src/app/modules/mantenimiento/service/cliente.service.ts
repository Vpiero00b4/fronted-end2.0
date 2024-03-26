import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { CrudService } from '../../shared/services/crud.service';
import { UrlConstants } from '../../../constans/url.constans';
import { ClienteRequest } from '../../../models/clientes-request.models';
import { ClienteResponse } from '../../../models/clientes-response.models';
import { PersonaResponse } from '../../../models/persona-response-models';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends CrudService<ClienteRequest, ClienteResponse> {

  constructor(
    protected http: HttpClient,
  ) { 
    super(http, UrlConstants.cliente);      
  }

  obtenerClienteConPersona(): Observable<(ClienteResponse & PersonaResponse)[]> {
    return this.getAll().pipe(
      mergeMap((clientes: ClienteResponse[]) => {
        const requests = clientes.map(cliente => {
          return this.obtenerPersonaPorId(cliente.idPersona).pipe(
            map(persona => {
              return { ...cliente, ...persona } as (ClienteResponse & PersonaResponse);
            })
          );
        });
        return forkJoin(requests);
      })
    );
  }
  

  obtenerPersonaPorId(idPersona: number): Observable<PersonaResponse> {
    return this.http.get<PersonaResponse>(`${UrlConstants.persona}/${idPersona}`);
  }

  getByIdCliente(idCliente: number): Observable<ClienteResponse> {
    return this.http.get<ClienteResponse>(`${UrlConstants.cliente}/${idCliente}`);
  }
}
