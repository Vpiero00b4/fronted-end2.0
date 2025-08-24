import { Component, OnInit } from '@angular/core';
import { LibroResponse } from '../../../../../models/libro-response.models';
import { LibroService } from '../../../service/libro.service';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { PaginatedResponse } from '../../../../../models/PaginatedResponse';
import { of, forkJoin, throwError } from 'rxjs';
import { KardexService } from '../../../service/kardex.service';
import { KardexResponse } from '../../../../../models/kardex-response.models';
import { ProveedorResponse } from '../../../../../models/proveedor-response.models';
import { ProveedorService } from '../../../service/proveedor.service';
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
  libros: LibroInventario[] = [];
  proveedores: ProveedorResponse[] = [];
  idProveedorSeleccionado: number | null = null; // null = todos

  currentPage: number = 1;
  totalPages: number = 0;
  totalItems: number = 0;
  tiposPapel: { [key: number]: string } = {
    1: 'Papel ahuesado',
    2: 'Papel bond',
    3: 'Cartón',
    4: 'Papel couché',
    5: 'Papel periódico'
  };

  columnasDisponibles = [
    { key: 'titulo', label: 'Nombre del libro' },
    { key: 'precioVenta', label: 'S/. Precio de venta' },
    { key: 'porcUtilidad', label: '% Utilidad' },
    { key: 'isbn', label: 'ISBN' },
    { key: 'tamanno', label: 'Tamaño' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'condicion', label: 'Condición' },
    { key: 'impresion', label: 'Impresión' },
    { key: 'estado', label: 'Estado' },
    { key: 'idTipoPapel', label: 'Tipo Papel' },
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
      this.mostrarColumnas[c.key] = ['titulo', 'precioVenta', 'stock'].includes(c.key);
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
    .filtrarLibrosProveedor(this.idProveedorSeleccionado ?? undefined, page, pageSize)
    .pipe(
      switchMap(res => {
        this.totalItems = res.totalItems;
        this.totalPages = Math.ceil(res.totalItems / pageSize);
        this.currentPage = page;

        if (!res.libros || res.libros.length === 0) {
          return of([] as LibroInventario[]);
        }

        const detalles$ = res.libros.map(libro =>
          forkJoin({
            libro: of(libro),
            precio: this.libroService.getUltimoPrecioByLibroId(libro.idLibro).pipe(catchError(() => of(null))),
            kardex: this.libroService.getKardexByLibroId(libro.idLibro).pipe(catchError(() => of(null))),
            proveedor: this.proveedorService.getProveedorbyid(libro.idProveedor).pipe(catchError(() => of(null)))
          }).pipe(
            map(({ libro, precio, kardex, proveedor }) => ({
              ...libro,
              precioVenta: precio?.precioVenta ?? 0,
              porcUtilidad: precio?.porcUtilidad ?? 0,
              idPrecios: precio?.idPrecios ?? 0,
              stock: kardex?.stock ?? 0,
              nombreProveedor: proveedor?.razonSocial ?? 'Desconocido'   // 👈 ya tienes el dato listo para la tabla
            } as LibroInventario))
          )
        );

        return forkJoin(detalles$);
      })
    )
    .subscribe({
      next: librosDetallados => (this.libros = librosDetallados),
      error: err => console.error('Error cargando inventario', err),
    });
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

  toggleEditStock(libro: LibroInventario): void {
    libro.editandoStock = !libro.editandoStock;
    if (libro.editandoStock) {
      libro.stockTemporal = libro.stock;
    }
  }

  saveStock(libro: LibroInventario): void {
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
