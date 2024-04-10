import { Component, OnInit } from '@angular/core';
import { LibroResponse } from '../../../../../models/libro-response.models';
import { LibroService } from '../../../service/libro.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { PaginatedResponse } from '../../../../../models/PaginatedResponse';
import { of, forkJoin } from 'rxjs';

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

  constructor(private libroService: LibroService) {}

  ngOnInit(): void {
    this.loadInventoryData(this.currentPage, 10);
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
              stock: this.libroService.getStockByLibroId(libro.idLibro).pipe(catchError(() => of(0)))
            }).pipe(
              map(({ libro, precio, stock }) => ({
                ...libro,
                precioVenta: precio?.precioVenta ?? 0,
                porcUtilidad: precio?.porcUtilidad ?? 0,
                idPrecios: precio?.idPrecios ?? 0,
                stock: stock
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
  
  onPageChange(newPageIndex: number): void {
    this.currentPage = newPageIndex;
    this.loadInventoryData(newPageIndex, 10);
  }


}
