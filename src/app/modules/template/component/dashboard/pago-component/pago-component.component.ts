import { Component } from '@angular/core';
import { GraficoService } from '../../../../../Services/grafico.service';
import { Chart, ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-pago-component',
  templateUrl:'./pago-component.component.html',
  styleUrl: './pago-component.component.css'
})

export class PagoComponent {
  constructor(private _graficoService: GraficoService) { }
  ngOnInit(): void {
    this.ObtenerPagos();
    this.ObtenerNotificaciones();
    this.calcularPaginacion();
  }
  
  ObtenerPagos() {
    this._graficoService.obtenerPagos().subscribe((data: any[]) => {
      console.log('Datos pagos:', data);

      // Extraer labels y valores
      this.pieChartLabels = data.map(item => item.tipoPago);
      const valores = data.map(item => item.totalPrecio);

      // Calcular estadísticas
      this.totalPagos = valores.reduce((a, b) => a + b, 0);
      this.totalTransacciones = data.length;

      // Encontrar método principal (mayor valor)
      const maxIndex = valores.indexOf(Math.max(...valores));
      this.metodoPrincipal = this.pieChartLabels[maxIndex];

      // Actualizar chart data
      this.pieChartData = {
        labels: this.pieChartLabels,
        datasets: [
          {
            data: valores,
            backgroundColor: this.colores.slice(0, valores.length),
            borderColor: '#ffffff',
            borderWidth: 3,
            hoverBorderWidth: 4,
            hoverOffset: 8
          },
        ],
      };
    });
  }
// variables
paginaActual: number = 1;   //debe iniciar en 1
itemsPorPagina: number = 10; //mostrar 10 notificaciones por página
totalPaginas: number = 0;
notificacionesPaginadas: any[] = [];
totalPaginasArray: number[] = [];
  public pieChartLabels: string[] = [];
  public pieChartType: 'pie' = 'pie';
  public totalPagos: number = 0;
  public totalTransacciones: number = 0;
  public metodoPrincipal: string = '';
   notificaciones: any[] = [];

  // Colores mejorados y más atractivos
  public colores = [
    '#10B981', // Verde esmeralda
    '#F59E0B', // Ámbar
    '#3B82F6', // Azul
    '#EF4444', // Rojo
    '#8B5CF6', // Púrpura
    '#06B6D4', // Cian
    '#F97316', // Naranja
    '#84CC16'  // Lima
  ];

  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: this.colores,
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverBorderWidth: 4,
        hoverOffset: 8
      },
    ],
  };

ppieChartOptions: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: { display: false },
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.raw as number;
          const label = context.label;
          return `${label}: S/. ${value.toFixed(2)}`;
        }
      }
    }
  }
};


  // Método para obtener valor por índice
  getValorPorIndice(index: number): number {
    return this.pieChartData.datasets[0].data[index] as number;
  }

  // Método para calcular porcentaje
  getPorcentaje(index: number): string {
    const valor = this.getValorPorIndice(index);
    const porcentaje = (valor / this.totalPagos) * 100;
    return porcentaje.toFixed(1);
  }

ObtenerNotificaciones() {
  this._graficoService.obtenerNotificaciones().subscribe({
    next: (data) => {
      console.log('Notificaciones:', data);
      this.notificaciones = data.sort((a, b) => Number(a.leido) - Number(b.leido));
      this.calcularPaginacion(); // 👉 recalculamos paginación después de cargar
    },
    error: (err) => console.error('Error obteniendo notificaciones', err)
  });
}

calcularPaginacion() {
  this.totalPaginas = Math.ceil(this.notificaciones.length / this.itemsPorPagina);
  this.totalPaginasArray = Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  this.actualizarLista();
}

actualizarLista() {
  const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
  const fin = inicio + this.itemsPorPagina;
  this.notificacionesPaginadas = this.notificaciones.slice(inicio, fin);
}

cambiarPagina(pagina: number) {
  if (pagina >= 1 && pagina <= this.totalPaginas) {
    this.paginaActual = pagina;
    this.actualizarLista();
  }
}
}

