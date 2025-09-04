import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Caja, RetiroDeCaja } from "../../../models/caja-response";
import { Observable } from "rxjs";
import { UrlConstants } from "../../../constans/url.constans";

@Injectable({
    providedIn: 'root'
})
export class RetiroDeCajaService {

    constructor(private http: HttpClient) { }

    createRetiroCaja(retiro: RetiroDeCaja): Observable<any> {
        return this.http.post<any>(`${UrlConstants.retiroCaja}/crear-retiro`, retiro)
    }

    getRetiros(): Observable<any> {
        return this.http.get<any>(`${UrlConstants.retiroCaja}/retiros`)
    }

    getRetirosporidCaja(id:number):Observable<RetiroDeCaja[]>{
        return this.http.get<RetiroDeCaja[]>(`${UrlConstants.retiroCaja}/retiro/${id}`)
    }
}