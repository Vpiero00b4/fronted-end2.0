import { Component, OnInit } from '@angular/core';
import { LibroResponse } from '../../../../../models/libro-response.models';
import { LibroService } from '../../../service/libro.service';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { PaginatedResponse } from '../../../../../models/PaginatedResponse';
import { of, forkJoin, throwError } from 'rxjs';
import { KardexService } from '../../../service/kardex.service';
import { KardexResponse } from '../../../../../models/kardex-response.models';

@Component({
  selector: 'app-mant-reporte-inventario',
  templateUrl: './mant-reporte-inventario.component.html',
  styleUrls: ['./mant-reporte-inventario.component.css']
})
export class MantReporteInventarioComponent implements OnInit {
  libros: (LibroResponse & { precioVenta: number, porcUtilidad: number, idPrecios: number, stock: number })[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  totalItems: number = 0;
  stock:number=0;
  columnasDisponibles = [
  { key: 'idLibro', label: 'ID Libro' },
  { key: 'titulo', label: 'Nombre del libro' },
  { key: 'precioVenta', label: 'Precio de venta' },
  { key: 'porcUtilidad', label: '% Utilidad' },
  { key: 'idPrecios', label: 'ID Precios' },
  { key: 'isbn', label: 'ISBN' },
  { key: 'tamanno', label: 'Tamaño' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'condicion', label: 'Condición' },
  { key: 'impresion', label: 'Impresión' },
  { key: 'estado', label: 'Estado' },
  { key: 'idTipoPapel', label: 'ID Tipo de Papel' },
  { key: 'idProveedor', label: 'ID Proveedor' },
  { key: 'stock', label: 'Stock' }
  
];
mostrarColumnas: { [key: string]: boolean } = {};


  constructor(private libroService: LibroService,
    private _kardexService:KardexService
    ) {}

  ngOnInit(): void {
    this.loadInventoryData(this.currentPage, 10);
    this.columnasDisponibles.forEach(c => {
    this.mostrarColumnas[c.key] = ['idLibro', 'titulo', 'precioVenta', 'stock'].includes(c.key);
  });
  }

  loadInventoryData(pageIndex: number, pageSize: number): void {
    this.libroService.getAllPaginated(pageIndex, pageSize).pipe(
      switchMap(response => {
        if (response.libros && response.libros.length > 0) {
          this.totalPages = response.totalPages;
          this.currentPage = response.currentPage;
          this.totalItems = response.totalItems;
  
          const detailsObservables = response.libros.map(libro => 
            forkJoin({
              libro: of(libro),
              precio: this.libroService.getUltimoPrecioByLibroId(libro.idLibro).pipe(catchError(() => of(null))),
              kardex: this.libroService.getKardexByLibroId(libro.idLibro).pipe(catchError(() => of(null)) )
            }).pipe(
              map(({ libro, precio, kardex }) => ({
                ...libro,
                precioVenta: precio?.precioVenta ?? 0,
                porcUtilidad: precio?.porcUtilidad ?? 0,
                idPrecios: precio?.idPrecios ?? 0,
                stock: kardex ? kardex.stock : 0 // Directamente accediendo a la propiedad stock del objeto KardexResponse
              }))
            )
          );
  
          return forkJoin(detailsObservables);
        } else {
          return of([]);
        }
      })
    ).subscribe({
      next: librosConDetalles => {
        this.libros = librosConDetalles;
      },
      error: e => console.error(e)
    });
  }
  


  updateKardex(idLibro: number, newStock: number): void {
    this.libroService.getKardexByLibroId(idLibro).subscribe({
      next: (kardex) => {
        // Asegúrate de que el kardex exista y tenga un idSucursal válido.
        if (kardex && kardex.idSucursal) {
          const kardexToUpdate = {
            ...kardex, // Extiende todas las propiedades existentes
            stock: newStock // Actualiza solo el stock
          };
  
          // Ahora llama a la API para actualizar
          this._kardexService.actuizarka(kardexToUpdate).subscribe({
            next: (response) => {
              console.log('Kardex actualizado con éxito', response);
              // Aquí podrías también actualizar la vista con el nuevo stock,
              // o recargar la parte de la vista que muestra el kardex.
            },
            error: (error) => {
              console.error('Error al actualizar el kardex', error);
            }
          });
        } else {
          console.error('Kardex no encontrado para el libro con ID:', idLibro);
        }
      },
      error: (error) => {
        console.error('Error al recuperar el kardex para el libro con ID:', idLibro, error);
      }
    });
  }
  
  toggleEditStock(libro: LibroResponse): void {
    libro.editandoStock = !libro.editandoStock;
    // Si empezamos a editar, inicializamos stockTemporal con el stock actual
    if (libro.editandoStock) {
      libro.stockTemporal = libro.stock;
    }
  }

  saveStock(libro: LibroResponse): void {
    if (libro.stockTemporal != null) {
      this.updateKardex(libro.idLibro, libro.stockTemporal);
      libro.stock = libro.stockTemporal; // Opcional, si quieres actualizar la vista inmediatamente
    }
    libro.editandoStock = false; // Dejamos de editar
  }
  
  
  onPageChange(newPageIndex: number): void {
    this.currentPage = newPageIndex;
    this.loadInventoryData(newPageIndex, 10);
  }


}
