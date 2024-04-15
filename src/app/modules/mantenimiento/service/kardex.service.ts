import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KardexResponse } from '../../../models/kardex-response.models';
import { UrlConstants } from '../../../constans/url.constans';
import { KardexRequest } from '../../../models/kardex-request.models';

@Injectable({
  providedIn: 'root'
})
export class KardexService {
  private apiUrl = UrlConstants.kardex;

  constructor(private http: HttpClient) { }

  getAll(): Observable<KardexResponse[]> {
    return this.http.get<KardexResponse[]>(this.apiUrl);
  }

  getByLibroId(libroId: number): Observable<KardexResponse[]> {
    return this.http.get<KardexResponse[]>(`${this.apiUrl}/libro/${libroId}`);
  }

  actuizarka(kardex:any): Observable<any>{
    return this.http.put<KardexRequest>(`${this.apiUrl}`,kardex)
  }


}
