import { Component, OnInit } from '@angular/core';
import { VentaResponse } from '../../../../../../models/ventas-response.models';
import { VentasService } from '../../../../service/venta.service';
import { CajaService } from '../../../../service/caja.service';

@Component({
  selector: 'app-mant-caja-list',
  templateUrl: './mant-caja-list.component.html',
  styleUrls: ['./mant-caja-list.component.css']
})
export class MantCajaListComponent implements OnInit {
  ventasDelDia: VentaResponse[] = [];
  saldoInicial: number = 0;
  saldoFinal: number = 0;
  montoIngreso: number = 0;
  montoRetiro: number = 0;
  fechaInicio: string;
  fechaFin: string;
  cajaAbierta: any = null;

  constructor(
    private ventaService: VentasService,
    private cajaService: CajaService
  ) {
    const hoy = new Date().toISOString().split('T')[0];
    this.fechaInicio = this.fechaFin = hoy;
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
        } else {
          this.saldoInicial = 0;
        }
      },
      error: err => console.error("Error al obtener caja:", err)
    });
  }

  obtenerVentasDelDia() {
  if (!this.fechaInicio || !this.fechaFin) return;

  if (!this.cajaAbierta) {
    // Si no hay caja abierta, limpiamos las ventas
    this.ventasDelDia = [];
    this.calcularSaldoFinal();
    return;
  }

  this.ventaService.obtenerVentasPorFechas(this.fechaInicio, this.fechaFin).subscribe({
    next: (ventas: VentaResponse[]) => {
      this.ventasDelDia = ventas;
      this.calcularSaldoFinal();
    },
    error: err => console.error("Error al obtener ventas:", err)
  });
}


  calcularSaldoFinal() {
    const totalVentas = this.ventasDelDia.reduce((total, venta) => total + venta.totalPrecio, 0);
    this.saldoFinal = this.saldoInicial + totalVentas + this.montoIngreso - this.montoRetiro;
  }

  registrarIngresoACaja(monto: number) {
    this.montoIngreso += monto;
    this.calcularSaldoFinal();
  }

  registrarRetiroDeCaja(monto: number) {
    this.montoRetiro += monto;
    this.calcularSaldoFinal();
  }
  
  cerrarCaja()  { debugger;
  if (!this.cajaAbierta) {
    alert("No hay caja abierta para cerrar.");
    return;
  }

  // Construir el objeto con los nombres que espera el backend
  const cajaCierre = {
    idCaja: this.cajaAbierta.idCaja,
    saldoInicial: this.cajaAbierta.saldoInicial,
    saldoFinal: this.saldoFinal,
    fecha: this.cajaAbierta.fechaInicio || this.cajaAbierta.fecha, // si tienes fechaInicio, mapeala a fecha
    ingresosACaja: this.montoIngreso,
    saldoDigital: 0, // o calcula si tienes la lógica
    fechaCierre: new Date().toISOString()
  };

  this.cajaService.updateCaja(cajaCierre).subscribe({
    next: () => {
      alert("Caja cerrada correctamente.");
      this.cajaAbierta = null;
      this.saldoInicial = 0;
      this.saldoFinal = 0;
      this.montoIngreso = 0;
      this.montoRetiro = 0;
      this.obtenerVentasDelDia(); // refrescar ventas si quieres
    },
    error: err => {
      console.error("Error al cerrar la caja detalle:", err);
      alert("Error al cerrar la caja: " + (err.message || JSON.stringify(err)));
    }
  });
}
}
