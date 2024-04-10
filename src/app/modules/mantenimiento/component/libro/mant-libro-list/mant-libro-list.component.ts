import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AccionMantConst } from '../../../../../constans/general.constans'; // Reemplaza 'ruta/del/archivo' con la ruta correcta
import { LibroResponse } from '../../../../../models/libro-response.models';
import { LibroService } from '../../../service/libro.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DetalleVentaResponse } from '../../../../../models/detallle-venta-response.models';

@Component({
  selector: 'app-mant-libro-list',
  templateUrl: './mant-libro-list.component.html',
  styleUrls: ['./mant-libro-list.component.css']
})
export class MantLibroListComponent implements OnInit {
  filtroForm: FormGroup;
  filtroFormCategorias: FormGroup;
  librosFiltrados!: LibroResponse[];
  libros: LibroResponse[] = [];
  productosAgregados: DetalleVentaResponse[] = [];
  modalRef?: BsModalRef;
  libroSelected: LibroResponse = new LibroResponse();
  titleModal: string = "";
  accionModal: number = 0;
  // myFormFilter: FormGroup;

  constructor(
    private _route: Router,
    private _libroService: LibroService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
  ) {
    // Inicializa el formulario de filtro dentro del constructor
    this.filtroForm = this.formBuilder.group({
      estadoDescripcion: [false], // Campo para filtrar por estado
      idSubcategoria: [''] // Campo para filtrar por categoría
    },
    this.filtroFormCategorias = this.formBuilder.group({
      idSubcategoria: [6] // Campo para filtrar por categoría
    }));

    // Inicializa el formulario de filtro dentro del constructor
    this.filtroFormCategorias = this.fb.group({
      idLibro: [{ value: 0, disabled: true }, [Validators.required]],
      titulo: [null, []],
      isbn: [null, []],
      tamanno: [null, []],
      descripcion: [null, []],
      condicion: [null, []],
      impresion: [null, []],
      tipoTapa: [null, []],
      estado: [null, []],
      idSubcategoria: [null, []],
      idTipoPapel: [null, []],
      idProveedor: [null, []],
      estadoDescripcion: [null, []],
    });
  }

  ngOnInit(): void {
    this.listarLibros();
  }

  listarLibros() {
    this._libroService.getAll().subscribe({
      next: (data: LibroResponse[]) => {
        this.libros = data;
      },
      error: (err) => {
        console.log("error", err);
      },
      complete: () => {
        // Hacer algo
      },
    });
  }

  crearLibro(template: TemplateRef<any>) {
    this.libroSelected = new LibroResponse();
    this.titleModal = "NUEVO LIBRO"
    this.accionModal = AccionMantConst.crear;
    this.openModal(template);
  }

  editarLibro(template: TemplateRef<any>, libro: LibroResponse) {
    this.libroSelected = libro;
    this.titleModal = "EDIT LIBRO"
    this.accionModal = AccionMantConst.editar;
    this.openModal(template);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  getCloseModalEmmit(res: boolean) {
    this.modalRef?.hide();
    if (res) {
      this.listarLibros();
    }
  }

  eliminarRegistro(id: number) {
    let result = confirm("¿Está seguro de eliminar el registro?");
    if (result) {
      this._libroService.delete(id).subscribe({
        next: (data: number) => {
          alert("Registro eliminado de forma correcta");
        },
        error: () => { },
        complete: () => {
          this.listarLibros();
        }
      });
    }
  }

  filtrar() {
    const estadoDescripcion = this.filtroForm.value.estadoDescripcion;
  
    // Filtrar los libros según el estado seleccionado
    this.librosFiltrados = this.libros.filter(libro =>
      (!estadoDescripcion || libro.estadoDescripcion === estadoDescripcion)
    );
  }
  filtrarPorCategoria() {
    const idSubcategoriaSeleccionada = this.filtroFormCategorias.value.idSubcategoria;
  
    if (idSubcategoriaSeleccionada !== '') {
      // Llama a la función para listar los libros por categoría
      this.listarLibrosPorCategoria(idSubcategoriaSeleccionada);
    } else {
      // Si no se selecciona ninguna categoría, muestra todos los libros
      this.listarLibros();
    }
  }
  listarLibrosPorCategoria(idSubcategoria: string) {
    this._libroService.getAll().subscribe({
      next: (data: LibroResponse[]) => {
        // Filtrar los libros según la categoría especificada
        this.libros = data.filter(libro => libro.idSubcategoria.toString() === idSubcategoria);
      },
      error: (err) => {
        console.log("error", err);
      }
    });
  }
  buscarLibro(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const consulta = inputElement.value.trim();
  
    if (!consulta) {
      // Si la consulta está vacía, mostrar todos los libros
      this.listarLibros();
      return;
    }
    
    // Filtrar los libros según la consulta
    this.librosFiltrados = this.libros.filter(libro =>
      libro.titulo.toLowerCase().includes(consulta.toLowerCase())
      //AGREGAR isbn 
    );
  }
  
  
}