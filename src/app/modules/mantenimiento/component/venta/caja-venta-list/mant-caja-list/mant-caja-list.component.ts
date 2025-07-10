import { Component, OnInit } from '@angular/core';
import { VentaResponse } from '../../../../../../models/ventas-response.models';
import { VentasService } from '../../../../service/venta.service';
import { CajaService } from '../../../../service/caja.service';
import { AuthService } from '../../../../../auth/servicef/auth.service';

@Component({
  selector: 'app-mant-caja-list',
  templateUrl: './mant-caja-list.component.html',
  styleUrls: ['./mant-caja-list.component.css']
})
export class MantCajaListComponent implements OnInit {
  ventasDelDia: VentaResponse[] = [];
  fechaFiltro: string;
  rolUsuario: string | null = null;


  // Saldos y montos
  saldoInicial = 0;
  saldoDigital = 0;
  saldoFinal = 0;
  totalVentas = 0;
  totalEfectivo = 0;
  montoIngreso = 0;
  montoRetiro = 0;

  nuevoIngreso = 0;
  nuevoRetiro = 0;

  cajaActual: any = null;  // Caja para la fecha seleccionada
  mensajeCaja: string = '';

  // PAGINADO
  paginaActual: number = 1;
  pageSize: number = 10;
  totalVentasDia: number = 0;
  totalPaginas: number = 0;

  constructor(
    private ventaService: VentasService,
    private cajaService: CajaService,
    private authService:AuthService
  ) {
    const hoy = new Date().toISOString().split('T')[0];
    this.fechaFiltro = hoy;
    this.rolUsuario = this.authService.getCargo();
    console.log(this.rolUsuario);
    
  }

  ngOnInit(): void {
    this.filtrarPorFecha();
  }

  filtrarPorFecha(): void {
    this.limpiarDatos();

    this.cajaService.getCajas().subscribe({
      next: (cajas: any[]) => {
        const caja = cajas.find(c => c.fecha && c.fecha.startsWith(this.fechaFiltro));
        if (caja) {
          this.cajaActual = caja;
          this.asignarDatosDeCaja(caja);
          this.paginaActual = 1;
        } else {
          this.mensajeCaja = 'No existe una caja registrada para esta fecha.';
        }
      },
      error: (err: any) => {
        this.mensajeCaja = 'Error al obtener datos de caja.';
        this.limpiarDatos();
      }
    });
  }

  // Para paginar ventas del día usando tu endpoint paginado}

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina < 1 || nuevaPagina > this.totalPaginas) return;
    this.paginaActual = nuevaPagina;
  }

  asignarDatosDeCaja(caja: any): void {
    this.saldoInicial = caja.saldoInicial ?? 0;
    this.saldoFinal = caja.saldoFinal ?? 0;
    this.saldoDigital = caja.saldoDigital ?? 0;
    this.montoIngreso = caja.ingresosACaja ?? 0;
    // Si tu backend trae retiros u otros campos, asígnalos aquí.
  }

  limpiarDatos(): void {
    this.cajaActual = null;
    this.saldoInicial = 0;
    this.saldoFinal = 0;
    this.saldoDigital = 0;
    this.totalVentas = 0;
    this.totalEfectivo = 0;
    this.montoIngreso = 0;
    this.montoRetiro = 0;
    this.ventasDelDia = [];
    this.mensajeCaja = '';
    this.paginaActual = 1;
    this.totalPaginas = 0;
    this.totalVentasDia = 0;
  }

  registrarIngresoACaja(): void {
    if (this.nuevoIngreso <= 0) {
      alert('Ingrese un monto válido para el ingreso.');
      return;
    }
    this.montoIngreso += this.nuevoIngreso;
    this.nuevoIngreso = 0;
    this.calcularSaldoFinalLocal();
  }

  registrarRetiroDeCaja(): void {
    if (this.nuevoRetiro <= 0) {
      alert('Ingrese un monto válido para el retiro.');
      return;
    }
    this.montoRetiro += this.nuevoRetiro;
    this.nuevoRetiro = 0;
    this.calcularSaldoFinalLocal();
  }

  calcularSaldoFinalLocal(): void {
    this.saldoFinal =
      this.saldoInicial +
      this.montoIngreso +
      this.totalVentas -
      this.montoRetiro;
  }

  cerrarCaja(): void {
    if (!this.cajaActual) {
      alert('No hay Caja Abierta.');
      this.limpiarDatos();
      this.mensajeCaja = 'No existe una caja registrada para esta fecha.';
      return;
    }

    if (this.cajaActual.fechaCierre) {
      alert('No hay Caja Abierta.');
      this.limpiarDatos();
      this.mensajeCaja = 'La caja ya está cerrada para esta fecha.';
      return;
    }

    const cajaCierre = {
      idCaja: this.cajaActual.idCaja,
      saldoInicial: this.cajaActual.saldoInicial,
      saldoFinal: this.saldoFinal,
      fecha: this.cajaActual.fecha,
      ingresosACaja: this.montoIngreso,
      saldoDigital: this.saldoDigital,
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
