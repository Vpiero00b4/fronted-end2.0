import { Component, OnInit } from '@angular/core';
import { VentaResponse } from '../../../../../../models/ventas-response.models';
import { VentasService } from '../../../../service/venta.service';
import { CajaService } from '../../../../service/caja.service';
import { formatDate } from '@angular/common'; // ✅ Necesario para formatear fecha

@Component({
  selector: 'app-mant-caja-list',
  templateUrl: './mant-caja-list.component.html',
  styleUrls: ['./mant-caja-list.component.css']
})
export class MantCajaListComponent implements OnInit {
  ventasDelDia: VentaResponse[] = [];
  fechaFiltro: string;

  saldoInicial: number = 0;
  saldoDigital: number = 0;
  totalVentas: number = 0;
  totalEfectivo: number = 0;
  saldoFinal: number = 0;

  montoIngreso: number = 0;
  montoRetiro: number = 0;
  nuevoIngreso: number = 0;
  nuevoRetiro: number = 0;

  cajaAbierta: any = null;

  constructor(
    private ventaService: VentasService,
    private cajaService: CajaService
  ) {
    const hoy = new Date().toISOString().split('T')[0];
    this.fechaFiltro = hoy;
  }

  ngOnInit(): void {
    this.obtenerCajaAbierta();
    this.obtenerVentasDelDia();
  }

  obtenerCajaAbierta() {
    this.cajaService.getCajas().subscribe({
      next: (cajas: any[]) => {
        this.cajaAbierta = cajas.find(c => !c.fechaCierre);
        if (this.cajaAbierta) {
          this.saldoInicial = this.cajaAbierta.saldoInicial || 0;
          this.saldoDigital = this.cajaAbierta.saldoDigital || 0;
        } else {
          this.saldoInicial = 0;
          this.saldoDigital = 0;
        }
        this.calcularSaldoFinal();
      },
      error: err => console.error("Error al obtener caja:", err)
    });
  }

  obtenerVentasDelDia() {
    if (this.fechaFiltro && this.cajaAbierta) {
      const fecha = formatDate(this.fechaFiltro, 'yyyy-MM-dd', 'en-US');
      this.ventaService.obtenerVentasPorFechas(fecha, fecha).subscribe({
        next: (ventas: VentaResponse[]) => {
          this.ventasDelDia = ventas;

          // Reinicia totales
          this.totalVentas = 0;
          this.saldoDigital = 0;
          this.totalEfectivo = 0;

          // Calcular sumas
          ventas.forEach(venta => {
            const monto = venta.totalPrecio || 0;
            this.totalVentas += monto;

            if (venta.tipoPago?.toLowerCase() === 'digital') {
              this.saldoDigital += monto;
            } else if (venta.tipoPago?.toLowerCase() === 'efectivo') {
              this.totalEfectivo += monto;
            }
          });

          this.calcularSaldoFinal();
        },
        error: err => {
          console.error('Error al obtener ventas del día', err);
        }
      });
    } else {
      this.ventasDelDia = [];
      this.totalVentas = 0;
      this.saldoDigital = 0;
      this.totalEfectivo = 0;
      this.calcularSaldoFinal();
    }
  }

  calcularSaldoFinal() {
    this.saldoFinal =
      this.saldoInicial +
      this.montoIngreso +
      this.totalVentas -
      this.montoRetiro;
  }

  registrarIngresoACaja() {
    if (this.nuevoIngreso <= 0) {
      alert("Ingrese un monto válido para el ingreso.");
      return;
    }

    this.montoIngreso += this.nuevoIngreso;
    this.nuevoIngreso = 0;
    this.calcularSaldoFinal();
  }

  registrarRetiroDeCaja() {
    if (this.nuevoRetiro <= 0) {
      alert("Ingrese un monto válido para el retiro.");
      return;
    }

    this.montoRetiro += this.nuevoRetiro;
    this.nuevoRetiro = 0;
    this.calcularSaldoFinal();
  }

  cerrarCaja() {
    if (!this.cajaAbierta) {
      alert("No hay caja abierta para cerrar.");
      return;
    }

    const cajaCierre = {
      idCaja: this.cajaAbierta.idCaja,
      saldoInicial: this.cajaAbierta.saldoInicial,
      saldoFinal: this.saldoFinal,
      fecha: this.cajaAbierta.fechaInicio || this.cajaAbierta.fecha,
      ingresosACaja: this.montoIngreso,
      saldoDigital: this.saldoDigital,
      fechaCierre: new Date().toISOString()
    };

    this.cajaService.updateCaja(cajaCierre).subscribe({
      next: () => {
        alert("Caja cerrada correctamente.");
        this.cajaAbierta = null;
        this.saldoInicial = 0;
        this.saldoDigital = 0;
        this.totalVentas = 0;
        this.totalEfectivo = 0;
        this.saldoFinal = 0;
        this.montoIngreso = 0;
        this.montoRetiro = 0;
        this.nuevoIngreso = 0;
        this.nuevoRetiro = 0;
        this.ventasDelDia = [];
      },
      error: err => {
        console.error("Error al cerrar la caja detalle:", err);
        alert("Error al cerrar la caja: " + (err.message || JSON.stringify(err)));
      }
    });
  }
}
