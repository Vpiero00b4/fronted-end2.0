import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VentaResponse } from '../../../../../../models/ventas-response.models';
import { VentasService } from '../../../../service/venta.service';
import { CajaService } from '../../../../service/caja.service';
import { Caja, RetiroDeCaja } from '../../../../../../models/caja-response';
import { RetiroDeCajaService } from '../../../../service/retirocaja.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mant-caja-list',
  templateUrl: './mant-caja-list.component.html',
  styleUrls: ['./mant-caja-list.component.css']
})
export class MantCajaListComponent implements OnInit {
  ventasDelDia: VentaResponse[] = [];
  fechaFiltro: string;
  // Saldos y montos
  montoIngreso = 0;
  montoRetiro = 0;

  nuevoIngreso = 0;
  nuevoRetiro = 0;

  cajaHoy: Caja | null = null;
  mensajeCaja: string | null = null;
  mostrarFormularioRetiro = false;
  // PAGINADO
  paginaActual: number = 1;
  pageSize: number = 10;
  totalVentasDia: number = 0;
  totalPaginas: number = 0;
  cajaAbierta: any = null;
  

  @ViewChild('retiroModal') retiroModal!: ElementRef;


  constructor(
    private ventaService: VentasService,
    private cajaService: CajaService,
    private retiroCajaService: RetiroDeCajaService
  ) {
    const hoy = new Date();
    hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
    this.fechaFiltro = hoy.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.getCajaHoy();
    this.obtenerventas();
  }
  getCajaHoy(): void {
    this.cajaService.getCajaHoy().subscribe({
      next: (res) => {
        if (res) {
          this.cajaHoy = res;
          this.mensajeCaja = null;
        } else {
          this.cajaHoy = null;
          this.mensajeCaja = 'No hay caja registrada para la fecha seleccionada.';
        }
      },
      error: () => {
        this.cajaHoy = null;
        this.mensajeCaja = 'Error al obtener datos de caja.';
      }
    });
    this.retiroCajaService.getRetiros().subscribe({
      next:(res)=>{
        this.montoRetiro=res;
      }
    })
  }

  retiro: RetiroDeCaja = {
    id: 0,
    descripcion: "",
    fecha: new Date().toISOString().split("T")[0],
    cajaId: 0,
    montoEfectivo: 0,
    montoDigital: 0
  };


  abrirFormularioRetiro() {
    if (!this.cajaHoy) return;

    this.retiro = {
      id: 0,
      descripcion: "",
      fecha: new Date().toISOString().split("T")[0],
      cajaId: this.cajaHoy.idCaja,
      montoEfectivo: 0,
      montoDigital: 0
    };
    this.mostrarFormularioRetiro = true; // ← Esto muestra el modal
  }

  cerrarFormularioRetiro() {
    this.mostrarFormularioRetiro = false; // ← Esto oculta el modal
    this.resetFormulario();
  }

  private resetFormulario() {
    this.retiro = {
      id: 0,
      descripcion: "",
      fecha: new Date().toISOString().split("T")[0],
      cajaId: 0,
      montoEfectivo: 0,
      montoDigital: 0
    };
  }

  registrarRetiroDeCaja() {
    if (!this.cajaHoy) return;

    const request: RetiroDeCaja = {
      ...this.retiro,
      cajaId: this.cajaHoy.idCaja
    };

    this.retiroCajaService.createRetiroCaja(request).subscribe({
      next: (res) => {
        Swal.fire(
            'Retiro registrado',
            'El retiro se ha realizado con éxito.',
            'success'
          );
        this.getCajaHoy();
        this.cerrarFormularioRetiro(); // ← Esto funciona perfectamente ahora
      },
      error: (err) => {
        console.error("❌ Error al registrar retiro", err);
      }
    });
  }


  obtenerventas() {
    if (!this.fechaFiltro) return;

    this.ventaService.obtenerVentasPorFechas(this.fechaFiltro, this.fechaFiltro).subscribe({
      next: (ventas) => {
        this.ventasDelDia = ventas;

        if (ventas.length === 0) {
          this.mensajeCaja = 'No hay ventas para esta fecha.';
        } else {
          this.mensajeCaja = '';
        }

        console.log('Ventas:', ventas);
      },
      error: (err) => {
        this.mensajeCaja = 'Ocurrió un error al obtener las ventas.';
        console.error(err);
      }
    });
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina < 1 || nuevaPagina > this.totalPaginas) return;
    this.paginaActual = nuevaPagina;
  }

  limpiarDatos(): void {
    this.cajaHoy = null;
    this.montoIngreso = 0;
    this.montoRetiro = 0;
    this.ventasDelDia = [];
    this.mensajeCaja = '';
    this.paginaActual = 1;
    this.totalPaginas = 0;
    this.totalVentasDia = 0;
  }

  mostrarIngreso: boolean = false;
  tipoIngreso: 'efectivo' | 'digital' = 'efectivo';

  registrarIngresoACaja(): void {
    if (!this.cajaHoy) return;

    if (this.nuevoIngreso <= 0) {
      alert('Ingrese un monto válido para el ingreso.');
      return;
    }
    const cajaIngreso = { ...this.cajaHoy };

    // Sumar al saldo correspondiente
    if (this.tipoIngreso === 'efectivo') {
      cajaIngreso.ingresosACaja += this.nuevoIngreso; // o saldo en efectivo si tienes otro campo
    } else if (this.tipoIngreso === 'digital') {
      cajaIngreso.saldoDigital += this.nuevoIngreso;
    }

    // Actualizar el saldo final
    cajaIngreso.saldoFinal = cajaIngreso.ingresosACaja + cajaIngreso.saldoDigital;

    // Enviar al backend
    this.cajaService.updateCaja(cajaIngreso).subscribe({
      next: () => {
        alert('✅ Ingreso registrado correctamente');
        this.mostrarIngreso = false; // ocultar formulario
        this.nuevoIngreso = 0;
        this.montoIngreso=cajaIngreso.saldoDigital
        this.getCajaHoy();
      },
      error: (err) => {
        console.error('❌ Error al registrar ingreso:', err);
      }
    });
  }

  cerrarCaja(): void {
    if (!this.cajaHoy) {
      alert('No hay Caja Abierta.');
      this.limpiarDatos();
      this.mensajeCaja = 'No existe una caja registrada para esta fecha.';
      return;
    }

    if (this.cajaHoy.fechaCierre) {
      alert('No hay Caja Abierta.');
      this.limpiarDatos();
      this.mensajeCaja = 'La caja ya está cerrada para esta fecha.';
      return;
    }

    const cajaCierre = {
      idCaja: this.cajaHoy.idCaja,
      saldoInicial: this.cajaHoy.saldoInicial,
      saldoFinal: this.cajaHoy.saldoFinal,
      fecha: this.cajaHoy.fecha,
      ingresosACaja: this.montoIngreso,
      saldoDigital: this.cajaHoy.saldoDigital,
      fechaCierre: new Date().toISOString()
    };

    this.cajaService.updateCaja(cajaCierre).subscribe({
      next: () => {
        alert('Caja cerrada correctamente.');
        this.limpiarDatos();
        this.mensajeCaja = 'No existe una caja registrada para esta fecha.';
      },
      error: (err: any) => {
        console.error('Error al cerrar la caja detalle:', err);
        alert('Error al cerrar la caja: ' + (err.message || JSON.stringify(err)));
      }
    });
  }
}