import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LibroResponse } from '../../../../../models/libro-response.models';
import { LibroService } from '../../../service/libro.service';
import { forkJoin, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
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
  templateUrl: './libro-modal-component.component.html',
  styleUrls: ['./libro-modal-component.component.css']
})
export class LibroModalComponentComponent implements OnInit {

  @Output() cerrarModal = new EventEmitter<void>();
  @Output() libroAgregado = new EventEmitter<DetalleVentaResponse>();

  @ViewChild('cantidadInput') cantidadInput!: ElementRef;

  mostrarOpciones: boolean = false;
  libroForm: FormGroup;
  libros: LibroResponse[] = [];
  librosFiltrados: LibroResponse[] = [];
  autocompleteControl = new FormControl();
  subcategorias: SubCategoria[] = []; // <-- ahora solo subcategorías
  proveedores: ProveedorResponse[] = []; // <-- nueva propiedad

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
    }).subscribe({
      next: ({ subcategorias, proveedores }) => {
        this.subcategorias = subcategorias;
        this.proveedores = proveedores;

        // Una vez cargadas, listar libros
        this.listarLibros();

        // Configurar el buscador
        this.libroForm.get('busqueda')?.valueChanges.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(value => this.buscarLibro(value))
        ).subscribe(libros => {
          this.librosFiltrados = libros;
        });
      },
      error: (err) => console.error('Error al cargar subcategorías o proveedores', err)
    });

    this.libroForm.get('cantidad')?.valueChanges.subscribe(() => this.actualizarTotalImporte());
    this.libroForm.get('precioVenta')?.valueChanges.subscribe(() => this.actualizarTotalImporte());
  }

  listarLibros(): void {
    this.libroService.getAllLibros().subscribe(libros => {
      this.libros = libros.map(libro => {
        const subcat = this.subcategorias.find(s => s.id === libro.idSubcategoria);
        const proveedor = this.proveedores.find(p => p.idProveedor === libro.idProveedor);

        return {
          ...libro,
          displayText: `${libro.isbn} - ${libro.titulo} - Cat: ${subcat?.descripcion ?? 'Sin subcategoría'} - Marca: ${proveedor?.razonSocial ?? 'Sin proveedor'}`
        };
      });
      this.librosFiltrados = this.libros;
    });
  }
  // Nuevo buscarLibro
  buscarLibro(consulta: string): Observable<LibroResponse[]> {
    if (!consulta.trim()) {
      return of(this.libros.slice(0, 10));
    }

    const resultadosFiltrados = this.libros.filter(libro =>
      libro.titulo.toLowerCase().includes(consulta.toLowerCase()) ||
      libro.isbn.toLowerCase().includes(consulta.toLowerCase())
    ).slice(0, 10);

    // Mapear subcategoría y proveedor
    const resultadosConDisplay = resultadosFiltrados.map(libro => {
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

    this.libroService.getUltimoPrecioByLibroId(idLibroSeleccionado).subscribe(precio => {
      if (precio) {
        this.libroForm.patchValue({ idLibro: idLibroSeleccionado, precioVenta: precio.precioVenta });
        this.actualizarTotalImporte();

        const libroSeleccionado = this.libros.find(l => l.idLibro === idLibroSeleccionado);
        if (libroSeleccionado) {
          this.libroForm.patchValue({ busqueda: `${libroSeleccionado.isbn} - ${libroSeleccionado.titulo}` });
        }

        setTimeout(() => this.cantidadInput?.nativeElement.focus(), 80);
      }
    }, error => Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo obtener el precio del libro' }));
  }

  actualizarTotalImporte(): void {
    const cantidad = this.libroForm.get('cantidad')?.value || 0;
    const precioVenta = this.libroForm.get('precioVenta')?.value || 0;
    const descuento = this.libroForm.get('descuento')?.value || 0;
    const totalImporte = (precioVenta * cantidad) - descuento;
    this.libroForm.patchValue({ importe: totalImporte });
  }

  agregarLibro(): void {
    if (!this.libroForm.valid) return;

    const formValue = this.libroForm.getRawValue();
    const libroSeleccionado = this.libros.find(libro => libro.idLibro === formValue.idLibro);
    if (!libroSeleccionado) return;

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

    Swal.fire({ toast: true, icon: 'success', title: 'Producto agregado correctamente para la venta', position: 'top-end', showConfirmButton: false, timer: 1500 });
    this.cerrar();
  }

  limpiarBusqueda(): void {
    this.libroForm.patchValue({ busqueda: '' });
  }

  mostrarOpcionesDeLibros(): void {
    this.mostrarOpciones = true;
    this.librosFiltrados = this.libros;
  }

  ocultarOpcionesTemporalmente(): void {
    setTimeout(() => this.mostrarOpciones = false, 200);
  }

  cerrar(): void {
    this.libroForm.reset({ cantidad: 1, precioVenta: '', importe: '', busqueda: '' });
    this.cerrarModal.emit();
  }
}
