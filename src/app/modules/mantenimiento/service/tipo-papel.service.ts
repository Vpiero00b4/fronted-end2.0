import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoPapel } from '../../../models/libro-request.models';
import { Observable } from 'rxjs';
import { UrlConstants } from '../../../constans/url.constans';

@Injectable({
  providedIn: 'root'
})
export class TipoPapelService {
 private apiUrl= UrlConstants.tipoPapel
  constructor(
    private http: HttpClient
  ) { }
  getTipoPapel(): Observable<TipoPapel[]> {
    return this.http.get<any>(`${this.apiUrl}`);
  }
}
