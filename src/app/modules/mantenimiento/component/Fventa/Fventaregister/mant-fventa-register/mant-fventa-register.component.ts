import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PersonaService } from '../../../../service/persona.service';
import { DetalleVentaService } from '../../../../service/detalleventa.service';
import { VentasService } from '../../../../service/venta.service';
import { SharedService } from '../../../../service/sharedservice';
import { PersonaResponse } from '../../../../../../models/persona-response-models';
import { DetalleVentaResponse } from '../../../../../../models/detallle-venta-response.models';
import { VentaResponse } from '../../../../../../models/ventas-response.models';
import { VentaRequest } from '../../../../../../models/ventas-request.models';
import { DatalleCarrito } from '../../../../../../models/detallecarrito.models';
import { Cart } from '../../../../../../models/cart-request.models';
import { CartService } from '../../../../service/cart.service';
import { ItemCarrito } from '../../../../../../models/Itemcarrito-request.models';
import { LibroRequest } from '../../../../../../models/libro-request.models';
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
  libros: any;

  constructor(
    private fb: FormBuilder,
    private personaService: PersonaService,
    private sharedService: SharedService,
    private ventasService: VentasService,
    private cartService: CartService,
    private detalleVentaService: DetalleVentaService,
    private router: Router
  ) {
    this.personaForm = this.fb.group({
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.ventaForm = this.fb.group({
      fechaEmision: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  ngOnInit(): void {
    this.sharedService.productoAgregado$.subscribe(producto => {
      if (producto) {
        this.productosAgregados.push(producto);
      }
    });
  }

  abrirModalProducto(): void {
    this.showModal = true;
  }

  cerrarModalProducto(): void {
    this.showModal = false;
  }

  buscarPersona(): void {
    if (this.personaForm.invalid) {
      return;
    }
    const tipoDocumento = this.personaForm.get('tipoDocumento')!.value;
    const numeroDocumento = this.personaForm.get('numeroDocumento')!.value;
    
    this.personaService.obtenerPersonaPorDocumento(tipoDocumento, numeroDocumento).subscribe({
      next: (persona) => {
        this.persona = persona;
      },
      error: (error) => {
        console.error('Error al buscar la persona:', error);
        this.persona = null;
      }
    });
  }

  agregarProducto(producto: DetalleVentaResponse): void {
    const libroInfo = this.libros.find((libro: { idLibro: number; }) => libro.idLibro === producto.idLibro);

    if (libroInfo) {
      const productoExtendido: DetalleVentaResponse = {
        ...producto,
        isbn: libroInfo.isbn,
        descripcion: libroInfo.descripcion,
        idProveedor: libroInfo.idProveedor
      };
      this.productosAgregados.push(productoExtendido);
    } else {
      console.error('Información del libro no disponible');
    }
  }

  prepararObjetoVenta(): Cart {
    const items = this.productosAgregados.map(producto => {
      // Construye el objeto libro completo con todas las propiedades requeridas
      const libro: LibroRequest = {
        idLibro: producto.idLibro,
        titulo: producto.nombreProducto || '', // Suponiendo que estas propiedades existen en 'producto'
        isbn: producto.isbn || '',
        tamanno: producto.tamanno || '',
        descripcion: producto.descripcion || '',
        condicion: producto.condicion || '',
        impresion: producto.impresion || '',
        tipoTapa: producto.tipoTapa || '',
        estado: producto.estado || false,
        idSubcategoria: producto.idSubcategoria || 0,
        idTipoPapel: producto.idTipoPapel || 0,
        idProveedor: producto.idProveedor || 0,
        imagen: producto.imagen || ''
        // ... y así con el resto de propiedades requeridas
      };
  
      // Ahora 'libro' tiene todas las propiedades necesarias
      return {
        libro: libro,
        PrecioVenta: producto.precioUnit,
        Cantidad: producto.cantidad
      };
    });
  
    const totalAmount = items.reduce((sum, item) => sum + item.PrecioVenta * item.Cantidad, 0);
  
    return { items, totalAmount };
  }
  
  
  sendCartData() {
    const cartData: Cart = {
      items: [
        {
          libro: {
            idLibro: 2, // Suponiendo que este es el ID del libro que deseas agregar
            titulo: "string",
            isbn: "string",
            tamanno: "string",
            descripcion: "string",
            condicion: "string",
            impresion: "string",
            tipoTapa: "string",
            estado: true,
            idSubcategoria: 0,
            idTipoPapel: 0,
            idProveedor: 0,
            imagen:null
          },
          PrecioVenta: 0,
          Cantidad: 0
        }
        // ... más items si es necesario
      ],
      totalAmount: 0
    };
  }
    registrarVenta(): void {
      const cartData = this.prepararObjetoVenta();
    
      this.cartService.addToCart(cartData).subscribe({
        next: (response) => {
          console.log('Venta registrada con éxito', response);
          // Aquí puedes agregar lógica adicional, como redirigir al usuario
        },
        error: (error) => {
          console.error('Error al registrar la venta', error);
          // Aquí puedes manejar errores, como mostrar un mensaje al usuario
        }
      });
    }
  }
