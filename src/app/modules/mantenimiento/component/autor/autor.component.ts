import { Component, EventEmitter, Output } from '@angular/core';
import { AutorService } from '../../service/autor.service';
import { Autor } from '../../../../models/libro-request.models';

@Component({
  selector: 'app-autor',
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.css'
})
export class AutorComponent {
 @Output() autorCreado = new EventEmitter<Autor>(); // Emitir el autor creado
  @Output() cerrarModal = new EventEmitter<void>(); // Emitir evento para cerrar el modal

  nuevoAutor: Autor = {
    idAutor: 0,
    nombre: '',
    apellido: '',
    codigo: 0,
    descripcion: ''
  };
  constructor(private autorService: AutorService) {}
  crearAutor(): void {
    const autor: Autor = {
      idAutor: 0,
      nombre: this.nuevoAutor.nombre,
      apellido: this.nuevoAutor.apellido,
      codigo: this.nuevoAutor.codigo,
      descripcion: this.nuevoAutor.descripcion
    };

    // Llamar al backend para guardar el autor
    this.autorService.createAutor(autor).subscribe(
      (autorGuardado) => {
        console.log('Autor guardado en el backend:', autorGuardado);
        this.autorCreado.emit(autorGuardado); // Emitimos el autor guardado al componente padre
        this.cerrarModal.emit(); // Cerramos el modal
      },
      (error: any) => {
        console.error('Error al guardar el autor:', error);
      }
    );
  }

  cerrarModalHandler(): void {
    this.cerrarModal.emit(); // Emitimos el evento de cierre del modal
  }
}
