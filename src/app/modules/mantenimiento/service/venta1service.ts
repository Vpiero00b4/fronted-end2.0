// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { DetalleVentaResponse } from '../../../models/detallle-venta-response.models';

// @Injectable({
//   providedIn: 'root'
// })
// export class Venta1Service {

//   private _productosAgregados = new BehaviorSubject<DetalleVentaResponse[]>([]);
//   productosAgregados$ = this._productosAgregados.asObservable();

//   constructor() { }

//   agregarProducto(producto: DetalleVentaResponse) {
//     const productosActualizados = [...this._productosAgregados.value, producto];
//     this._productosAgregados.next(productosActualizados);
//   }

//   actualizarProducto(idLibro: number, cantidad: number, precioVenta: number): void {
//     const productos = this._productosAgregados.value.map(producto => {
//       if (producto.idLibro === idLibro) {
//         return {
//           ...producto,
//           cantidad,
//           precioUnit: precioVenta,
//           importe: cantidad * precioVenta // Asegúrate de recalcular el importe aquí
//         };
//       }
//       return producto;
//     });
//     this._productosAgregados.next(productos);
//   }
// }
