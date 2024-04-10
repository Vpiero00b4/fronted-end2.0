import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DetalleVentaResponse } from '../../../models/detallle-venta-response.models';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private productoAgregadoSource = new BehaviorSubject<DetalleVentaResponse | null>(null);
  productoAgregado$ = this.productoAgregadoSource.asObservable();

  // Nuevo BehaviorSubject para notificar el registro de ventas
  private ventaRegistradaSource = new BehaviorSubject<boolean>(false);
  ventaRegistrada$ = this.ventaRegistradaSource.asObservable();

  agregarProducto(producto: DetalleVentaResponse) {
    this.productoAgregadoSource.next(producto);
  }

  // Método para notificar el registro de una nueva venta
  notificarRegistroDeVenta(registrada: boolean) {
    this.ventaRegistradaSource.next(registrada);
  }
}
