import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AccionMantConst } from '../../../../../constans/general.constans'; // Reemplaza 'ruta/del/archivo' con la ruta correcta
import { LibroResponse } from '../../../../../models/libro-response.models';
import { LibroService } from '../../../service/libro.service';

@Component({
  selector: 'app-mant-libro-list',
  templateUrl: './mant-libro-list.component.html',
  styleUrl: './mant-libro-list.component.css'
})

export class MantLibroListComponent implements OnInit {
  libros: LibroResponse[] = [];
  modalRef?: BsModalRef;  //!
  libroSelected: LibroResponse = new LibroResponse();
  titleModal: string = "";
  accionModal: number = 0;

  constructor(
    private _route: Router,
    private _libroService: LibroService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.listarLibros();

  }
  
  listarLibros() {
   
    this._libroService.getAll().subscribe({
      next: (data: LibroResponse[]) => {
        this.libros = data;
      },
      error: (err) => {
        console.log("error", err);
      },
      complete: () => {
        // Hacer algo
      },
    });
  }


  crearLibro(template: TemplateRef<any>) {
    this.libroSelected = new LibroResponse();
    this.titleModal = "NUEVO LIBRO"
    this.accionModal = AccionMantConst.crear;
    this.openModal(template);
  }
  editarLibro(template: TemplateRef<any>, libro: LibroResponse) {
    this.libroSelected = libro;
    this.titleModal = "EDIT LIBRO"
    this.accionModal = AccionMantConst.editar;

    this.openModal(template);
  }


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  getCloseModalEmmit(res: boolean) {
    this.modalRef?.hide();
    if (res) {
      this.listarLibros();
    }
  }

  eliminarRegistro(id: number) {
    
    let result = confirm("¿Está seguro de eliminar el registroL?");
    if (result) {
      this._libroService.delete(id).subscribe({
        next: (data: number) => {
          alert("Registro eliminado de forma correctaL");
        },
        error: () => { },
        complete: () => {
          this.listarLibros();
        }
      });
    }
  }
  buscarProductos(): void {
    // Lógica para buscar productos
    // Aquí puedes usar this.filtroSeleccionado y this.textoBusqueda para realizar la búsqueda
    // Por ejemplo, puedes llamar a un servicio que se encargue de realizar la búsqueda
  }

  filtroSeleccionado(event: any): void {
    // Lógica para manejar la selección del filtro
    // Aquí puedes obtener el valor seleccionado del desplegable
    // y almacenarlo en una variable para su posterior uso en la búsqueda
  }

  textoBusqueda(event: any): void {
    // Lógica para manejar el texto de búsqueda
    // Aquí puedes obtener el valor del campo de búsqueda
    // y almacenarlo en una variable para su posterior uso en la búsqueda
  }

    // Lógica para editar un libro
    // Por ejemplo, abrir un modal con los detalles del libro seleccionado
}
