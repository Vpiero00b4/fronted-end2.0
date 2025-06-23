import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioResponse } from '../../../../../models/usuario-login.response';
import { VentaResponse } from '../../../../../models/ventas-response.models';
import { VentasService } from '../../../service/venta.service';
import { SharedService } from '../../../service/sharedservice';
import { DetalleVentaResponse } from '../../../../../models/detallle-venta-response.models';
import { DatalleCarrito } from '../../../../../models/detallecarrito.models'; 

@Component({
  selector: 'app-mant-venta-register',
  templateUrl: './mant-venta-register.component.html',
  styleUrls: ['./mant-venta-register.component.css']
})
export class MantVentaRegisterComponent implements OnInit {

  @Input() title: string = '';
  @Input() venta: VentaResponse = new VentaResponse();
  @Input() usuario: UsuarioResponse = new UsuarioResponse();
  @Input() accion: number = 0;

  @Output() closeModalEmmit = new EventEmitter<boolean>();

  myForm: FormGroup;
  productos: DetalleVentaResponse[] = [];
  totalPrecio: number = 0;

  constructor(
    private fb: FormBuilder,
    private _ventaService: VentasService,
    private _sharedService: SharedService
  ) {
    this.myForm = this.fb.group({
      idVentas: [{ value: 0, disabled: true }],
      tipoComprobante: [null, Validators.required],
      nroComprobante: [null, Validators.required],
      fechaVenta: [new Date().toISOString().substring(0, 10), Validators.required],
      idCliente: [null, Validators.required],
      idUsuario: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.myForm.patchValue({
      idUsuario: this.usuario.idUsuario,
      idVentas: this.venta.idVentas || 0
    });

    this._sharedService.productoAgregado$.subscribe(producto => {
      if (producto) {
        this.productos.push(producto);
        this.calcularTotal();
      }
    });
  }

  calcularTotal() {
    this.totalPrecio = this.productos.reduce((acc, item) => acc + item.precioUnit * item.cantidad, 0);
  }
guardar() {
  if (this.myForm.invalid) {
    console.error('Formulario inválido');
    return;
  }
  if (this.productos.length === 0) {
    console.error('No hay productos agregados');
    return;
  }

  const items = this.productos.map(p => ({
    libro: {
      idLibro: p.idLibro,
      titulo: p.nombreProducto,
      isbn: p.isbn || '',
      tamanno: p.tamanno || 'N/A', // valor por defecto no vacío
      descripcion: p.descripcion || '',
      condicion: p.condicion || '',
      impresion: p.impresion || '',
      tipoTapa: p.tipoTapa || '',
      estado: p.estado ?? true,
      idSubcategoria: p.idSubcategoria || 0,
      idTipoPapel: p.idTipoPapel || 0,
      idProveedor: p.idProveedor || 0,
    },
    precioVenta: p.precioUnit,
    cantidad: p.cantidad,
    descuento: p.descuento || 0
  }));

  console.log('Items a enviar:', items);
  console.log('Total precio:', this.totalPrecio);
  console.log('Tipo comprobante:', this.myForm.get('tipoComprobante')?.value);

  if (!items.length) {
    console.error('No hay items para enviar');
    return;
  }
  if (this.totalPrecio <= 0) {
    console.error('Total debe ser mayor que cero');
    return;
  }
  if (!this.myForm.get('tipoComprobante')?.value) {
    console.error('Tipo comprobante es obligatorio');
    return;
  }

  const detalleCarrito: DatalleCarrito = {
    items: items,
    totalAmount: this.totalPrecio,
    persona: {
      idPersona: this.usuario.idPersona || 0,
      nombre: this.usuario.nombre || '',
      apellidoPaterno: this.usuario.apellidoPaterno || '',
      apellidoMaterno: this.usuario.apellidoMaterno || '',
      correo: this.usuario.correo || '',
      tipoDocumento: this.usuario.tipoDocumento || '',
      numeroDocumento: this.usuario.numeroDocumento || '',
      telefono: this.usuario.telefono || '',
      sub: this.usuario.sub || ''
    },
    tipoComprobante: this.myForm.get('tipoComprobante')?.value,
    tipoPago: 'Efectivo'
  };

  console.log('DETALLE CARRITO A ENVIAR:', JSON.stringify(detalleCarrito, null, 2));

  this._ventaService.enviarCarrito(detalleCarrito).subscribe({
    next: () => {
  this._sharedService.ventaRegistrada();
      this.closeModalEmmit.emit(true);
    },
    error: err => console.error('Error al registrar la venta', err)
  });
}
  cerrarModal() {
    
    this.closeModalEmmit.emit(false);
  }
}
