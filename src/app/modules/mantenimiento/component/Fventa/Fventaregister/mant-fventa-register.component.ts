import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DetalleVentaResponse } from '../../../../../models/detallle-venta-response.models';
import { PersonaService } from '../../../service/persona.service';
import { PersonaResponse } from '../../../../../models/persona-response-models';
import { SharedService } from '../../../service/sharedservice';
import { VentasService } from '../../../service/venta.service';
import { CartService } from '../../../service/cart.service';
import { alert_error, alert_success, alert_warning } from '../../../../../../functions/general.functions';
import { LibroRequest } from '../../../../../models/libro-request.models';
import { VentaRespon, VentaResponse } from '../../../../../models/ventas-response.models';
import { Cart } from '../../../../../models/cart-request.models';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-mant-fventa-register',
  templateUrl: './mant-fventa-register.component.html',
  styleUrls: ['./mant-fventa-register.component.css']
})
export class FventaRegisterComponent implements OnInit {
  personaForm: FormGroup;
  ventaForm: FormGroup;
  productosAgregados: DetalleVentaResponse[] = [];
  persona: PersonaResponse | null = null;
  showModal: boolean = false;
  cargando: boolean = false;
  mostrarPago: boolean = false;
  descuentoVenta: number = 0;

  constructor(
    private fb: FormBuilder,
    private personaService: PersonaService,
    private sharedService: SharedService,
    private ventasService: VentasService,
    private cartService: CartService,
    private _ventaService: VentasService
  ) {
    this.personaForm = this.fb.group({
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.ventaForm = this.fb.group({
      fechaEmision: [new Date().toISOString().split('T')[0], Validators.required],
      tipoComprobante: ['Boleta', Validators.required],
      tipoPago: ['Efectivo', Validators.required],
    });
  }
  ngOnInit() {
    // Restaurar personaForm
    const personaFormData = localStorage.getItem('personaForm');
    if (personaFormData) {
      this.personaForm.patchValue(JSON.parse(personaFormData));
    }

    // Restaurar ventaForm
    const ventaFormData = localStorage.getItem('ventaForm');
    if (ventaFormData) {
      this.ventaForm.patchValue(JSON.parse(ventaFormData));
    }

    // Restaurar productos agregados
    const productosData = localStorage.getItem('productosAgregados');
    if (productosData) {
      this.productosAgregados = JSON.parse(productosData);
    }

    // 🔹 Restaurar persona
    const personaData = localStorage.getItem('personaData');
    if (personaData) {
      this.persona = JSON.parse(personaData);
    }
    // Escuchar cambios y guardarlos
    this.personaForm.valueChanges.subscribe(value => {
      localStorage.setItem('personaForm', JSON.stringify(value));
    });

    this.ventaForm.valueChanges.subscribe(value => {
      localStorage.setItem('ventaForm', JSON.stringify(value));
    });
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
      localStorage.setItem('productosAgregados', JSON.stringify(this.productosAgregados));
    }
    this.cerrarModalProducto();
  }

  buscarPersona(): void {
    if (this.personaForm.invalid) return;
    this.cargando = true;

    const tipoDocumento = this.personaForm.get('tipoDocumento')!.value;
    const numeroDocumento = this.personaForm.get('numeroDocumento')!.value;

    this.personaService.obtenerPersonaPorDocumento(tipoDocumento, numeroDocumento).subscribe({
      next: (persona) => {
        this.persona = persona;
        localStorage.setItem('personaData', JSON.stringify(persona)); // 🔹 Guardar en localStorage
        this.cargando = false;
      },
      error: () => {
        this.persona = null;
        localStorage.removeItem('personaData'); // 🔹 Borrar si hubo error
        this.cargando = false;
        alert_error('Error', 'No se encontró el cliente');
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
    const totalDescuento = items.reduce((sum, item) => sum + (item.descuento || 0), 0);

    const personaParaVenta = this.persona ? {
      ...this.persona,
      sub: this.persona.sub ?? ''
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
      tipoPago: this.ventaForm.get('tipoPago')!.value,
      descuento: totalDescuento,
      vuelto: 0,
      efectivoRecibido: 0,
      montoDigital: 0
    };
  }

  registrarVenta(): void {
    if (this.productosAgregados.length === 0) {
      alert_warning('Agrega al menos un producto');
      return;
    }

    const cartData = this.prepararObjetoVenta();

    if (cartData.totalAmount <= 0) {
      alert_error('Error', 'El total de la venta debe ser mayor que cero');
      return;
    }

    this.cartService.addToCart(cartData).subscribe({
      next: (response: VentaResponse) => {
        alert_success('Venta registrada', 1800, `N° comprobante: ${response.nroComprobante || 'N/D'}`);
        this.limpiarFormulario();
        this.sharedService.ventaRegistrada();
      },
      error: () => {
        alert_error('Error', 'No se pudo registrar la venta');
      }
    });
  }

  private limpiarFormulario(): void {
    this.productosAgregados = [];
    this.persona = null;
    this.personaForm.reset();
    this.ventaForm.patchValue({ fechaEmision: new Date().toISOString().split('T')[0] });
  }

  abrirPantallaPago(): void {
    this.mostrarPago = true;
  }

  cerrarPantallaPago(): void {
    this.mostrarPago = false;
  }

  mostrarPDF: boolean = false;
  pdfurl: SafeResourceUrl | null = null;
  idVentas: number = 0;
  finalizarVentaDesdePago(cart: Cart): void {
    this.ventasService.registrarVentaConDetalle(cart).subscribe({
      next: (res: VentaRespon) => {
        this.idVentas = res.idVenta;

        Swal.fire('Éxito', 'Venta registrada correctamente', 'success').then(() => {
          // Primero imprimimos
          this.descargarPDF(this.idVentas, () => {
            // Después de imprimir, limpiamos el formulario
            this.resetearFormulario();
          });
        });
      },
      error: err => {
        console.error('Error al registrar venta:', err);
        Swal.fire('Error', 'Ocurrió un error al registrar la venta', 'error');
      }
    });
  }

  descargarPDF(idVenta: number, callback?: () => void): void {
    this._ventaService.getVentaPDF(idVenta).subscribe({
      next: (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        this.imprimirDesdeBlob(url, callback);
      },
      error: (err) => {
        console.error('❌ Error al obtener PDF:', err);
        if (callback) callback(); // por si igual quieres limpiar
      }
    });
  }

  imprimirDesdeBlob(blobUrl: string, callback?: () => void) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobUrl;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();

        // Dar tiempo a que abra el diálogo de impresión antes de limpiar
        setTimeout(() => {
          if (callback) callback();
        }, 1000);
      }, 500);
    };
  }

  resetearFormulario(): void {
    this.ventaForm.reset({
      fechaEmision: new Date().toISOString().split('T')[0],
      tipoComprobante: 'Boleta',
      tipoPago: 'Efectivo'
    });
    this.productosAgregados = [];
    this.persona = null;
    this.personaForm.reset({
      tipoDocumento: '',
      numeroDocumento: ''
    });
    this.descuentoVenta = 0,
      this.mostrarPago = false;
    localStorage.removeItem('personaForm');
    localStorage.removeItem('ventaForm');
    localStorage.removeItem('productosAgregados');
    localStorage.removeItem('personaData');
  }

  confirmarEliminarProducto(index: number): void {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.productosAgregados.splice(index, 1); // Primero eliminas
        localStorage.setItem('productosAgregados', JSON.stringify(this.productosAgregados)); // Luego guardas
        alert_success('Producto eliminado');
      }
    });
  }


  editarDescuentoProducto(index: number): void {
    const producto = this.productosAgregados[index];
    Swal.fire({
      title: `Descuento para "${producto.nombreProducto}"`,
      input: 'number',
      inputLabel: 'Ingresa el descuento en soles',
      inputValue: producto.descuento || 0,
      inputAttributes: {
        min: '0',
        step: '0.1'
      },
      showCancelButton: true,
      confirmButtonText: 'Aplicar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (value === null || value === '') return 'El descuento es requerido';
        if (parseFloat(value) < 0) return 'Debe ser un valor positivo';
        return null;
      }
    }).then(result => {
      if (result.isConfirmed) {
        const nuevoDescuento = parseFloat(result.value);
        if (!isNaN(nuevoDescuento)) {
          this.productosAgregados[index].descuento = nuevoDescuento;
        }
      }
    });
  }

  calcularDescuentoTotal(): number {
    return this.productosAgregados.reduce((total, item) => total + (item.descuento ?? 0), 0);
  }

  calcularTotal(): number {
    const subtotal = this.productosAgregados.reduce((total, item) => total + (item.precioUnit * item.cantidad), 0);
    return subtotal - this.calcularDescuentoTotal();
  }

  get subtotal(): number {
    return this.productosAgregados.reduce((sum, p) => sum + (p.precioUnit * p.cantidad), 0);
  }

  get totalVenta(): number {
    const subtotal = this.productosAgregados.reduce((acc, p) => acc + (p.precioUnit * p.cantidad), 0);
    const descuentoProductos = this.productosAgregados.reduce((acc, p) => acc + (p.descuento || 0), 0);
    return subtotal - descuentoProductos - (this.descuentoVenta || 0);
  }

}

