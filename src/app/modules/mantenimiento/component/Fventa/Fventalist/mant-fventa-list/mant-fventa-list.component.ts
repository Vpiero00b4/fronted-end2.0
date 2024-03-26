import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LibroResponse } from '../../../../../../models/libro-response.models';
import { LibroService } from '../../../../service/libro.service';

@Component({
  selector: 'app-mant-fventa-list',
  templateUrl: './mant-fventa-list.component.html',
  styleUrls: ['./mant-fventa-list.component.css']
})
export class FventaListComponent implements OnInit {
  productoForm!: FormGroup;
  libros: LibroResponse[] = [];

  constructor(private formBuilder: FormBuilder, private libroService: LibroService) { }

  ngOnInit(): void {
    this.productoForm = this.formBuilder.group({
      buscarProducto: ['']
    });
    //this.listarLibros();
  }

  buscarProductos(): void {
    const consulta = this.productoForm.get('buscarProducto')?.value.trim();
  
    if (!consulta) {
      //this.listarLibros();
      return;
    }
    
    // this.libroService.buscarLibrosPorTitulo(consulta).subscribe(
    //   libros => this.libros = libros,
    //   error => console.error('Error al buscar libros:', error)
    // );
  }

  agregarProductoAVenta(libro: LibroResponse): void {
    // Implementa la lógica para agregar el libro seleccionado a la venta
  }

  // listarLibros(): void {
  //   this.libroService.getAll().subscribe(
  //     libros => this.libros = libros,
  //     error => console.error('Error al obtener libros:', error)
  //   );
  // }
}
