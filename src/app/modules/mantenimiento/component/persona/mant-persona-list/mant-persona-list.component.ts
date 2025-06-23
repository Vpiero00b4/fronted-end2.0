import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

import { AccionMantConst } from './../../../../../constans/general.constans';
import { PersonaService } from '../../../service/persona.service';
import { PersonaResponse } from '../../../../../models/persona-response-models';

@Component({
  selector: 'app-mant-persona-list',
  templateUrl: './mant-persona-list.component.html',
  styleUrls: ['./mant-persona-list.component.css']
})
export class MantPersonaListComponent implements OnInit {
  personas: PersonaResponse[] = [];
  modalRef?: BsModalRef;
  paginaActual: number = 1;
  tamanioPagina: number = 10;
  totalRegistros: number = 0;
  paginas: number[] = [];

  personaSelected: PersonaResponse = new PersonaResponse();
  titleModal: string = "";
  accionModal: number = 0;

  constructor(
    private _route: Router,
    private _personaService: PersonaService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.listarPersonas();
  }

 listarPersonas(): void {
  this._personaService.obtenerPersonasPaginadas(this.paginaActual, this.tamanioPagina).subscribe({
    next: (res) => {
      this.personas = res.data;
      this.totalRegistros = res.total;

      const totalPaginas = Math.ceil(this.totalRegistros / this.tamanioPagina);
      this.paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);
    },
    error: (err) => {
      console.error("Error al listar personas paginadas", err);
    }
  });
}

cambiarPagina(pagina: number): void {
  if (pagina !== this.paginaActual && pagina > 0 && pagina <= this.paginas.length) {
    this.paginaActual = pagina;
    this.listarPersonas();
  }
}
  crearPersona(template: TemplateRef<any>): void {
    this.personaSelected = new PersonaResponse();
    this.titleModal = "NUEVO REGISTRO";
    this.accionModal = AccionMantConst.crear;
    this.openModal(template);
  }

  editarPersona(template: TemplateRef<any>, persona: PersonaResponse): void {
    this.personaSelected = { ...persona }; // Se clona para evitar side effects
    this.titleModal = "EDITAR REGISTRO";
    this.accionModal = AccionMantConst.editar;
    this.openModal(template);
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg'
    });
  }

  getCloseModalEmmit(res: boolean): void {
    this.modalRef?.hide();
    if (res) {
      this.listarPersonas();
    }
  }

  eliminarRegistro(id: number): void {
    const confirmacion = confirm("¿Está seguro de eliminar el registro?");
    if (confirmacion) {
      this._personaService.delete(id).subscribe({
        next: () => {
          alert("Registro eliminado correctamente");
        },
        error: (err) => {
          console.error("Error al eliminar", err);
        },
        complete: () => {
          this.listarPersonas();
        }
      });
    }
  }
}