import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductoMasVendido } from '../modules/template/component/dashboard/dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class GraficoService {
<<<<<<< HEAD
  private baseurl = "https://libsaber-h6befwejedhaakb9.canadacentral-01.azurewebsites.net"
  constructor(private http: HttpClient) { }
=======
  private baseurl = "https://libsaber-h6befwejedhaakb9.canadacentral-01.azurewebsites.net/";
  private baseurl2 = "https://libsaber-h6befwejedhaakb9.canadacentral-01.azurewebsites.net/api";
>>>>>>> 495a1fc2d344129b31141b90cb3fb06a8e868eac

  constructor(private http: HttpClient) { }

  obtenerProductosMasVendidos(mes: number, anio: number): Observable<ProductoMasVendido[]> {
    const params = new HttpParams()
      .set('mes', mes.toString())
      .set('anio', anio.toString());

    return this.http.get<ProductoMasVendido[]>(`${this.baseurl}/DetalleVenta/productos-mas-vendidos`, { params });
  }

  obtenerResumenVentas(): Observable<any> {
    return this.http.get(`${this.baseurl}/Venta/resumen-ventas`);
  }

  obtenerTasaRotacion(filtro: string, offset: number, limit: number): Observable<any> {
    return this.http.get(`${this.baseurl}/Venta/tasaRotacion?filtro=${filtro}&offset=${offset}&limit=${limit}`);
  }

  obtenerPagos(): Observable<any> {
    return this.http.get(`${this.baseurl}/DetalleVenta/Pagos`);
  }

  // 🔔 Nuevo: obtener notificaciones de stock bajo
  obtenerNotificaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseurl2}/Notificacion`);
  }
}
