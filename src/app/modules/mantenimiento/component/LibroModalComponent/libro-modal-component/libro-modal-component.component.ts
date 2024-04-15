import { Component, EventEmitter, OnInit, Output ,Pipe, PipeTransform } from '@angular/core';
//import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LibroResponse } from '../../../../../models/libro-response.models';
import { LibroService } from '../../../service/libro.service';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { DetalleVentaResponse } from '../../../../../models/detallle-venta-response.models';
import { SharedService } from '../../../service/sharedservice';
//import { SharedModule } from '../../../../shared/shared.module';
// @NgModule({
//   declarations: [LibroModalComponentComponent],
//   imports: [SharedModule],
// })
@Component({
  selector: 'app-libro-modal-component',
  templateUrl: './libro-modal-component.component.html',
  styleUrls: ['./libro-modal-component.component.css']
})
export class LibroModalComponentComponent implements OnInit {
  
  @Output() cerrarModal = new EventEmitter<void>();
  @Output() libroAgregado = new EventEmitter<DetalleVentaResponse>();

  mostrarOpciones: boolean = false;
  libroForm: FormGroup;
  libros: LibroResponse[] = [];
  librosFiltrados: LibroResponse[] = [];
  autocompleteControl = new FormControl();

  ocultarOpcionesTemporalmente() {
    setTimeout(() => this.mostrarOpciones = false, 200); // Ajustar el tiempo según sea necesario
  }

  constructor(private fb: FormBuilder, private libroService: LibroService, private sharedService: SharedService){
      this.libroForm = this.fb.group({
      idLibro: [null, Validators.required],
      busqueda: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]], // Valor inicial establecido en 1
      precioVenta: [{value: '', disabled: true}, Validators.required],
      importe: [{value: '', disabled: true}]
    });
  }

  ngOnInit(): void {
    this.listarLibros();
  
    // Suscribe a los cambios de 'cantidad' y actualiza el importe total.
    this.libroForm.get('cantidad')?.valueChanges.subscribe(() => {
      this.actualizarTotalImporte();
    });
  
    // Suscribe a los cambios de 'precioVenta' y actualiza el importe total.
    this.libroForm.get('precioVenta')?.valueChanges.subscribe(() => {
      this.actualizarTotalImporte();
    });
  
    // Gestiona la lógica de autocompletado y filtrado de libros con debouncing y distinción de cambios.
    this.libroForm.get('busqueda')?.valueChanges.pipe(
      debounceTime(300), // Espera 300 ms después de la última pulsación de tecla para emitir el último valor.
      distinctUntilChanged(), // Solo emite si el valor actual es diferente al último.
      switchMap(value => this.buscarLibro(value)) // Filtra los libros en base a la entrada del usuario.
    ).subscribe(libros => {
      this.librosFiltrados = libros.map(libro => ({
        ...libro,
        displayText: `${libro.isbn} - ${libro.titulo} - Cat: ${libro.idSubcategoria} - Marca: ${libro.idProveedor}`
      }));
    });
  
  }
  

  cerrar(): void {
    this.cerrarModal.emit();
  }
  
  listarLibros(): void {
    this.libroService.getAllLibros().subscribe(libros => {
      this.libros = libros.map(libro => ({
        ...libro,
        displayText: `${libro.isbn} - ${libro.titulo} Cat: ${libro.idSubcategoria} - Marca: ${libro.idProveedor}` // Formato "ISBN - Título"
      }));
      this.librosFiltrados = this.libros; // Inicialmente mostrar todos los libros
    });
  }

  buscarLibro(consulta: string): Observable<LibroResponse[]> {
    if (!consulta.trim()) {
      // Si la consulta está vacía, devuelve una lista predeterminada (por ejemplo, los primeros 10 libros)
      return of(this.libros.slice(0, 10));
    } else {
      // Filtra los libros cuyo título o ISBN contengan la consulta, sin importar mayúsculas o minúsculas
      const resultadosFiltrados = this.libros.filter(libro =>
        libro.titulo.toLowerCase().includes(consulta.toLowerCase()) ||
        libro.isbn.toLowerCase().includes(consulta.toLowerCase())
        
      ).slice(0, 10); // Limita los resultados a los primeros 10 para mejorar la performance y la usabilidad
      // console.log("Consulta:", consulta.toLowerCase());
      // this.libros.forEach(libro => console.log("Título:", libro.titulo.toLowerCase()));
      
      return of(resultadosFiltrados);
    }
  }

  seleccionarLibro(idLibroSeleccionado: number): void {
    if (idLibroSeleccionado) {
      this.libroService.getUltimoPrecioByLibroId(idLibroSeleccionado).subscribe(precio => {
        // Si 'precio' es null o undefined, el operador '&&' cortocircuitará y no se ejecutará el código siguiente
        if (precio) {
          this.libroForm.patchValue({
            idLibro: idLibroSeleccionado,
            precioVenta: precio.precioVenta,
            // Si tu formulario también maneja el porcentaje de utilidad y otros detalles, puedes agregarlos aquí
            porcUtilidad: precio.porcUtilidad,
          });
          this.actualizarTotalImporte();
  
          // Aquí asumimos que ya has cargado los libros en una variable de clase `libros`
          const libroSeleccionado = this.libros.find(libro => libro.idLibro === idLibroSeleccionado);
          if (libroSeleccionado) {
            const valorBusqueda = `${libroSeleccionado.isbn} - ${libroSeleccionado.titulo}`;
            this.libroForm.patchValue({
              busqueda: valorBusqueda,
            });
          }
        }
      }, error => {
        console.error('Error al obtener el precio del libro:', error);
      });
    } else {
      console.error('No se proporcionó ID de libro válido.');
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
    console.log("Intentando agregar libro", this.libroForm.valid);
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
          descripcion: libroSeleccionado.descripcion, // Asegúrate de que esta propiedad exista en LibroResponse
          idProveedor: libroSeleccionado.idProveedor, // Asegúrate de que esta propiedad exista en LibroResponse
          cantidad: formValue.cantidad,
          importe: formValue.importe,
          imagen: formValue.imagen,
        };
  
        // Emite el evento con el nuevo producto agregado para que el componente padre lo maneje
        this.libroAgregado.emit(detalleVenta);
  
        // Mensaje de confirmación
        alert('Producto agregado correctamente para la venta.');
  
        // Cierra el modal
        this.cerrar();
      } else {
        console.log("Libro no encontrado en la lista", formValue.idLibro);
      }
    } else {
      console.log("Formulario inválido", this.libroForm.value);
    }
  }
  
  
  limpiarBusqueda(): void {
    this.libroForm.patchValue({ busqueda: '' });
    // No ocultar las opciones aquí, ya que esto interfiere con la visualización de la ruedita
  }
  mostrarOpcionesDeLibros(): void {
    // Suponiendo que tienes una variable booleana que controla la visibilidad de las opciones
    this.mostrarOpciones = true;
  
    // Además, si estás filtrando los libros basado en la entrada actual, querrás asegurarte
    // de que la lista completa de opciones esté disponible cuando el campo obtiene el foco:
    this.librosFiltrados = this.libros; // o alguna lógica para establecer los libros filtrados
  }
  
}