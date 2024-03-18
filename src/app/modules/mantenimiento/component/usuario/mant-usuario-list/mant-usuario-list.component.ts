import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AccionMantConst } from './../../../../../constans/general.constans'; // Reemplaza 'ruta/del/archivo' con la ruta correcta
import { UsuarioResponse } from '../../../../../models/usuario-login.response';
import { UsuarioService } from '../../../service/usuario.service';

@Component({
  selector: 'app-mant-usuario-list',
  templateUrl: './mant-usuario-list.component.html',
  styleUrls: ['./mant-usuario-list.component.css']
})
export class MantUsuarioListComponent implements OnInit {
  usuarios: UsuarioResponse[] = [];
  modalRef?: BsModalRef;  //!
  usuarioSelected: UsuarioResponse = new UsuarioResponse();
  titleModal: string = "";
  accionModal: number = 0;

  constructor(
    private _route: Router,
    private _usuarioService: UsuarioService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.listarUsuarios();

  }
  listarUsuarios() {
    this._usuarioService.getAll().subscribe({
      next: (data: UsuarioResponse[]) => {
        this.usuarios = data;
      },
      error: (err) => {
        console.log("error", err);
      },
      complete: () => {
        // Hacer algo
      },
    });
  }


  crearUsuario(template: TemplateRef<any>) {
    this.usuarioSelected = new UsuarioResponse();

    this.titleModal = "NUEVO PERSO"
    this.accionModal = AccionMantConst.crear;
    this.openModal(template);
  }
  editarUsuario(template: TemplateRef<any>, usuario: UsuarioResponse) {
    this.usuarioSelected = usuario;
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
      this.listarUsuarios();
    }
  }

  eliminarRegistro(id: number) {
    
    let result = confirm("¿Está seguro de eliminar el registro?");
    if (result) {
      this._usuarioService.delete(id).subscribe({
        next: (data: number) => {
          alert("Registro eliminado de forma correcta");
        },
        error: () => { },
        complete: () => {
          this.listarUsuarios();
        }
      });
    }
  }
}
