import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibroResponse } from './libro-response.models';
import { SucursalResponse } from './sucursal-response.models';
import { ProveedorResponse } from './proveedor-response.models'; // Importar modelo de proveedor si es necesario
import { UrlConstants } from '../constans/url.constans';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(private http: HttpClient) { }

  obtenerLibrosConSucursal(): Observable<any> {
    const librosRequest = this.http.get<LibroResponse[]>(UrlConstants.libro);
    const sucursalesRequest = this.http.get<SucursalResponse[]>(UrlConstants.sucursal);

    return forkJoin([librosRequest, sucursalesRequest]).pipe(
      map(([libros, sucursales]) => {
        return libros.map(libro => {
          // Supongamos que la relación entre libros y sucursales se realiza a través de los proveedores
          const proveedor = sucursales.find(s => s.idSucursal === libro.idProveedor); // Modifica según tu lógica específica
          const ubicacion = proveedor ? proveedor.ubicacion : 'Sin ubicación';
          return { ...libro, sucursal: ubicacion }; // Agregar la ubicación como un nuevo campo
        });
      })
    );
  }
}
