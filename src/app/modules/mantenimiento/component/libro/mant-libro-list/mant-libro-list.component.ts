import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AccionMantConst } from '../../../../../constans/general.constans'; // Reemplaza 'ruta/del/archivo' con la ruta correcta
import { LibroResponse } from '../../../../../models/libro-response.models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DetalleVentaResponse } from '../../../../../models/detallle-venta-response.models';
import { CategoriaResponse } from '../../../../../models/categoria-response.models';
import { CategoriaService } from '../../../service/categoria.service';
import { SubcategoriaService } from '../../../service/subcategoria.service';
import { SubcategoriaResponse } from '../../../../../models/subcategoria-response.models';
import { LibroService } from '../../../service/libro.service';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Autor, Categoria, Libro, Precio, SubCategoria } from '../../../../../models/libro-request.models';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-mant-libro-list',
  templateUrl: './mant-libro-list.component.html',
  styleUrls: ['./mant-libro-list.component.css']
})
export class MantLibroListComponent {
  libros: Libro[] = [];
  subCategorias: SubCategoria[] = [];
  subCategoriasPaginas: SubCategoria[] = [];
  totalSubCategorias: number = 0;
  categoriasMap: Map<number, string> = new Map();
  currentPage = 1;
  pageSize = 10;
  currentPageSubCategorias = 1;
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  libroSeleccionado: Libro | null = null;
  precio: Precio[] = [];  // Inicializa el precio
  Stock: number = 0;
  precioVenta: number = 0;
  categorias: Categoria[] = [];
  subcategoria: SubCategoria = { id: 0, descripcion: '', idCategoria: 0 };
  subcategoriaSeleccionada: SubCategoria = { id: 0, descripcion: '', idCategoria: 0 };
  categoria: Categoria = { idCategoria: 0, categoria1: '' }; // Nueva categoría
  isEditSubcategoriaMode = false;
  isCategoriaModalOpen = false;
  isSubcategoriaModalOpen: boolean = false;
  estadoSeleccionado?: boolean;
  tituloBuscado: string = '';
  totalItems: number = 0; // Total de libros obtenidos de la API
  totalPages: number = 0; // Número total de páginas
  hasMoreData: boolean = true; // Indica si hay más datos para mostrar

  constructor(
    private libroService: LibroService,) { }
  ngOnInit() {
    this.getLibrosPaginados(this.currentPage);
  }
  openEditModal(libro: Libro): void {
    this.isEditMode = true; // Modo edición
    this.libroSeleccionado = libro;
    forkJoin({

      precio: this.libroService.getUltimoPrecioByLibroId(libro.idLibro),
      kardex: this.libroService.getStockById(libro.idLibro),
    }).subscribe({
      next: (response) => {
        if (response.precio && typeof response.precio === 'object') {
          this.precioVenta = response.precio.precioVenta;
        } else {
          console.warn('El precio no se recibió como un objeto esperado');
        }
        this.Stock = response.kardex.stock;
      },
      error: (err) => {
        console.error('Error al obtener datos:', err);
      },
    });
    this.isModalOpen = true;
    document.body.classList.add('overflow-hidden');
  }

  // getLibros() {
  //   this.libroService.get().subscribe(
  //     (data: Libro[]) => {
  //       this.libros = data;
  //       console.log(data);
  //     },
  //     (error) => {
  //       console.error('Error al obtener libros:', error);
  //     }
  //   );
  // }

  getLibrosPaginados(page: number) {
    this.libroService.getPaginatedLibros(page, this.pageSize).subscribe(
      (data: Libro[]) => {
        this.libros = data;
        this.hasMoreData = this.libros.length === this.pageSize;
      },
      (error) => {
        console.error('Error al obtener libros:', error);
      }
    );
  }
  filtrarLibros(): void {
    this.libroService.filtrarLibros(this.estadoSeleccionado, this.tituloBuscado, this.currentPage, this.pageSize)
      .subscribe(
        (response) => {
          this.libros = response.libros;
          this.totalItems = response.totalItems;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize); // Calcula el total de páginas
          this.hasMoreData = this.libros.length === this.pageSize; // Si la cantidad recibida es menor, no hay más datos
        },
        (error) => {
          console.error('Error al obtener libros filtrados:', error);
        }
      );
  }
  deleteLibro(id: number) {
    this.libroService.updateestado(id).subscribe({
      next: () => {
        Swal.fire(
          '¡Inactivo!',
          'El libro cambió a inactivo',
          'success'
        );
        this.getLibrosPaginados(this.currentPage); // Recarga los datos de la tabla
      },
      error: (error) => {
        console.error("Error al cambiar estado:", error);
        Swal.fire(
          'Error',
          'No se pudo cambiar el estado del libro',
          'error'
        );
      }
    });
  }
  // Método para abrir el modal
  openCreateModal(): void {
    this.isEditMode = false;
    this.isModalOpen = true;
    this.libroSeleccionado = null;
    document.body.classList.add('overflow-hidden');
  }

  mostrarTodos(): void {
    this.tituloBuscado = '';
    this.estadoSeleccionado = undefined;
    this.currentPage = 1; // Reiniciar paginación
    this.getLibrosPaginados(this.currentPage); // Cargar todos los libros sin filtro
  }
  buscar(): void {
    this.currentPage = 1; // Reiniciar a la primera página al buscar
    this.filtrarLibros(); // Llamar al filtro con título y estado
  }

  // Método para cerrar el modal
  closeModal(): void {
    this.isModalOpen = false;
    this.Stock = 0;
    this.precioVenta = 0
    document.body.classList.remove('overflow-hidden');
  }
  handleLibroGuardado(): void {
    this.getLibrosPaginados(this.currentPage); // Refrescar lista de libros
    this.closeModal(); // Cerrar el modal
    console.log('Libro guardado, actualizando lista...');
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      if (this.tituloBuscado || this.estadoSeleccionado !== undefined) {
        this.filtrarLibros(); // Si hay filtro, usa la búsqueda filtrada
      } else {
        this.getLibrosPaginados(this.currentPage); // Si no hay filtro, usa la lista paginada normal
      }
    }
  }

  nextPage() {
    if (this.hasMoreData) { // Verifica si hay más datos antes de avanzar
      this.currentPage++;
      if (this.tituloBuscado || this.estadoSeleccionado !== undefined) {
        this.filtrarLibros(); // Si hay filtro, usa la búsqueda filtrada
      } else {
        this.getLibrosPaginados(this.currentPage); // Si no hay filtro, usa la lista paginada normal
      }
    }
  }
}