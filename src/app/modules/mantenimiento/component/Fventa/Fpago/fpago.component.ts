import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DetalleVentaResponse } from '../../../../../models/detallle-venta-response.models';
import { PersonaResponse } from '../../../../../models/persona-response-models';
import { Cart } from '../../../../../models/cart-request.models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fpago',
  templateUrl: './fpago.component.html',
  styleUrls: ['./fpago.component.css']
})
export class FpagoComponent implements OnInit {
  @Input() productos: DetalleVentaResponse[] = [];
  @Input() cliente!: PersonaResponse;
  @Input() tipoComprobante: string = '';

  @Output() cerrar = new EventEmitter<void>();
  @Output() confirmarPago = new EventEmitter<Cart>();
  @Input() descuentoVenta: number = 0;


  pagoForm!: FormGroup;
  Math = Math;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.pagoForm = this.fb.group({
      efectivoRecibido: [0, [Validators.required, Validators.min(0)]],
      montoDigital: [0, [Validators.required, Validators.min(0)]],
      tipoPago: ['Efectivo', Validators.required]
    });
  }

  get subtotal(): number {
    return this.productos.reduce((sum, p) => sum + (p.precioUnit * p.cantidad), 0);
  }

  get totalDescuento(): number {
    return this.productos.reduce((sum, p) => sum + (p.descuento ?? 0), 0);
  }

  get totalPagar(): number {
    return this.subtotal - this.totalDescuento;
  }

  get igv(): number {
    const sinIGV = this.totalPagar / 1.18;
    return this.totalPagar - sinIGV;
  }

  get vuelto(): number {
    const efectivo = this.pagoForm.value.efectivoRecibido ?? 0;
    const digital = this.pagoForm.value.montoDigital ?? 0;
    return (efectivo + digital) - this.totalPagar;
  }

  ventaValida(): boolean {
    const efectivo = this.pagoForm.value.efectivoRecibido ?? 0;
    const digital = this.pagoForm.value.montoDigital ?? 0;
    return (efectivo + digital) >= this.totalPagar;
  }

  onConfirmarPago(): void {
    if (this.pagoForm.invalid) return;

    const efectivo = this.pagoForm.value.efectivoRecibido ?? 0;
    const digital = this.pagoForm.value.montoDigital ?? 0;
    const vuelto = this.vuelto ?? 0;
    const descuentoGeneral = this.descuentoVenta ?? 0;

    const totalAmount = this.subtotal - this.totalDescuento;
    const totalVenta = totalAmount - descuentoGeneral;
    const totalRecibido = efectivo + digital;
    const totalEsperado = totalRecibido - vuelto;

    if (Math.abs(totalVenta - totalEsperado) > 0.01) {
      Swal.fire({
        icon: 'error',
        title: 'Error en pago',
        text: `Inconsistencia en el monto de pago. Total a cobrar: S/ ${totalVenta.toFixed(2)}. Recibido - vuelto: S/ ${totalEsperado.toFixed(2)}`
      });
      return;
    }

    const cartFinal: Cart = {
      items: this.productos.map(p => ({
        libro: {
          idLibro: p.idLibro,
          titulo: p.nombreProducto,
          isbn: p.isbn,
          descripcion: p.descripcion ?? '',
          condicion: p.condicion ?? '',
          impresion: p.impresion ?? '',
          tipoTapa: p.tipoTapa ?? '',
          estado: p.estado ?? true,
          idSubcategoria: p.idSubcategoria ?? 0,
          idTipoPapel: p.idTipoPapel ?? 0,
          idProveedor: p.idProveedor ?? 0,
          tamanno: p.tamanno ?? '',
          imagen: typeof p.imagen === 'string' ? p.imagen : ''
        },
        precioVenta: p.precioUnit ?? 0,
        cantidad: p.cantidad ?? 0,
        descuento: p.descuento ?? 0
      })),
      totalAmount: totalAmount,
      persona: {
        idPersona: this.cliente.idPersona ?? 0,
        nombre: this.cliente.nombre ?? '',
        apellidoPaterno: this.cliente.apellidoPaterno ?? '',
        apellidoMaterno: this.cliente.apellidoMaterno ?? '',
        correo: this.cliente.correo ?? '',
        tipoDocumento: this.cliente.tipoDocumento ?? '',
        numeroDocumento: this.cliente.numeroDocumento ?? '',
        telefono: this.cliente.telefono ?? '',
        sub: this.cliente.sub ?? ''
      },
      tipoComprobante: this.tipoComprobante,
      tipoPago: this.pagoForm.value.tipoPago,
      descuento: descuentoGeneral,
      efectivoRecibido: Number(this.pagoForm.value.efectivoRecibido) || 0,
      montoDigital: Number(this.pagoForm.value.montoDigital) || 0,
      vuelto: Number(this.vuelto) || 0,
    };

    console.log('🚀 JSON a enviar:', cartFinal);
    this.confirmarPago.emit(cartFinal);

  }
}
