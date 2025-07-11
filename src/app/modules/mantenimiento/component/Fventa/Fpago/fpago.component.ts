import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DetalleVentaResponse } from '../../../../../models/detallle-venta-response.models';
import { PersonaResponse } from '../../../../../models/persona-response-models';
import { Cart } from '../../../../../models/cart-request.models';

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

  pagoForm!: FormGroup;
  Math = Math;

  constructor(private fb: FormBuilder) {}

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
    return this.productos.reduce((sum, p) => sum + (p.descuento || 0), 0);
  }

  get totalPagar(): number {
    return this.subtotal - this.totalDescuento;
  }

  get igv(): number {
    const sinIGV = this.totalPagar / 1.18;
    return this.totalPagar - sinIGV;
  }

  get vuelto(): number {
    const efectivo = this.pagoForm?.value?.efectivoRecibido || 0;
    const digital = this.pagoForm?.value?.montoDigital || 0;
    return (efectivo + digital) - this.totalPagar;
  }

  ventaValida(): boolean {
    const efectivo = this.pagoForm?.value?.efectivoRecibido || 0;
    const digital = this.pagoForm?.value?.montoDigital || 0;
    const totalRecibido = efectivo + digital;
    return totalRecibido >= this.totalPagar;
  }

  onConfirmarPago(): void {
    if (this.pagoForm.invalid) return;

    const cartFinal: Cart = {
      items: this.productos.map(p => ({
        libro: {
          idLibro: p.idLibro,
          titulo: p.nombreProducto,
          isbn: p.isbn,
          descripcion: p.descripcion,
          condicion: p.condicion || '',
          impresion: p.impresion || '',
          tipoTapa: p.tipoTapa || '',
          estado: p.estado ?? true,
          idSubcategoria: p.idSubcategoria || 0,
          idTipoPapel: p.idTipoPapel || 0,
          idProveedor: p.idProveedor || 0,
          imagen: typeof p.imagen === 'string' ? p.imagen : ''
        },
        precioVenta: p.precioUnit,
        cantidad: p.cantidad,
        descuento: p.descuento || 0
      })),
      totalAmount: this.totalPagar,
      persona: {
        ...this.cliente,
        sub: this.cliente.sub || ''
      },
      tipoComprobante: this.tipoComprobante,
      tipoPago: this.pagoForm.value.tipoPago,
      descuento: this.totalDescuento,
      vuelto: this.vuelto,
      efectivoRecibido: this.pagoForm.value.efectivoRecibido,
      montoDigital: this.pagoForm.value.montoDigital
    };

    console.log("🚀 JSON final a enviar:", cartFinal);
    this.confirmarPago.emit(cartFinal);
  }
}

