import { Component, OnInit } from '@angular/core';
import { VentaResponse } from '../../../../../../models/ventas-response.models';
import { VentasService } from '../../../../service/venta.service';

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

  constructor(private ventaService: VentasService) {
    const hoy = new Date();
    this.fechaInicio = this.fechaFin = hoy.toISOString().split('T')[0];  // Asegura que se inicia con la fecha actual
  }

  ngOnInit(): void {
    this.obtenerVentasDelDia();
    this.calcularSaldoInicial();
    
  }

  obtenerVentasDelDia() {
    if (!this.fechaInicio || !this.fechaFin) return;
    this.ventaService.obtenerVentasPorFechas(this.fechaInicio, this.fechaFin).subscribe({
      next: (ventas: VentaResponse[]) => {
        this.ventasDelDia = ventas;
        this.calcularSaldoFinal();
      },
      error: err => console.error("Error al obtener ventas:", err)
    });
  }

  calcularSaldoInicial() {
    // Implementar la lógica para obtener el saldo inicial, por ahora es un valor estático
    this.saldoInicial = 10000; // Suponiendo un saldo inicial de 10,000
  }

  calcularSaldoFinal() {
    this.saldoFinal = this.ventasDelDia.reduce((total, venta) => total + venta.totalPrecio, this.saldoInicial);
  }

  registrarIngresoACaja(monto: number) {
    this.saldoFinal += monto;
  }

  registrarRetiroDeCaja(monto: number) {
    this.saldoFinal -= monto;
  }
}
