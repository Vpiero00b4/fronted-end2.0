import { Component, OnInit } from '@angular/core';
import { LibroResponse } from '../../../../../models/libro-response.models';
import { LibroService } from '../../../service/libro.service';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { PaginatedResponse } from '../../../../../models/PaginatedResponse';
import { of, forkJoin, throwError, Observable } from 'rxjs';
import { KardexService } from '../../../service/kardex.service';
import { KardexResponse } from '../../../../../models/kardex-response.models';
import { ProveedorResponse } from '../../../../../models/proveedor-response.models';
import { ProveedorService } from '../../../service/proveedor.service';
import { LibroInventarioDto, SubCategoria } from '../../../../../models/libro-request.models';
// 🔹 Tipo extendido para los libros en inventario
export type LibroInventario = LibroResponse & {
  precioVenta: number;
  porcUtilidad: number;
  idPrecios: number;
  stock: number;
  editandoStock?: boolean;
  stockTemporal?: number;
};

@Component({
  selector: 'app-mant-reporte-inventario',
  templateUrl: './mant-reporte-inventario.component.html',
  styleUrls: ['./mant-reporte-inventario.component.css']
})
export class MantReporteInventarioComponent implements OnInit {
  libros: LibroInventarioDto[] = [];
  proveedores: ProveedorResponse[] = [];
  idProveedorSeleccionado: number | null = null; // null = todos
  tituloBuscado: string = '';
  currentPage: number = 1;
  totalPages: number = 0;
  totalItems: number = 0;
  estadoSeleccionado?: boolean;
  categoriaSeleccionada: number = 0;
  subcategoriaSeleccionada: SubCategoria = { id: 0, descripcion: '', idCategoria: 0 };
  pageSize = 10;
  hasMoreData = true;
  private get filtrosActivos(): boolean {
    return !!this.tituloBuscado || this.estadoSeleccionado !== undefined || this.categoriaSeleccionada > 0 || (this.subcategoriaSeleccionada?.id > 0);
  }


  columnasDisponibles = [
    { key: 'titulo', label: 'Nombre del libro' },
    { key: 'precio', label: 'S/. Precio de venta' },
    { key: 'porcUtilidad', label: '% Utilidad' },
    { key: 'isbn', label: 'ISBN' },
    { key: 'tamanno', label: 'Tamaño' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'condicion', label: 'Condición' },
    { key: 'impresion', label: 'Impresión' },
    { key: 'estado', label: 'Estado' },
    { key: 'tipoPapel', label: 'Tipo Papel' },
    { key: 'nombreProveedor', label: 'Proveedor' },
    { key: 'stock', label: 'Stock' }
  ];
  proveedoresCache: { [key: number]: string } = {};
  mostrarColumnas: { [key: string]: boolean } = {};

  constructor(
    private libroService: LibroService,
    private kardexService: KardexService,
    private proveedorService: ProveedorService
  ) { }

  ngOnInit(): void {
    this.cargarProveedores();
    this.cargarInventario(this.currentPage, 10);

    // Definir columnas iniciales visibles
    this.columnasDisponibles.forEach(c => {
      this.mostrarColumnas[c.key] = ['titulo', 'precio', 'stock'].includes(c.key);
    });
  }


  cargarProveedores() {
    this.proveedorService.getAll().subscribe({
      next: (res) => {
        this.proveedores = res;
      },
      error: (err) => console.error(err)
    });
  }

  cargarInventario(page: number, pageSize: number): void {
    this.libroService
      .filtrarLibrosProveedor(this.idProveedorSeleccionado ?? undefined, this.tituloBuscado, page, pageSize)
      .subscribe({
        next: res => {
          this.libros = res.libros;
          this.totalItems = res.totalItems;
          this.totalPages = Math.ceil(this.totalItems / pageSize);
          this.currentPage = page;
          this.hasMoreData = this.currentPage < this.totalPages;
        },
        error: err => console.error('Error cargando inventario', err)
      });
  }

  buscar(): void {
    this.currentPage = 1; // Reinicia a la primera página
    this.cargarInventario(this.currentPage, this.pageSize);
  }



  updateKardex(idLibro: number, newStock: number): void {
    this.libroService.getKardexByLibroId(idLibro).subscribe({
      next: kardex => {
        if (kardex && kardex.idSucursal) {
          const kardexToUpdate = { ...kardex, stock: newStock };
          this.kardexService.actuizarka(kardexToUpdate).subscribe({
            next: res => console.log('Kardex actualizado', res),
            error: err => console.error('Error actualizando kardex', err)
          });
        } else {
          console.error('Kardex no encontrado para libro', idLibro);
        }
      },
      error: err => console.error('Error recuperando kardex', err)
    });
  }

  toggleEditStock(libro: LibroInventarioDto): void {
    libro.editandoStock = !libro.editandoStock;
    if (libro.editandoStock) {
      libro.stockTemporal = libro.stock;
    }
  }

  saveStock(libro: LibroInventarioDto): void {
    if (libro.stockTemporal != null) {
      this.updateKardex(libro.idLibro, libro.stockTemporal);
      libro.stock = libro.stockTemporal;
    }
    libro.editandoStock = false;
  }

  onPageChange(newPage: number): void {
    this.cargarInventario(newPage, 10);
  }
}
