import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PersonaService } from '../../../../service/persona.service';
import { VentasService } from '../../../../service/venta.service';
import { SharedService } from '../../../../service/sharedservice';
import { CartService } from '../../../../service/cart.service';
import { PersonaResponse } from '../../../../../../models/persona-response-models';
import { DetalleVentaResponse } from '../../../../../../models/detallle-venta-response.models';
import { LibroRequest } from '../../../../../../models/libro-request.models';
import { Cart } from '../../../../../../models/cart-request.models';
import { VentaResponse } from '../../../../../../models/ventas-response.models';

@Component({
  selector: 'app-mant-fventa-register',
  templateUrl: './mant-fventa-register.component.html',
  styleUrls: ['./mant-fventa-register.component.css']
})
export class FventaRegisterComponent {
  personaForm: FormGroup;
  ventaForm: FormGroup;
  productosAgregados: DetalleVentaResponse[] = [];
  persona: PersonaResponse | null = null;
  showModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private personaService: PersonaService,
    private sharedService: SharedService,
    private ventasService: VentasService,
    private cartService: CartService
  ) {
    this.personaForm = this.fb.group({
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.ventaForm = this.fb.group({
      fechaEmision: [new Date().toISOString().split('T')[0], Validators.required],
      tipoComprobante: ['Boleta', Validators.required],  // valor por defecto
      tipoPago: ['Efectivo', Validators.required]     });
  }

  abrirModalProducto(): void {
    this.showModal = true;
  }

  cerrarModalProducto(): void {
    this.showModal = false;
  }

  onProductoAgregado(producto: DetalleVentaResponse): void {
    if (producto) {
      this.productosAgregados.push(producto);
    }
    this.cerrarModalProducto();
  }

  buscarPersona(): void {
    if (this.personaForm.invalid) return;

    const tipoDocumento = this.personaForm.get('tipoDocumento')!.value;
    const numeroDocumento = this.personaForm.get('numeroDocumento')!.value;

    this.personaService.obtenerPersonaPorDocumento(tipoDocumento, numeroDocumento).subscribe({
      next: (persona) => {
        this.persona = persona;
      },
      error: () => {
        this.persona = null;
      }
    });
  }

prepararObjetoVenta(): Cart {
  const items = this.productosAgregados.map(producto => {
    const libro: LibroRequest = {
      idLibro: producto.idLibro,
      titulo: producto.nombreProducto || '',
      isbn: producto.isbn || '',
      descripcion: producto.descripcion || '',
      condicion: producto.condicion || '',
      impresion: producto.impresion || '',
      tipoTapa: producto.tipoTapa || '',
      estado: producto.estado || false,
      idSubcategoria: producto.idSubcategoria || 0,
      idTipoPapel: producto.idTipoPapel || 0,
      idProveedor: producto.idProveedor || 0,
    };

    return {
      libro,
      precioVenta: producto.precioUnit,
      cantidad: producto.cantidad,
      descuento: producto.descuento || 0
    };
  });

  const totalAmount = items.reduce((sum, item) => sum + (item.precioVenta * item.cantidad) - (item.descuento || 0), 0);

  const personaParaVenta = this.persona ? {
    idPersona: this.persona.idPersona,
    nombre: this.persona.nombre,
    apellidoPaterno: this.persona.apellidoPaterno,
    apellidoMaterno: this.persona.apellidoMaterno,
    correo: this.persona.correo,
    tipoDocumento: this.persona.tipoDocumento,
    numeroDocumento: this.persona.numeroDocumento,
    telefono: this.persona.telefono,
    sub: ''
  } : {
    idPersona: 0,
    nombre: 'Cliente',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    tipoDocumento: '',
    numeroDocumento: '',
    telefono: '',
    sub: ''
  };

  return {
    items,
    totalAmount,
    persona: personaParaVenta,
    tipoComprobante: this.ventaForm.get('tipoComprobante')!.value,
    tipoPago: this.ventaForm.get('tipoPago')!.value
  };
}

registrarVenta(): void {
  // Eliminamos la validación de persona

  if (this.productosAgregados.length === 0) {
    console.error('No hay productos agregados a la venta');
    return;
  }

  const cartData = this.prepararObjetoVenta();

  if (cartData.totalAmount <= 0) {
    console.error('El total de la venta debe ser mayor que cero');
    return;
  }

  this.cartService.addToCart(cartData).subscribe({
    next: (response: VentaResponse) => {
      alert(`Venta registrada con N° de comprobante: ${response.nroComprobante || 'N/D'}`);
      this.limpiarFormulario();
      this.sharedService.ventaRegistrada();
    },
    error: (error) => {
      console.error('Error al registrar la venta', error);
    }
  });
}

  private limpiarFormulario(): void {
    this.productosAgregados = [];
    this.persona = null;
    this.personaForm.reset();
    this.ventaForm.patchValue({ fechaEmision: new Date().toISOString().split('T')[0] });
  }
}
