import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LibroService } from '../../../../service/libro.service';
import { LibroResponse } from '../../../../../../models/libro-response.models';

@Component({
  selector: 'app-fventaregister',
  templateUrl: './mant-fventa-register.component.html',
  styleUrls: ['./mant-fventa-register.component.css']
})
export class FventaRegisterComponent implements OnInit {
  productoForm: FormGroup | any;
  libros: LibroResponse[] = []; // Lista de libros

  constructor(private formBuilder: FormBuilder, private _libroService: LibroService) { }

  ngOnInit(): void {
    this.productoForm = this.formBuilder.group({
      buscarProducto: [''] // Campo de búsqueda de producto
    });
    //this.listarLibros();
  }

  buscarProductos(): void {
    const consulta = this.productoForm.get('buscarProducto')?.value.trim();
  
    if (!consulta) {
      // Si la consulta está vacía, mostrar todos los libros
      //this.listarLibros();
      return;
    }
    
    // Filtrar los libros según la consulta
    this.libros = this.libros.filter(libro =>
      libro.titulo.toLowerCase().includes(consulta.toLowerCase())
    );
  }

  agregarProductoAVenta(libro: LibroResponse): void {
    // Implementa la lógica para agregar el libro seleccionado a la venta
    // Puedes emitir un evento o llamar a un método del componente padre para agregarlo a la venta principal
  }

  // listarLibros(): void {
  //   this._libroService.getAll().subscribe({
  //     next: (data: LibroResponse[]) => {
  //       this.libros = data;
  //     },
  //     error: (err) => {
  //       console.log("error", err);
  //     }
  //   });
  // }
}
