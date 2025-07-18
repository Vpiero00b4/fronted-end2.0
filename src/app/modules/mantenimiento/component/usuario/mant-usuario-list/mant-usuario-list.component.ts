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
  modalRef?: BsModalRef;  
  usuarioSelected: UsuarioResponse = new UsuarioResponse();
  titleModal: string = "";
  accionModal: number = 0;
  paginaActual: number = 1;
  tamanioPagina: number = 10;
  totalRegistros: number = 0;
  paginas: number[] = [];


  constructor(
    private _route: Router,
    private _usuarioService: UsuarioService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.listarUsuarios();

  }
  listarUsuarios() {
  this._usuarioService.obtenerUsuariosPaginados(this.paginaActual, this.tamanioPagina).subscribe({
    next: (res) => {
      this.usuarios = res.data;
      this.totalRegistros = res.total;
      const totalPaginas = Math.ceil(this.totalRegistros / this.tamanioPagina);
      this.paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);
    },
    error: (err) => {
      console.log("Error al listar usuarios paginados", err);
    }
  });
  
}
cambiarPagina(pagina: number): void {
  if (pagina !== this.paginaActual && pagina > 0 && pagina <= this.paginas.length) {
    this.paginaActual = pagina;
    this.listarUsuarios();
  }
}




  crearUsuario(template: TemplateRef<any>) {
    this.usuarioSelected = new UsuarioResponse();

    this.titleModal = "Nuevo Usuario"
    this.accionModal = AccionMantConst.crear;
    this.openModal(template);
  }
  editarUsuario(template: TemplateRef<any>, usuario: UsuarioResponse) {
    this.usuarioSelected = usuario;
    this.titleModal = "Editar Usuario"
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
