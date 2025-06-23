import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AccionMantConst } from './../../../../../constans/general.constans';
import { VentaResponse } from '../../../../../models/ventas-response.models';
import { VentasService } from '../../../service/venta.service';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../service/sharedservice';

@Component({
  selector: 'app-mant-venta-list',
  templateUrl: './mant-venta-list.component.html',
  styleUrls: ['./mant-venta-list.component.css']
})
export class MantVentaListComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  ventasFiltradas: VentaResponse[] = [];
  modalRef?: BsModalRef;
  ventaSelected: VentaResponse = new VentaResponse();
  titleModal: string = "";
  accionModal: number = 0;
  fechaInicio: string = '';
  fechaFin: string = '';
  mensaje: string = '';

  // PAGINACIÓN
  paginaActual: number = 1;
  pageSize: number = 10;
  totalRegistros: number = 0;
  paginas: number[] = [];

  constructor(
    private sharedService: SharedService,
    private _route: Router,
    private _ventaService: VentasService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.listarVentasPaginadas();
    this.escucharRegistroDeVentas();
  }

    listarVentasPaginadas(): void {
    this._ventaService.getVentasPaginadas(this.paginaActual, this.pageSize).subscribe({
      next: (res: any) => {
        console.log('Respuesta paginada:', res);

        this.ventasFiltradas = Array.isArray(res.venta) ? res.venta : [];

        this.totalRegistros = res.totalItems || this.ventasFiltradas.length;

        const totalPaginas = Math.ceil(this.totalRegistros / this.pageSize);
        this.paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);
      },
      error: () => {
        this.mensaje = 'Ocurrió un error al listar ventas paginadas.';
        this.ventasFiltradas = [];
        this.paginas = [];
      }
    });
  }



  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina < 1 || nuevaPagina > this.paginas.length) return;
    this.paginaActual = nuevaPagina;
    this.listarVentasPaginadas();
  }

  resetFiltros(): void {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.mensaje = '';
    this.paginaActual = 1;
    this.listarVentasPaginadas();
  }

  escucharRegistroDeVentas(): void {
    this.subscription.add(
      this.sharedService.ventaRegistrada$.subscribe((registrada) => {
        if (registrada) {
          this.resetFiltros();
        }
      })
    );
  }

  editarVenta(template: TemplateRef<any>, venta: VentaResponse): void {
    this.ventaSelected = venta;
    this.titleModal = "Editar Venta";
    this.accionModal = AccionMantConst.editar;
    this.openModal(template);
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  getCloseModalEmmit(res: boolean): void {
    this.modalRef?.hide();
    if (res) {
      this.listarVentasPaginadas();
    }
  }

  eliminarRegistro(id: number): void {
    if (confirm("¿Está seguro de eliminar el registro?")) {
      this._ventaService.delete(id).subscribe({
        next: (_: number) => {
          alert("Registro eliminado de forma correcta");
        },
        error: () => {},
        complete: () => {
          this.listarVentasPaginadas();
        }
      });
    }
  }

  descargarPDF(idVenta: number): void {
    this._ventaService.getVentaPDF(idVenta).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.download = `venta_${idVenta}.pdf`;
      anchor.href = url;
      anchor.click();
      window.URL.revokeObjectURL(url);
    }, (error: any) => {
      console.error("Error al descargar el PDF:", error);
    });
  }

  filtrarPorFechas(fechaInicio: string, fechaFin: string): void {
    this.mensaje = '';
    if (!fechaInicio || !fechaFin) {
      this.mensaje = 'Debe ingresar ambas fechas para filtrar.';
      return;
    }
    this._ventaService.obtenerVentasPorFechas(fechaInicio, fechaFin).subscribe({
      next: (data: VentaResponse[]) => {
        this.ventasFiltradas = data;
        this.totalRegistros = data.length;
        this.paginaActual = 1;
        const totalPaginas = Math.ceil(this.totalRegistros / this.pageSize);
        this.paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);
        if (data.length === 0) {
          this.mensaje = 'No hay ventas en ese rango de fechas.';
        }
      },
      error: () => {
        this.mensaje = 'Ocurrió un error al filtrar las ventas.';
        this.ventasFiltradas = [];
        this.paginas = [];
      }
    });
  }
  

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
