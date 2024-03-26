import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AccionMantConst } from './../../../../../constans/general.constans'; // Reemplaza 'ruta/del/archivo' con la ruta correcta
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
  personaSelected: PersonaResponse = new PersonaResponse();
  titleModal: string = "";
  accionModal: number = 0;

  constructor(
    private _route: Router,
    private _personaService: PersonaService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.listarPersonas();

  }
  listarPersonas() {
    this._personaService.getAll().subscribe({
      next: (data: PersonaResponse[]) => {
        this.personas = data;
      },
      error: (err) => {
        console.log("error", err);
      },
      complete: () => {
        // Hacer algo
      },
    });
  }


  crearPersona(template: TemplateRef<any>) {
    this.personaSelected = new PersonaResponse();
    this.titleModal = "NUEVO PERSO"
    this.accionModal = AccionMantConst.crear;
    this.openModal(template);
  }
  editarPersona(template: TemplateRef<any>, persona: PersonaResponse) {
    this.personaSelected = persona;
    this.titleModal = "EDIT PERSO"
    this.accionModal = AccionMantConst.editar;

    this.openModal(template);
  }




  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  getCloseModalEmmit(res: boolean) {
    this.modalRef?.hide();
    if (res) {
      this.listarPersonas();
    }
  }

  eliminarRegistro(id: number) {
    debugger;
    let result = confirm("¿Está seguro de eliminar el registro?");
    if (result) {
      this._personaService.delete(id).subscribe({
        next: (data: number) => {
          alert("Registro eliminado de forma correcta");
        },
        error: () => { },
        complete: () => {
          this.listarPersonas();
        }
      });
    }
  }
}
