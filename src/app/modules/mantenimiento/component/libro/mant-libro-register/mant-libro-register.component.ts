import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { alert_success, alert_error } from '../../../../../../functions/general.functions';
import { AccionMantConst } from '../../../../../constans/general.constans';
import { LibroResponse } from '../../../../../models/libro-response.models';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { DetalleVentaResponse } from '../../../../../models/detallle-venta-response.models';
import { CategoriaResponse } from '../../../../../models/categoria-response.models';
import { CategoriaService } from '../../../service/categoria.service';
import { SubcategoriaService } from '../../../service/subcategoria.service';
import { SubcategoriaResponse } from '../../../../../models/subcategoria-response.models';
import { LibroService } from '../../../service/libro.service';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Autor, Libro, Libroconautor, Provedor, SubCategoria, TipoPapel } from '../../../../../models/libro-request.models';
import { SubCategoriaService } from '../../../service/sub-categoria.service';
import { TipoPapelService } from '../../../service/tipo-papel.service';
import { ProveedorService } from '../../../service/proveedor.service';
import { AutorService } from '../../../service/autor.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-mant-libro-register',
  templateUrl: './mant-libro-register.component.html',
  styleUrls: ['./mant-libro-register.component.css']
})
export class MantLibroRegisterComponent {
  showSuccessAlert: boolean = false;
  showErrorAlert: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  autores: Autor[] = [];
  autorSuggestions: Autor[] = [];
  libroSeleccionado: Autor | null = null;  // Autor seleccionado
  author: any = {};
  isAutorNotFound: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() libroGuardado = new EventEmitter<void>();
  autorNombre: string = '';
  imageUrl: string | ArrayBuffer | null = null;
  @Input() isEditMode: boolean = false;

  @Input() libro: Libro = {
    idLibro: 0,
    titulo: '',
    isbn: undefined,
    tamanno: '',
    descripcion: '',
    condicion: '',
    impresion: '',
    tipoTapa: '',
    estado: true,
    idSubcategoria: 0,
    idTipoPapel: 0,
    idProveedor: 0,
    imagen: '',
  };
  autorSeleccionado: Autor | null = null;  // Autor seleccionado (completo)
  @Input() precioVenta: number = 0;
  @Input() Stock: number = 0;
  tiposPapel: TipoPapel[] = [];
  subCategoria: SubCategoria[] = [];
  provedor: Provedor[] = [];
  autoresFiltrados: Autor[] = []; // Lista filtrada de autores
  buscarAutor: string = ''; // Campo de búsqueda
  imageFile: File | null = null;
  mostrarMensaje: boolean = false;
  mostrarModalCrearAutor: boolean = false;


  constructor(
    private libroService: LibroService,
    private subCategoriaService: SubCategoriaService,
    private tipoPapelService: TipoPapelService,
    private provedorService: ProveedorService,
    private autorService: AutorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadSubcategorias();
    this.loadTiposPapel();
    this.loadProveedores();
    this.loadAutores();
  }

  // Método para recibir el autor seleccionado desde el componente hijo
  recibirAutor(autor: Autor): void {
    this.autorSeleccionado = autor; // Recibe un 'Autor', no un 'Event'
    console.log('Autor recibido:', autor);
  }


  loadSubcategorias(): void {
    this.subCategoriaService.getList().subscribe(
      (data) => {
        this.subCategoria = data;
      },
      (error) => console.error('Error al cargar subcategorías:', error)
    );
  }

  loadTiposPapel(): void {
    this.tipoPapelService.getTipoPapel().subscribe(
      (data) => {
        this.tiposPapel = data;
      },
      (error) => console.error('Error al cargar tipos de papel:', error)
    );
  }

  loadProveedores(): void {
    this.provedorService.getProveedor().subscribe(
      (data) => {
        this.provedor = data;
      },
      (error) => console.error('Error al cargar proveedores:', error)
    );
  }


  loadAutores(): void {
    this.autorService.getAutores().subscribe(
      (data) => {
        this.autores = data; // Aquí asignamos la lista de autores a la variable
      },
      (error) => console.error('Error al cargar autores:', error)
    );
  }

  buscarAutores(): void {
    if (this.buscarAutor.trim().length > 0) {
      this.autorService.searchAutor(this.buscarAutor).subscribe(
        (data) => {
          this.autoresFiltrados = Array.isArray(data) ? data : [data];
          this.mostrarMensaje = this.autoresFiltrados.length === 0; // Mostrar mensaje si no hay resultados
        },
        (error) => {
          console.error('Error al buscar autores:', error);
          this.autoresFiltrados = [];
          this.mostrarMensaje = true;
        }
      );
    } else {
      this.mostrarMensaje = false; // No mostrar mensaje si no hay búsqueda
      this.autoresFiltrados = [];
    }
  }


  // Método para abrir el modal de creación
  abrirCrearAutorModal(): void {
    this.mostrarModalCrearAutor = true;
  }

  // Método para cerrar el modal
  cerrarCrearAutorModal(): void {
    this.mostrarModalCrearAutor = false;
  }
  recibirAutorCreado(autor: Autor): void {
    console.log('Autor recibido:', autor); // Verificar el autor recibido

    // Agregar el autor a la lista de autores
    this.autoresFiltrados = [autor]; // Sobreescribe la lista con el autor recién creado

    // Actualizar el campo de búsqueda con el nuevo autor
    this.buscarAutor = `${autor.nombre} ${autor.apellido}`;

    // Cerrar el modal
    this.cerrarCrearAutorModal();

    // Limpiar mensaje de "No se encontraron resultados"
    this.mostrarMensaje = false; // Asegúrate de tener esta variable en tu lógica
  }




  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      this.imageFile = file;  // Asignar el archivo a imageFile

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target?.result as string;  // Mostrar la imagen seleccionada
      };
      reader.readAsDataURL(file);
    }
  }


  // Función para eliminar la imagen y resetear el input
  removeImage() {
    this.imageUrl = null; // Eliminar la imagen
    const input = document.getElementById('imagen') as HTMLInputElement;
    if (input) {
      input.value = ''; // Restablecer el valor del input de archivo
    }
  }



  onSubmit(): void {
    const libroConAutorRequest: Libroconautor = {
      libro: {
        idLibro: this.libro.idLibro,
        titulo: this.libro.titulo,
        isbn: this.libro.isbn,
        tamanno: this.libro.tamanno,
        descripcion: this.libro.descripcion,
        condicion: this.libro.condicion,
        impresion: this.libro.impresion,
        tipoTapa: this.libro.tipoTapa,
        estado: this.libro.estado,
        idSubcategoria: Number(this.libro.idSubcategoria),
        idTipoPapel: Number(this.libro.idTipoPapel),
        idProveedor: Number(this.libro.idProveedor),
        imagen: '' // La URL de la imagen se establecerá en el backend
      },
      autor: this.autorSeleccionado || null // Permitir nulo
    };

    const formData = new FormData();

    // Llenar los datos del libro
    formData.append('request.libro.idLibro', libroConAutorRequest.libro.idLibro?.toString() || '');
    formData.append('request.libro.titulo', libroConAutorRequest.libro.titulo || '');
    formData.append('request.libro.isbn', libroConAutorRequest.libro.isbn?.toString() || '');
    formData.append('request.libro.tamanno', libroConAutorRequest.libro.tamanno || '');
    formData.append('request.libro.descripcion', libroConAutorRequest.libro.descripcion || '');
    formData.append('request.libro.condicion', libroConAutorRequest.libro.condicion || '');
    formData.append('request.libro.impresion', libroConAutorRequest.libro.impresion || '');
    formData.append('request.libro.tipoTapa', libroConAutorRequest.libro.tipoTapa || '');
    formData.append('request.libro.estado', libroConAutorRequest.libro.estado.toString());
    formData.append('request.libro.idSubcategoria', libroConAutorRequest.libro.idSubcategoria.toString());
    formData.append('request.libro.idTipoPapel', libroConAutorRequest.libro.idTipoPapel.toString());
    formData.append('request.libro.idProveedor', libroConAutorRequest.libro.idProveedor.toString());

    // Llenar los datos del autor solo si existe
    if (libroConAutorRequest.autor) {
      formData.append('request.autor.idAutor', libroConAutorRequest.autor.idAutor.toString());
      formData.append('request.autor.nombre', libroConAutorRequest.autor.nombre || '');
      formData.append('request.autor.apellido', libroConAutorRequest.autor.apellido || '');
      formData.append('request.autor.codigo', libroConAutorRequest.autor.codigo?.toString() || '');
      formData.append('request.autor.descripcion', libroConAutorRequest.autor.descripcion || '');
    } else {
      // Si no hay autor, asegura que no se envían datos inválidos
      formData.append('request.autor', null as any);
    }

    // Agregar imagen si existe
    if (this.imageFile) {
      formData.append('imageFile', this.imageFile, this.imageFile.name);
    }

    // Validar si es creación o actualización
    if (this.libro.idLibro === 0) {
      // Crear libro
      console.log('Contenido del FormData:');
      formData.forEach((valor, clave) => {
        console.log(`${clave}:`, valor);
      });
      this.libroService.createLibro(formData, this.precioVenta, this.Stock).subscribe(
        (response) => {
          alert('Libro creado correctamente');
          const tituloCreado = response?.libro?.titulo || 'el libro';
          Swal.fire({
            title: "Creado Correctamente",
            icon: "success",

          });
          this.onClose();
          this.libroGuardado.emit();
        },
        (error) => {
          console.error('Error al crear el libro:', error);
          Swal.fire({
            title: "No se pudo crear ",
            icon: "error",

          });
        }
      );
    } else {
      // Actualizar libro
      console.log('Contenido del FormData:');
      formData.forEach((valor, clave) => {
        console.log(`${clave}:`, valor);
      });
      this.libroService.updateLibro(formData, this.precioVenta, this.Stock).subscribe(
        (response) => {
          Swal.fire({
            title: "Actualizado Correctamente",
            icon: "success",

          });
          this.onClose();
          this.libroGuardado.emit();
        },
        (error) => {
          console.error('Error al actualizar el libro:', error);
          Swal.fire({
            title: "Error! al Actualizar",
            icon: "error",

          });
        }
      );
    }
  }




  // Método para cerrar el modal
  onClose() {
    // Restablecer alertas
    this.showSuccessAlert = false;
    this.showErrorAlert = false;
    this.successMessage = '';
    this.errorMessage = '';
    this.precioVenta = 0;
    this.Stock = 0;

    // Restablecer el libro a su estado inicial
    this.libro = {
      idLibro: 0,
      titulo: '',
      isbn: undefined,
      tamanno: '',
      descripcion: '',
      condicion: '',
      impresion: '',
      tipoTapa: '',
      estado: true,
      idSubcategoria: 0,
      idTipoPapel: 0,
      idProveedor: 0,
      imagen: '',
    };

    // Emitir evento de cierre
    this.close.emit();
  }
  abrirCrearNuevoAutor(): void {
    this.autorSeleccionado = null; // Limpiar selección
    this.isAutorNotFound = false; // Resetear estado
    // Lógica para mostrar un formulario/modal para la creación
    console.log('Abriendo formulario para crear autor...');
  }

  // Método para seleccionar un autor
  seleccionarAutor(autor: Autor): void {
    this.buscarAutor = `${autor.nombre} ${autor.apellido}`; // Actualiza el campo de búsqueda con el autor seleccionado
    this.autorSeleccionado = autor; // Guarda el autor seleccionado
    this.autoresFiltrados = []; // Limpia los resultados después de la selección
  }

  // Cerrar con tecla Escape
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    this.onClose();
  }

  // Cerrar al hacer click fuera
  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }


}
