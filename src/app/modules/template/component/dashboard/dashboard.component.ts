import { Component } from '@angular/core';
import { GraficoService } from '../../../../Services/grafico.service';
import { ChartData, ChartOptions, ChartType } from 'chart.js';



export interface ProductoMasVendido {
  productoId: number;
  nombreProducto: string;
  totalVendidos: number;
}
interface ResumenVentas {
  totalComprobantes: number;
  montoTotal: string;
  totalBoletas: number;
  montoTotalBoletas: string;
  totalFacturas: number;
  montoTotalFacturas: string;
  totalNotas: number;
  montoTotalNotas: string;
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
  meses: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];


  constructor(private _graficoService: GraficoService) { }

  barChartType: 'bar' = 'bar';
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 30, // ligera inclinación
          minRotation: 0,
          callback: function (value) {
            const label = this.getLabelForValue(value as number);
            return label.length > 12 ? label.substring(0, 12) + '…' : label;
          }
        }
      },
      y: {
        beginAtZero: true
      }
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
