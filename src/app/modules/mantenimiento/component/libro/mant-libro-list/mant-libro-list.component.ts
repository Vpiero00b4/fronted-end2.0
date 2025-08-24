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
  categorias: Categoria[] = [];
  subcategorias: SubCategoria[] = [];

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
  hasMoreData = true;

  tituloBuscado: string = '';
  estadoSeleccionado?: boolean;
  categoriaSeleccionada: number = 0;
  subcategoriaSeleccionada: SubCategoria = { id: 0, descripcion: '', idCategoria: 0 };

  isModalOpen = false;
  isEditMode = false;
  libroSeleccionado: Libro | null = null;

  precioVenta = 0;
  Stock = 0;

  constructor(
    private libroService: LibroService,
    private categoriaService: CategoriaService,
    private subcategoriaService: SubcategoriaService
  ) {}

  ngOnInit() {
    this.cargarCategorias();
    this.getLibrosPaginados(this.currentPage);
  }

  // ==================== CARGA DE CATEGORIAS Y SUBCATEGORIAS ====================
  cargarCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: data => this.categorias = data,
      error: err => console.error('Error al cargar categorías', err)
    });
  }

  cargarSubcategorias(idCategoria: number): void {
    if (!idCategoria || idCategoria === 0) {
      this.subcategorias = [];
      return;
    }
    this.categoriaService.getCategoriaSub(idCategoria).subscribe({
      next: data => this.subcategorias = data,
      error: err => console.error('Error al cargar subcategorías', err)
    });
  }

  // ==================== MÉTODOS DE MODAL ====================
  openCreateModal(): void {
    this.isEditMode = false;
    this.libroSeleccionado = null;
    this.isModalOpen = true;
    document.body.classList.add('overflow-hidden');
  }

  openEditModal(libro: Libro): void {
    this.isEditMode = true;
    this.libroSeleccionado = libro;
    forkJoin({
      precio: this.libroService.getUltimoPrecioByLibroId(libro.idLibro),
      kardex: this.libroService.getStockById(libro.idLibro),
    }).subscribe({
      next: response => {
        this.precioVenta = response.precio?.precioVenta ?? 0;
        this.Stock = response.kardex?.stock ?? 0;
      },
      error: err => console.error('Error al obtener datos:', err)
    });
    this.isModalOpen = true;
    document.body.classList.add('overflow-hidden');
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.Stock = 0;
    this.precioVenta = 0;
    document.body.classList.remove('overflow-hidden');
  }

  handleLibroGuardado(): void {
    this.buscar(); // Refresca la lista manteniendo filtros y página
    this.closeModal();
  }

  // ==================== SUBIDA DE EXCEL ====================
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      Swal.fire({
        title: 'Cargando Excel...',
        text: 'Por favor espera mientras se procesan los libros',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(Swal.getConfirmButton())
      });
      this.libroService.cargarExcelLibros(file).subscribe({
        next: () => {
          Swal.close();
          Swal.fire('¡Éxito!', 'Excel cargado correctamente ✅', 'success');
          this.buscar(); // Refresca libros con filtros actuales
        },
        error: err => {
          Swal.close();
          Swal.fire('Error', 'No se pudo cargar el Excel ❌', 'error');
          console.error('Error al subir archivo', err);
        }
      });
    }
  }

  // ==================== MÉTODOS DE FILTRO ====================
  private get filtrosActivos(): boolean {
    return !!this.tituloBuscado || this.estadoSeleccionado !== undefined || this.categoriaSeleccionada > 0 || (this.subcategoriaSeleccionada?.id > 0);
  }

  buscar(): void {
    this.currentPage = 1; // Si el usuario ejecuta búsqueda, reinicia página
    this.filtrarLibros();
  }

  filtrarLibros(): void {
    if (this.filtrosActivos) {
      this.libroService.filtrarLibros(
        this.estadoSeleccionado,
        this.tituloBuscado,
        this.categoriaSeleccionada,
        this.subcategoriaSeleccionada?.id,
        this.currentPage,
        this.pageSize
      ).subscribe({
        next: response => {
          this.libros = response.libros;
          this.totalItems = response.totalItems;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          this.hasMoreData = this.currentPage < this.totalPages;
        },
        error: err => console.error('Error al obtener libros filtrados:', err)
      });
    } else {
      this.getLibrosPaginados(this.currentPage);
    }
  }

  mostrarTodos(): void {
    this.tituloBuscado = '';
    this.estadoSeleccionado = undefined;
    this.categoriaSeleccionada = 0;
    this.subcategoriaSeleccionada = { id: 0, descripcion: '', idCategoria: 0 };
    this.currentPage = 1;
    this.getLibrosPaginados(this.currentPage);
  }

  // ==================== PAGINACIÓN ====================
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filtrarLibros(); // Mantiene filtros activos
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.filtrarLibros(); // Mantiene filtros activos
    }
  }

  // ==================== OBTENER LIBROS ====================
  getLibrosPaginados(page: number): void {
    this.libroService.getPaginatedLibros(page, this.pageSize).subscribe({
      next: data => {
        this.libros = data;
        this.totalItems = data.length; // si tu API devuelve total, usa eso
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.hasMoreData = this.currentPage < this.totalPages;
      },
      error: err => console.error('Error al obtener libros:', err)
    });
  }

  deleteLibro(id: number): void {
    this.libroService.updateestado(id).subscribe({
      next: () => {
        Swal.fire('¡Inactivo!', 'El libro cambió a inactivo', 'success');
        this.filtrarLibros();
      },
      error: err => Swal.fire('Error', 'No se pudo cambiar el estado del libro', 'error')
    });
  }
}