import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from '../../shared/services/crud.service';
import { UrlConstants } from '../../../constans/url.constans';
import { LibroResponse } from '../../../models/libro-response.models';
import { VentaRequest } from '../../../models/ventas-request.models';
import { VentaResponse } from '../../../models/ventas-response.models';

@Injectable({
  providedIn: 'root'
})
export class VentasService extends CrudService<VentaRequest, VentaResponse> {

  constructor(protected http: HttpClient) {
    super(http, UrlConstants.venta);
  }

  // Método para buscar productos por nombre u otro criterio
  searchProducts(query: string): Observable<LibroResponse[]> {
    return this.http.get<LibroResponse[]>(`${UrlConstants.libro}?query=${query}`);
  }


  

}
