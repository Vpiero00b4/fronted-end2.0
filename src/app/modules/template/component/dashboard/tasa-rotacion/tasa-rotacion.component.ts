import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { GraficoService } from '../../../../../Services/grafico.service';

interface ProductoRotacion {
  idLibro: number;
  titulo: string;
  stockInicial: number;
  totalVendido: number;
  tasaRotacion: number;
}

// Definimos una interfaz personalizada para las opciones del gráfico
interface CustomChartOptions extends ChartOptions<'bar'> {
  scales: {
    x?: {
      beginAtZero?: boolean;
      title?: {
        display: boolean;
        text: string;
      };
      ticks?: {
        precision: number;
      };
    };
    y?: {
      ticks?: {
        autoSkip: boolean;
        maxRotation: number;
        minRotation: number;
      };
    };
  };
}

@Component({
  selector: 'app-tasa-rotacion',
  templateUrl: './tasa-rotacion.component.html',
  styleUrls: ['./tasa-rotacion.component.css']
})
export class TasaRotacionComponent implements OnInit {
  // Variables para control
  productosRotacion: ProductoRotacion[] = [];
  vistaActual: 'tasa' | 'total' = 'tasa';
  filtroTiempo: string = 'total';
  limite: number = 10;
  offset: number = 0;
  hayMasDatos: boolean = true;
  
  // Configuración del gráfico
  rotacionChartType: 'bar' = 'bar';
  rotacionChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  
  rotacionChartOptions: CustomChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Tasa de Rotación'
        },
        ticks: {
          precision: 2
        }
      },
      y: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const data = this.productosRotacion[context.dataIndex];
            if (this.vistaActual === 'tasa') {
              return [
                `Tasa: ${data.tasaRotacion.toFixed(2)}`,
                `Stock: ${data.stockInicial}`,
                `Vendidos: ${data.totalVendido}`
              ];
            } else {
              return [
                `Vendidos: ${data.totalVendido}`,
                `Stock: ${data.stockInicial}`,
                `Tasa: ${data.tasaRotacion.toFixed(2)}`
              ];
            }
          }
        }
      },
      legend: {
        display: false
      }
    }
  };

  constructor(private _garfico: GraficoService) {}

  ngOnInit(): void {
    this.cargarDatosRotacion();
    console.log("hola");
    
  }

cambiarVista(vista: 'tasa' | 'total'): void {
  this.vistaActual = vista;
  this.cargarDatosRotacion(true); // true para resetear la paginación
}

  cargarDatosRotacion(reset: boolean = false): void {
    if (reset) {
      this.offset = 0;
      this.hayMasDatos = true;
    }

    this._garfico.obtenerTasaRotacion(this.filtroTiempo, this.offset, this.limite).subscribe({
      next: (data) => {
        // Si no recibimos datos, no hay más por cargar
        if (data.tasa.length === 0) {
          this.hayMasDatos = false;
          return;
        }

        // Reemplazamos los datos existentes con los nuevos
        this.productosRotacion = data.tasa;
        this.offset += this.limite; // Incrementamos el offset para la próxima carga
        this.actualizarGrafico();
      },
      error: (error) => {
        console.error('Error al cargar tasa de rotación:', error);
      }
    });
  }

  verMas(): void {
    this.cargarDatosRotacion(); // Cargará los siguientes 10 sin resetear
  }

private actualizarGrafico(): void {
  // Ordenar según la vista seleccionada
  const productosOrdenados = [...this.productosRotacion].sort((a, b) => {
    return this.vistaActual === 'tasa' 
      ? b.tasaRotacion - a.tasaRotacion 
      : b.totalVendido - a.totalVendido;
  });

  this.rotacionChartData = {
    labels: productosOrdenados.map(p => this.acortarTitulo(p.titulo)),
    datasets: [
      {
        label: `${this.vistaActual === 'tasa' ? 'Tasa de Rotación' : 'Total Vendido'} (${this.offset + 1}-${this.offset + this.productosRotacion.length})`,
        data: productosOrdenados.map(p => 
          this.vistaActual === 'tasa' ? p.tasaRotacion : p.totalVendido
        ),
        backgroundColor: productosOrdenados.map(p => this.getColor(p)),
        borderColor: '#1e3a8a',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

    // Actualizar título del eje X de manera segura
    this.rotacionChartOptions = {
      ...this.rotacionChartOptions,
      scales: {
        ...this.rotacionChartOptions.scales,
        x: {
          ...this.rotacionChartOptions.scales?.x,
          title: {
            display: true,
            text: this.vistaActual === 'tasa' ? 'Tasa de Rotación' : 'Unidades Vendidas'
          }
        }
      }
    };
  }

  private acortarTitulo(titulo: string): string {
    return titulo.length > 30 ? titulo.substring(0, 30) + '...' : titulo;
  }

  private getColor(producto: ProductoRotacion): string {
    if (this.vistaActual === 'tasa') {
      // Colores basados en tasa de rotación
      if (producto.tasaRotacion > 1.5) return '#10b981'; // Verde
      if (producto.tasaRotacion > 0.8) return '#3b82f6'; // Azul
      return '#f59e0b'; // Amarillo
    } else {
      // Colores basados en cantidad vendida
      const maxVendido = Math.max(...this.productosRotacion.map(p => p.totalVendido));
      const ratio = producto.totalVendido / maxVendido;
      
      if (ratio > 0.7) return '#10b981'; // Verde
      if (ratio > 0.3) return '#3b82f6'; // Azul
      return '#f59e0b'; // Amarillo
    }
  }


}