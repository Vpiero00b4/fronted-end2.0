import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LibroResponse } from '../../../../../models/libro-response.models';
import { LibroService } from '../../../service/libro.service';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { DetalleVentaResponse } from '../../../../../models/detallle-venta-response.models';
import { SharedService } from '../../../service/sharedservice';
import Swal from 'sweetalert2';
import { Categoria, SubCategoria } from '../../../../../models/libro-request.models';
import { CategoriaService } from '../../../service/categoria.service';
import { ProveedorService } from '../../../service/proveedor.service';
import { SubCategoriaService } from '../../../service/sub-categoria.service';
import { ProveedorResponse } from '../../../../../models/proveedor-response.models';

@Component({
  selector: 'app-libro-modal-component',
  templateUrl:'./libro-modal-component.component.html',
  styleUrls: ['./libro-modal-component.component.css']
})
export class LibroModalComponentComponent implements OnInit, OnDestroy {

  @Output() cerrarModal = new EventEmitter<void>();
  @Output() libroAgregado = new EventEmitter<DetalleVentaResponse>();

  @ViewChild('cantidadInput') cantidadInput!: ElementRef;

  private destroy$ = new Subject<void>();
  
  mostrarOpciones: boolean = false;
  libroForm: FormGroup;
  libros: LibroResponse[] = [];
  librosFiltrados: LibroResponse[] = [];
  subcategorias: SubCategoria[] = [];
  proveedores: ProveedorResponse[] = [];

  // Flag para evitar bucles cuando actualizamos programáticamente
  private actualizandoBusqueda: boolean = false;

  constructor(
    private fb: FormBuilder,
    private libroService: LibroService,
    private subcategoriaService: SubCategoriaService,
    private proveedorService: ProveedorService
  ) {
    this.libroForm = this.fb.group({
      idLibro: [null, Validators.required],
      busqueda: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioVenta: [{ value: '', disabled: true }, Validators.required],
      descuento: [0, [Validators.min(0)]],
      importe: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    // Cargar subcategorías y proveedores antes de listar libros
    forkJoin({
      subcategorias: this.subcategoriaService.getList(),
      proveedores: this.proveedorService.getAll()
    }).pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ({ subcategorias, proveedores }) => {
        this.subcategorias = subcategorias;
        this.proveedores = proveedores;

        // Una vez cargadas, listar libros
        this.listarLibros();

        // Configurar el buscador mejorado
        this.configurarBuscador();
      },
      error: (err) => console.error('Error al cargar subcategorías o proveedores', err)
    });

    // Configurar listeners para cálculo del importe
    this.libroForm.get('cantidad')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => this.actualizarTotalImporte());
    
    this.libroForm.get('precioVenta')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => this.actualizarTotalImporte());
    
    this.libroForm.get('descuento')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => this.actualizarTotalImporte());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private configurarBuscador(): void {
    // Configurar búsqueda automática mejorada
    this.libroForm.get('busqueda')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        // Solo buscar si no estamos actualizando programáticamente
        if (!this.actualizandoBusqueda) {
          return this.buscarLibro(value);
        }
        return of([]);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (libros) => {
        if (!this.actualizandoBusqueda) {
          this.librosFiltrados = libros;
          this.mostrarOpciones = libros.length > 0;
        }
      },
      error: (err) => console.error('Error en búsqueda automática:', err)
    });
  }

  listarLibros(): void {
    this.libroService.getAllLibros().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (libros) => {
        this.libros = libros.map(libro => {
          const subcat = this.subcategorias.find(s => s.id === libro.idSubcategoria);
          const proveedor = this.proveedores.find(p => p.idProveedor === libro.idProveedor);

          return {
            ...libro,
            displayText: `${libro.isbn} - ${libro.titulo} - Cat: ${subcat?.descripcion ?? 'Sin subcategoría'} - Marca: ${proveedor?.razonSocial ?? 'Sin proveedor'}`
          };
        });
        this.librosFiltrados = this.libros.slice(0, 10);
      },
      error: (err) => console.error('Error al cargar libros:', err)
    });
  }

  // Búsqueda optimizada con prioridad ISBN > Título
  buscarLibro(consulta: string): Observable<LibroResponse[]> {
    if (!consulta || !consulta.trim()) {
      return of(this.libros.slice(0, 10));
    }

    const query = consulta.trim().toLowerCase();
    
    // Filtrar con prioridades
    const resultados = this.libros.filter(libro => {
      const isbn = libro.isbn?.toLowerCase() || '';
      const titulo = libro.titulo?.toLowerCase() || '';
      
      return isbn.includes(query) || titulo.includes(query);
    });

    // Ordenar por relevancia: ISBN tiene prioridad
    resultados.sort((a, b) => {
      const isbnA = a.isbn?.toLowerCase() || '';
      const tituloA = a.titulo?.toLowerCase() || '';
      const isbnB = b.isbn?.toLowerCase() || '';
      const tituloB = b.titulo?.toLowerCase() || '';

      // Coincidencia exacta ISBN tiene máxima prioridad
      if (isbnA === query) return -1;
      if (isbnB === query) return 1;

      // ISBN que empiece con la consulta
      if (isbnA.startsWith(query) && !isbnB.startsWith(query)) return -1;
      if (isbnB.startsWith(query) && !isbnA.startsWith(query)) return 1;

      // ISBN que contenga la consulta vs título
      if (isbnA.includes(query) && tituloB.includes(query) && !isbnB.includes(query)) return -1;
      if (isbnB.includes(query) && tituloA.includes(query) && !isbnA.includes(query)) return 1;

      return 0;
    });

    // Mapear con displayText actualizado
    const resultadosConDisplay = resultados.slice(0, 15).map(libro => {
      const subcat = this.subcategorias.find(s => s.id === libro.idSubcategoria);
      const proveedor = this.proveedores.find(p => p.idProveedor === libro.idProveedor);

      return {
        ...libro,
        displayText: `${libro.isbn} - ${libro.titulo} - Cat: ${subcat?.descripcion ?? 'Sin subcategoría'} - Marca: ${proveedor?.razonSocial ?? 'Sin proveedor'}`
      };
    });

    return of(resultadosConDisplay);
  }

  seleccionarLibro(idLibroSeleccionado: number): void {
    if (!idLibroSeleccionado) return;

    // Desactivar búsqueda automática temporalmente
    this.actualizandoBusqueda = true;
    this.mostrarOpciones = false;

    this.libroService.getUltimoPrecioByLibroId(idLibroSeleccionado).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (precio) => {
        if (precio) {
          this.libroForm.patchValue({ 
            idLibro: idLibroSeleccionado, 
            precioVenta: precio.precioVenta 
          });
          this.actualizarTotalImporte();

          const libroSeleccionado = this.libros.find(l => l.idLibro === idLibroSeleccionado);
          if (libroSeleccionado) {
            this.libroForm.patchValue({ 
              busqueda: `${libroSeleccionado.isbn} - ${libroSeleccionado.titulo}` 
            });
          }

          // Enfocar cantidad y reactivar búsqueda
          setTimeout(() => {
            this.cantidadInput?.nativeElement?.focus();
            this.cantidadInput?.nativeElement?.select();
            this.actualizandoBusqueda = false;
          }, 100);
        }
      },
      error: (error) => {
        this.actualizandoBusqueda = false;
        Swal.fire({ 
          icon: 'error', 
          title: 'Error', 
          text: 'No se pudo obtener el precio del libro' 
        });
      }
    });
  }

  actualizarTotalImporte(): void {
    const cantidad = this.libroForm.get('cantidad')?.value || 0;
    const precioVenta = this.libroForm.get('precioVenta')?.value || 0;
    const descuento = this.libroForm.get('descuento')?.value || 0;
    const totalImporte = Math.max(0, (precioVenta * cantidad) - descuento);
    this.libroForm.patchValue({ importe: totalImporte.toFixed(2) });
  }

  agregarLibro(): void {
    if (!this.libroForm.valid) {
      // Marcar campos como tocados para mostrar errores
      Object.keys(this.libroForm.controls).forEach(key => {
        this.libroForm.get(key)?.markAsTouched();
      });
      
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor complete todos los campos requeridos'
      });
      return;
    }

    const formValue = this.libroForm.getRawValue();
    const libroSeleccionado = this.libros.find(libro => libro.idLibro === formValue.idLibro);
    
    if (!libroSeleccionado) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Libro no encontrado'
      });
      return;
    }

    const detalleVenta: DetalleVentaResponse = {
      idVentas: 0,
      idLibro: libroSeleccionado.idLibro,
      nombreProducto: libroSeleccionado.titulo,
      isbn: libroSeleccionado.isbn,
      precioUnit: formValue.precioVenta,
      descripcion: libroSeleccionado.descripcion,
      idProveedor: libroSeleccionado.idProveedor,
      cantidad: formValue.cantidad,
      importe: formValue.importe,
      imagen: libroSeleccionado.imagen ?? null,
      descuento: formValue.descuento || 0
    };

    this.libroAgregado.emit(detalleVenta);

    Swal.fire({ 
      toast: true, 
      icon: 'success', 
      title: 'Producto agregado correctamente para la venta', 
      position: 'top-end', 
      showConfirmButton: false, 
      timer: 1500 
    });
    
    this.cerrar();
  }

  limpiarBusqueda(): void {
    this.actualizandoBusqueda = true;
    this.libroForm.patchValue({ 
      busqueda: '',
      idLibro: null,
      precioVenta: '',
      importe: ''
    });
    this.mostrarOpciones = false;
    setTimeout(() => this.actualizandoBusqueda = false, 100);
  }

  mostrarOpcionesDeLibros(): void {
    if (!this.actualizandoBusqueda) {
      this.mostrarOpciones = true;
      const busqueda = this.libroForm.get('busqueda')?.value;
      if (!busqueda || !busqueda.trim()) {
        this.librosFiltrados = this.libros.slice(0, 10);
      }
    }
  }

  ocultarOpcionesTemporalmente(): void {
    setTimeout(() => {
      if (!this.actualizandoBusqueda) {
        this.mostrarOpciones = false;
      }
    }, 200);
  }

  // Método para manejar Enter en el buscador
  onBusquedaKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.librosFiltrados.length > 0) {
        this.seleccionarLibro(this.librosFiltrados[0].idLibro);
      }
    } else if (event.key === 'Escape') {
      this.mostrarOpciones = false;
    }
  }

  // Métodos auxiliares para el template
  trackByLibroId(index: number, libro: LibroResponse): number {
    return libro.idLibro;
  }

  cerrar(): void {
    this.libroForm.reset({ 
      cantidad: 1, 
      precioVenta: '', 
      importe: '', 
      busqueda: '',
      descuento: 0
    });
    this.mostrarOpciones = false;
    this.actualizandoBusqueda = false;
    this.cerrarModal.emit();
  }
  incrementarCantidad(): void {
  const cantidadCtrl = this.libroForm.get('cantidad');
  if (cantidadCtrl) {
    const valor = cantidadCtrl.value || 0;
    cantidadCtrl.setValue(valor + 1);
    this.actualizarTotalImporte();
  }
}

decrementarCantidad(): void {
  const cantidadCtrl = this.libroForm.get('cantidad');
  if (cantidadCtrl) {
    const valor = cantidadCtrl.value || 1;
    if (valor > 1) {
      cantidadCtrl.setValue(valor - 1);
      this.actualizarTotalImporte();
    }
  }
}

} 