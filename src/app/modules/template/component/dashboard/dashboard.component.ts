import { Component } from '@angular/core';
import { GraficoService } from '../../../../Services/grafico.service';
import { ChartData, ChartOptions, ChartType } from 'chart.js';



export interface ProductoMasVendido {
  productoId: number;
  nombreProducto: string;
  totalVendidos: number;
}
interface ResumenVentas {
  totalComprobantesEmitidos: number;
  montoTotalComprobantes: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
   productos: ProductoMasVendido[] = [];
  mes: number = new Date().getMonth() + 1;
  anio: number = new Date().getFullYear();
   resumenVentas: ResumenVentas | null = null;

  constructor(private _graficoService: GraficoService) {}

  barChartType: ChartType = 'bar';
  barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    }
  };

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Cantidad Vendida', backgroundColor: '#3b82f6' }
    ]
  };

  ngOnInit(): void {
    this.cargarProductosMasVendidos();
    this.obtenerResumenVentas();
  }

  cargarDatos(): void {
    this.cargarProductosMasVendidos();
  }

 cargarProductosMasVendidos(): void {
  this._graficoService.obtenerProductosMasVendidos(this.mes, this.anio).subscribe(data => {
    this.productos = data;

    this.barChartData = {
      labels: data.map(p => p.nombreProducto),
      datasets: [
        {
          data: data.map(p => p.totalVendidos),
          label: 'Cantidad Vendida',
          backgroundColor: '#3b82f6'
        }
      ]
    };
  });
}
obtenerResumenVentas(): void {
    this._graficoService.obtenerResumenVentas().subscribe({
      next: (data) => {
        this.resumenVentas = data;
      },
      error: (error) => {
        console.error('Error al obtener resumen de ventas:', error);
      }
    });
  }


}
