import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DetalleVentaResponse } from '../../../models/detallle-venta-response.models';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  // Producto agregado
  private productoAgregadoSource = new BehaviorSubject<DetalleVentaResponse | null>(null);
  productoAgregado$ = this.productoAgregadoSource.asObservable();

  // Evento para notificar que una venta fue registrada
  private ventaRegistradaSource = new BehaviorSubject<boolean>(false);
  ventaRegistrada$ = this.ventaRegistradaSource.asObservable();

  agregarProducto(producto: DetalleVentaResponse): void {
    this.productoAgregadoSource.next(producto);
  }

  ventaRegistrada(): void {
    this.ventaRegistradaSource.next(true);
    // Para resetear el valor y permitir nuevas emisiones
    setTimeout(() => this.ventaRegistradaSource.next(false), 100);
  }
}
