import { Component } from '@angular/core';
import { VentasService } from '../../../service/venta.service';

@Component({
  selector: 'app-vreportes-component',
  templateUrl: './vreportes-component.html',
  styleUrl: './vreportes-component.css'
})
export class VReportesComponent {
  constructor(private ventasService: VentasService) { }
  meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"];
  diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  mesActual = new Date().getMonth();
  anioActual = new Date().getFullYear();
  fechaSeleccionada: Date | null = null;
  diasDelMes: number[] = [];

  ngOnInit() {
    this.generarDiasDelMes();
  }

  generarDiasDelMes() {
    const dias = new Date(this.anioActual, this.mesActual + 1, 0).getDate();
    this.diasDelMes = Array.from({ length: dias }, (_, i) => i + 1);
  }

  mesAnterior() {
    if (this.mesActual === 0) {
      this.mesActual = 11;
      this.anioActual--;
    } else {
      this.mesActual--;
    }
    this.generarDiasDelMes();
  }

  mesSiguiente() {
    if (this.mesActual === 11) {
      this.mesActual = 0;
      this.anioActual++;
    } else {
      this.mesActual++;
    }
    this.generarDiasDelMes();
  }

  seleccionarDia(dia: number) {
    this.fechaSeleccionada = new Date(this.anioActual, this.mesActual, dia);
    this.ventasService.getPDFVentas(this.fechaSeleccionada).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      window.open(url); // abre el PDF en nueva pestaña
    });
  }
  ventasPorDia: boolean = false;
  tieneVentas(dia: number): boolean {
    return this.ventasPorDia;
  }

  get diasConVentas(): number {
    return this.diasDelMes.filter(dia => this.tieneVentas(dia)).length;
  }
}
