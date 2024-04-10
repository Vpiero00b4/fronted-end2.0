import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibroResponse } from './libro-response.models';
import { SucursalResponse } from './sucursal-response.models';
import { UrlConstants } from '../constans/url.constans';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(private http: HttpClient) { }

  obtenerLibrosConSucursalYStock(): Observable<any> {
    const librosRequest = this.http.get<LibroResponse[]>(UrlConstants.libro);
    const sucursalesRequest = this.http.get<SucursalResponse[]>(UrlConstants.sucursal);

    return forkJoin([librosRequest, sucursalesRequest]).pipe(
      map(([libros, sucursales]) => {
        const libroIds = libros.map(libro => libro.idLibro);
        const stocksRequest = this.obtenerStocks(libroIds);
        return forkJoin([stocksRequest]).pipe(
          map(([stocks]) => {
            return libros.map(libro => {
              const proveedor = sucursales.find((s: SucursalResponse) => s.idSucursal === libro.idProveedor); // Especificamos el tipo de 's' como SucursalResponse
              const ubicacion = proveedor ? proveedor.ubicacion : 'Sin ubicación';
              const stock = stocks.find((s: any) => s.libroId === libro.idLibro)?.cantidad || 0;
              return { ...libro, sucursal: ubicacion, stock };
            });
          })
        );
      })
    );
  }

  obtenerStocks(libroIds: number[]): Observable<any> {
    const stockRequests = libroIds.map(id => this.http.get<number>(`${UrlConstants.stock}/${id}`));
    return forkJoin(stockRequests);
  }
}
