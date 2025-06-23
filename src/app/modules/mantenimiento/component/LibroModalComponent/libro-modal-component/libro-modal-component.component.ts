import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LibroResponse } from '../../../../../models/libro-response.models';
import { LibroService } from '../../../service/libro.service';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { DetalleVentaResponse } from '../../../../../models/detallle-venta-response.models';
import { SharedService } from '../../../service/sharedservice';
import Swal from 'sweetalert2';

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

  ocultarOpcionesTemporalmente() {
    setTimeout(() => this.mostrarOpciones = false, 200);
  }

  constructor(private fb: FormBuilder, private libroService: LibroService, private sharedService: SharedService) {
    this.libroForm = this.fb.group({
      idLibro: [null, Validators.required],
      busqueda: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioVenta: [{ value: '', disabled: true }, Validators.required],
      importe: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    this.listarLibros();
    this.libroForm.get('cantidad')?.valueChanges.subscribe(() => {
      this.actualizarTotalImporte();
    });
    this.libroForm.get('precioVenta')?.valueChanges.subscribe(() => {
      this.actualizarTotalImporte();
    });
    this.libroForm.get('busqueda')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.buscarLibro(value))
    ).subscribe(libros => {
      this.librosFiltrados = libros.map(libro => ({
        ...libro,
        displayText: `${libro.isbn} - ${libro.titulo} - Cat: ${libro.idSubcategoria} - Marca: ${libro.idProveedor}`
      }));
    });
  }

  cerrar(): void {
    this.libroForm.reset({ cantidad: 1, precioVenta: '', importe: '', busqueda: '' });
    this.cerrarModal.emit();
  }

  listarLibros(): void {
    this.libroService.getAllLibros().subscribe(libros => {
      this.libros = libros.map(libro => ({
        ...libro,
        displayText: `${libro.isbn} - ${libro.titulo} Cat: ${libro.idSubcategoria} - Marca: ${libro.idProveedor}`
      }));
      this.librosFiltrados = this.libros;
    });
  }

  buscarLibro(consulta: string): Observable<LibroResponse[]> {
    if (!consulta.trim()) {
      return of(this.libros.slice(0, 10));
    } else {
      const resultadosFiltrados = this.libros.filter(libro =>
        libro.titulo.toLowerCase().includes(consulta.toLowerCase()) ||
        libro.isbn.toLowerCase().includes(consulta.toLowerCase())
      ).slice(0, 10);
      return of(resultadosFiltrados);
    }
  }

  seleccionarLibro(idLibroSeleccionado: number): void {
    if (idLibroSeleccionado) {
      this.libroService.getUltimoPrecioByLibroId(idLibroSeleccionado).subscribe(precio => {
        if (precio) {
          this.libroForm.patchValue({
            idLibro: idLibroSeleccionado,
            precioVenta: precio.precioVenta,
            porcUtilidad: precio.porcUtilidad,
          });
          this.actualizarTotalImporte();
          const libroSeleccionado = this.libros.find(libro => libro.idLibro === idLibroSeleccionado);
          if (libroSeleccionado) {
            const valorBusqueda = `${libroSeleccionado.isbn} - ${libroSeleccionado.titulo}`;
            this.libroForm.patchValue({
              busqueda: valorBusqueda,
            });
          }
          setTimeout(() => {
            if (this.cantidadInput) {
              this.cantidadInput.nativeElement.focus();
            }
          }, 80);
        }
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo obtener el precio del libro'
        });
      });
    }
  }

  actualizarTotalImporte(): void {
    const cantidad = this.libroForm.get('cantidad')?.value || 0;
    const precioVenta = this.libroForm.get('precioVenta')?.value || 0;
    const totalImporte = cantidad * precioVenta;
    this.libroForm.patchValue({
      importe: totalImporte
    });
  }

  agregarLibro(): void {
    if (this.libroForm.valid) {
      const formValue = this.libroForm.getRawValue();
      const libroSeleccionado = this.libros.find(libro => libro.idLibro === formValue.idLibro);
      if (libroSeleccionado) {
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
          imagen: formValue.imagen,
        };
        this.libroAgregado.emit(detalleVenta);

        // Toast de éxito con SweetAlert2
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
    }
  }

  limpiarBusqueda(): void {
    this.libroForm.patchValue({ busqueda: '' });
  }

  mostrarOpcionesDeLibros(): void {
    this.mostrarOpciones = true;
    this.librosFiltrados = this.libros;
  }
}
