import { Component, OnInit } from '@angular/core';
import { LibroResponse } from '../../../../../models/libro-response.models';
import { PrecioResponse } from '../../../../../models/precio-response.models';
import { LibroService } from '../../../service/libro.service';
import { PrecioService } from '../../../service/precio.service';
import { KardexResponse } from '../../../../../models/kardex-response.models';

@Component({
  selector: 'app-mant-reporte-inventario',
  templateUrl: './mant-reporte-inventario.component.html',
  styleUrls: ['./mant-reporte-inventario.component.css']
})
export class MantReporteInventarioComponent implements OnInit {

  libros: LibroResponse[] = [];
  precios: PrecioResponse[] = [];

  constructor(
    private libroService: LibroService,
    private precioService: PrecioService
  ) { }

  ngOnInit(): void {
    this.loadInventoryData();
  }

  loadInventoryData() {
    // Obtener datos de libros
    this.libroService.getAll().subscribe((libros: LibroResponse[]) => {
      this.libros = libros;

      // Obtener datos de precios después de cargar los libros
      this.loadPrecioData();
    });
  }

  loadPrecioData() {
    // Obtener datos de precios
    this.precioService.getAll().subscribe((precios: PrecioResponse[]) => {
      this.precios = precios;

      // Una vez que tengas los datos, puedes combinarlos con los libros
      this.combineData();
    });
  }

  combineData() {
    // Combinar datos de precios con los libros
    this.libros.forEach(libro => {
      const precioData = this.precios.find(p => p.idLibro === libro.idLibro);
      if (precioData) {
        libro.precioVenta = precioData.precioVenta; // Asignar el precio al libro
        libro.idPrecios = precioData.idPrecios;
        libro.porcUtilidad = precioData.porcUtilidad;
        // Agregar asignaciones para otros atributos necesarios
      }
    });
  }


}
