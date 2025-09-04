import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AccionMantConst } from './../../../../../constans/general.constans';
import { VentaResponse } from '../../../../../models/ventas-response.models';
import { VentasService } from '../../../service/venta.service';
import { debounceTime, distinctUntilChanged, Subject, Subscription, switchMap } from 'rxjs';
import { SharedService } from '../../../service/sharedservice';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PersonaService } from '../../../service/persona.service';

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
  nroComprobante: string = '';
  titleModal: string = "";
  accionModal: number = 0;
  fechaInicio: string = '';
  fechaFin: string = '';
  mensaje: string = '';
  nombreCliente?: string;
  cargando: boolean = false;
  // PAGINACIÓN
  paginaActual: number = 1;
  pageSize: number = 10;
  totalRegistros: number = 0;
  paginas: number[] = [];
  pdfUrl: string | undefined = undefined;
  private searchSubject = new Subject<string>();
  constructor(
    private sharedService: SharedService,
    private _route: Router,
    private _ventaService: VentasService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private _personaService: PersonaService
  ) { }

  ngOnInit(): void {
    this.listarVentasPaginadas();
    this.escucharRegistroDeVentas();
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        this.cargando = true;
        if (!query.trim()) {
          this.ventasFiltradas = [];
          this.mensaje = '';
          this.cargando = false;
          this.listarVentasPaginadas();
          return [];
        }
        return this._ventaService.getVentasPorComporbante(query);
      })
    ).subscribe({
      next: (res: VentaResponse[]) => {
        this.ventasFiltradas = res;

        // Obtener nombre de cliente
        this.ventasFiltradas.forEach((venta) => {
          this._personaService.obtenerPersonaPorId(venta.idPersona).subscribe({
            next: (persona) => venta.nombreCliente = persona.nombre,
            error: () => venta.nombreCliente = 'Desconocido'
          });
        });

        this.mensaje = this.ventasFiltradas.length === 0
          ? "No se encontraron comprobantes con ese número."
          : '';
        this.cargando = false;
      },
      error: (err) => {
        console.error("❌ Error al buscar comprobantes:", err);
        this.mensaje = "Ocurrió un error al buscar los comprobantes.";
        this.cargando = false;
      }
    });
  }
  getPersona(id: number) {
    this._personaService.obtenerPersonaPorId(id).subscribe({
      next: (response) => {
        this.nombreCliente = response.nombre
      }
    })
  }
  listarVentasPaginadas(): void {
    this._ventaService.getVentasPaginadas(this.paginaActual, this.pageSize).subscribe({
      next: (res: any) => {
        this.ventasFiltradas = Array.isArray(res.venta) ? res.venta : [];
        this.totalRegistros = res.totalItems || this.ventasFiltradas.length;

        const totalPaginas = Math.ceil(this.totalRegistros / this.pageSize);
        this.paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

        // Aquí llamamos getPersona para cada venta
        this.ventasFiltradas.forEach((venta) => {
          this._personaService.obtenerPersonaPorId(venta.idPersona).subscribe({
            next: (persona) => {
              venta.nombreCliente = persona.nombre; // Combina nombre y apellido si deseas
            },
            error: () => {
              venta.nombreCliente = 'Desconocido';
            }
          });
        });
      },
      error: () => {
        this.mensaje = 'Ocurrió un error al listar ventas paginadas.';
        this.ventasFiltradas = [];
        this.paginas = [];
      }
    });
  }

  // listarComprobantes(nroComprobante: string) {
  //   if (!nroComprobante) return;

  //   this._ventaService.getVentasPorComporbante(nroComprobante).subscribe({
  //     next: (res) => {
  //       this.ventasFiltradas = res;
  //       this.ventasFiltradas.forEach((venta) => {
  //         this._personaService.obtenerPersonaPorId(venta.idPersona).subscribe({
  //           next: (persona) => {
  //             venta.nombreCliente = persona.nombre; // Combina nombre y apellido si deseas
  //           },
  //           error: () => {
  //             venta.nombreCliente = 'Desconocido';
  //           }
  //         });
  //       });
  //       if (this.ventasFiltradas.length === 0) {
  //         this.mensaje = "No se encontraron comprobantes con ese número.";
  //       } else {
  //         this.mensaje = '';
  //       }
  //     },
  //     error: (err) => {
  //       console.error("❌ Error al buscar comprobantes:", err);
  //       this.mensaje = "Ocurrió un error al buscar los comprobantes.";
  //     }
  //   });
  // }
  onSearchChange() {
    this.searchSubject.next(this.nroComprobante);
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
        error: () => { },
        complete: () => {
          this.listarVentasPaginadas();
        }
      });
    }
  }
  mostrarPDF: boolean = false;
  pdfurl: SafeResourceUrl | null = null;
  descargandoPDF: number | null = null; // guarda el idVenta que se está procesando

  descargarPDF(idVenta: number): void {
    // Deshabilitamos el botón
    this.descargandoPDF = idVenta;

    this._ventaService.getVentaPDF(idVenta).subscribe({
      next: (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        this.imprimirDesdeBlob(url, () => {
          // Una vez terminado, habilitamos el botón de nuevo
          this.descargandoPDF = null;
        });
      },
      error: (err) => {
        console.error('❌ Error al obtener PDF:', err);
        this.descargandoPDF = null; // reactivar si hay error
      }
    });
  }

  imprimirDesdeBlob(blobUrl: string, callback?: () => void) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobUrl;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        if (callback) callback();
      }, 500);
    };
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
