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

        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Venta registrada correctamente',
          confirmButtonText: 'Imprimir comprobante'
        }).then(() => {
          // Mostrar loader mientras se genera el PDF
          Swal.fire({
            title: 'Generando comprobante...',
            text: 'Por favor, espere unos segundos',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading(null);
            }
          });

          // Descargar PDF
          this.descargarPDF(this.idVentas, () => {
            Swal.close(); // Cerrar loader
            this.resetearFormulario(); // Resetear después de imprimir
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
        Swal.fire('Error', 'No se pudo generar el comprobante', 'error');
        if (callback) callback();
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
      title: `<div style="display: flex; align-items: center; gap: 12px; justify-content: center;">
              <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); 
                          border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-percentage" style="color: white; font-size: 18px;"></i>
              </div>
              <div style="text-align: left;">
                <div style="font-size: 20px; font-weight: 700; color: #1f2937; margin-bottom: 4px;">
                  Editar Producto
                </div>
                <div style="font-size: 14px; color: #6b7280; font-weight: 400;">
                  ${producto.nombreProducto}
                </div>
              </div>
            </div>`,

      html: `
      <div style="padding: 20px 0; font-family: 'Inter', sans-serif;">
        <!-- Info -->
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); 
                    border-radius: 12px; padding: 16px; margin-bottom: 24px; border: 1px solid #e5e7eb;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 16px; text-align: center;">
            <div>
              <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">PRECIO UNITARIO</div>
              <div style="font-size: 16px; font-weight: 700; color: #059669;">S/ ${producto.precioUnit?.toFixed(2) || '0.00'}</div>
            </div>
            <div>
              <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">CANTIDAD ACTUAL</div>
              <div style="font-size: 16px; font-weight: 700; color: #3b82f6;">${producto.cantidad || 1}</div>
            </div>
            <div>
              <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">DESCUENTO ACTUAL</div>
              <div style="font-size: 16px; font-weight: 700; color: #f59e0b;">S/ ${producto.descuento?.toFixed(2) || '0.00'}</div>
            </div>
          </div>
        </div>

        <!-- Inputs -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <div>
            <label style="font-weight: 600; font-size: 14px; color: #374151; margin-bottom: 8px; display: flex; gap: 8px; align-items: center;">
              <i class="fas fa-sort-numeric-up" style="color: #6366f1;"></i> Nueva Cantidad
            </label>
            <input id="nueva-cantidad" type="number" min="1" step="1" value="${producto.cantidad || 1}"
                   style="width:100%;padding:12px 16px;border:2px solid #e5e7eb;border-radius:12px;">
          </div>
          <div>
            <label style="font-weight: 600; font-size: 14px; color: #374151; margin-bottom: 8px; display: flex; gap: 8px; align-items: center;">
              <i class="fas fa-percentage" style="color: #6366f1;"></i> Nuevo Descuento (S/)
            </label>
            <input id="nuevo-descuento" type="number" min="0" step="0.1" value="${producto.descuento || 0}"
                   style="width:100%;padding:12px 16px;border:2px solid #e5e7eb;border-radius:12px;">
          </div>
        </div>

        <!-- Total -->
        <div id="total-preview" style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); 
                                        border-radius: 12px; padding: 16px; border: 1px solid #a7f3d0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: 600; color: #065f46; font-size: 15px; display: flex; align-items: center; gap: 8px;">
              <i class="fas fa-calculator" style="color: #059669;"></i> Nuevo Total
            </div>
            <div style="font-size: 20px; font-weight: 800; color: #059669;">
              S/ <span id="total-amount">${((producto.precioUnit || 0) * (producto.cantidad || 1) - (producto.descuento || 0)).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    `,

      didOpen: () => {
        const cantidadInput = document.getElementById('nueva-cantidad') as HTMLInputElement;
        const descuentoInput = document.getElementById('nuevo-descuento') as HTMLInputElement;
        const totalAmount = document.getElementById('total-amount') as HTMLElement;
        const precioUnitario = producto.precioUnit || 0;

        const actualizarTotal = () => {
          const cantidad = parseFloat(cantidadInput.value) || 1;
          const descuento = parseFloat(descuentoInput.value) || 0;
          const total = (precioUnitario * cantidad) - descuento;
          totalAmount.textContent = total.toFixed(2);
        };

        cantidadInput.addEventListener('input', actualizarTotal);
        descuentoInput.addEventListener('input', actualizarTotal);
      },

      showCancelButton: true,
      confirmButtonText: `<i class="fas fa-check"></i> Aplicar Cambios`,
      cancelButtonText: `<i class="fas fa-times"></i> Cancelar`,
      customClass: {
        popup: 'swal-popup-custom',
        confirmButton: 'swal-confirm-custom',
        cancelButton: 'swal-cancel-custom'
      },
      width: '600px',
      padding: '0',
      background: '#fff',

      preConfirm: () => {
        const nuevaCantidad = parseFloat((document.getElementById('nueva-cantidad') as HTMLInputElement).value);
        const nuevoDescuento = parseFloat((document.getElementById('nuevo-descuento') as HTMLInputElement).value);

        if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
          Swal.showValidationMessage('La cantidad debe ser mayor a 0');
          return false;
        }
        if (isNaN(nuevoDescuento) || nuevoDescuento < 0) {
          Swal.showValidationMessage('El descuento debe ser mayor o igual a 0');
          return false;
        }
        const subtotal = (producto.precioUnit || 0) * nuevaCantidad;
        if (nuevoDescuento > subtotal) {
          Swal.showValidationMessage('El descuento no puede ser mayor al subtotal');
          return false;
        }
        return { cantidad: nuevaCantidad, descuento: nuevoDescuento };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        producto.cantidad = result.value.cantidad;
        producto.descuento = result.value.descuento;
      }
    });
  }

  // Métodos de cálculo globales
  calcularDescuentoTotal(): number {
    const descuentoProductos = this.productosAgregados.reduce((total, item) => total + (item.descuento ?? 0), 0);
    const descuentoGeneral = this.descuentoVenta ?? 0;
    return descuentoProductos + descuentoGeneral;
  }

  calcularTotal(): number {
    return this.subtotal - this.calcularDescuentoTotal();
  }

  get subtotal(): number {
    return this.productosAgregados.reduce((sum, p) => sum + (p.precioUnit * p.cantidad), 0);
  }

  get totalVenta(): number {
    const subtotal = this.subtotal;
    const descuentoProductos = this.productosAgregados.reduce((acc, p) => acc + (p.descuento || 0), 0);
    return subtotal - descuentoProductos - (this.descuentoVenta || 0);
  }
}