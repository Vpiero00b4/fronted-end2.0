
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AccionMantConst } from './../../../../../constans/general.constans'; // Reemplaza 'ruta/del/archivo' con la ruta correcta
import { VentaResponse } from '../../../../../models/ventas-response.models';
import { VentasService } from '../../../service/venta.service';

@Component({
  selector: 'app-mant-venta-list',
  templateUrl: './mant-venta-list.component.html',
  styleUrls: ['./mant-venta-list.component.css']
})
export class MantVentaListComponent implements OnInit {
  ventas: VentaResponse[] = [];
  modalRef?: BsModalRef;  
  ventaSelected: VentaResponse = new VentaResponse();
  titleModal: string = "";
  accionModal: number = 0;

  constructor(
    private _route: Router,
    private _ventaService: VentasService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.listarVentas();

  }
  listarVentas() {
    this._ventaService.getAll().subscribe({
      next: (data: VentaResponse[]) => {
        this.ventas = data;
      },
      error: (err) => {
        console.log("error", err);
      },
      complete: () => {
        // Hacer algo
      },
    });
  }


  // crearVenta(template: TemplateRef<any>) {
  //   this.ventaSelected = new VentaResponse();
  //   this.titleModal = "Nueva venta"
  //   this.accionModal = AccionMantConst.crear;
  //   this.openModal(template);
  // }
  editarVenta(template: TemplateRef<any>, venta: VentaResponse) {
    this.ventaSelected = venta;
    this.titleModal = "Editar Venta"
    this.accionModal = AccionMantConst.editar;

    this.openModal(template);
  }




  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  getCloseModalEmmit(res: boolean) {
    this.modalRef?.hide();
    if (res) {
      this.listarVentas();
    }
  }

  eliminarRegistro(id: number) {
    debugger;
    let result = confirm("¿Está seguro de eliminar el registro?");
    if (result) {
      this._ventaService.delete(id).subscribe({
        next: (data: number) => {
          alert("Registro eliminado de forma correcta");
        },
        error: () => { },
        complete: () => {
          this.listarVentas();
        }
      });
    }
  }
}
