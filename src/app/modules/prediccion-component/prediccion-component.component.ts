import { Component, OnInit } from '@angular/core';
import { DetalleVentaService, Prediccion } from '../mantenimiento/service/detalleventa.service';
import { LibroService } from '../mantenimiento/service/libro.service';
import { Libro } from '../../models/libro-request.models';

@Component({
  selector: 'app-prediccion-component',
  templateUrl: './prediccion-component.component.html',
  styleUrl: './prediccion-component.component.css'
})
export class PrediccionComponent implements OnInit {
  constructor(private detalleVentaSerice: DetalleVentaService, private libroService: LibroService) { }

  // Propiedades para el buscador de libros
  public terminoBusqueda: string = '';
  public librosEncontrados: Libro[] = [];
  public libroSeleccionado: Libro | null = null;
  public mostrarResultados: boolean = false;
  public buscandoLibros: boolean = false;
  public rangoFechas: { inicio: Date, fin: Date } | null = null;

  // Propiedades para las predicciones
  public cargandoPredicciones: boolean = false;
  public diasPrediccion: number = 7; // Días a predecir (configurable)

  // Datos para los gráficos (sin tipos estrictos)
  public lineChartData: any = {
    labels: [],
    datasets: []
  };

  public barChartData: any = {
    labels: [],
    datasets: []
  };
  private obtenerDia(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { weekday: 'long' });
  }

  // Opciones mejoradas para el gráfico de líneas
  public lineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Predicción de Ventas por Fecha',
        font: { size: 16, weight: 'bold' }
      },
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        callbacks: {
          afterLabel: (context: any) => {
            const prediccion = this.predicciones[context.dataIndex];
            const dia = new Date(prediccion.fecha)
              .toLocaleDateString('es-ES', { weekday: 'long' });

            return [
              `Día: ${dia.charAt(0).toUpperCase() + dia.slice(1)}`, // capitalizado
              `Tipo: ${prediccion.dimFecha.tipoDia}`,
              `Fin de semana: ${prediccion.dimFecha.esFinDeSemana ? 'Sí' : 'No'}`,
              `Trimestre: ${prediccion.dimFecha.trimestre}`,
              `Estación: ${prediccion.dimFecha.estacion}`
            ];
          }
        }
      }

    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cantidad Predicha'
        },
        grid: {
          color: '#e0e0e0'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Fecha'
        },
        grid: {
          display: false
        }
      }
    },
    elements: {
      point: {
        radius: 6,
        hoverRadius: 8,
        backgroundColor: 'white',
        borderWidth: 2
      }
    }
  };

  // Opciones para el gráfico de barras
  public barChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Predicción de Ventas - Vista de Barras',
        font: { size: 16, weight: 'bold' }
      },
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cantidad Predicha'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Fecha'
        }
      }
    }
  };

  public predicciones: Prediccion[] = [];

  // Propiedades para las tarjetas de estadísticas
  public estadisticas = {
    total: 0,
    promedio: 0,
    maximo: 0,
    minimo: 0,
    diasFinSemana: 0,
    diasLaborables: 0
  };

  // Propiedad para alternar entre vistas
  public vistaActual: 'lineas' | 'barras' | 'tabla' = 'lineas';

  ngOnInit(): void {
    if (this.predicciones && this.predicciones.length > 0) {
      this.rangoFechas = {
        inicio: new Date(this.predicciones[0].fecha),
        fin: new Date(this.predicciones[this.predicciones.length - 1].fecha)
      };
    }
  }

  // Método para buscar libros
  public buscarLibros(): void {
    if (this.terminoBusqueda.trim().length < 2) {
      this.librosEncontrados = [];
      this.mostrarResultados = false;
      return;
    }

    this.buscandoLibros = true;

    // Aquí necesitas crear un método en tu servicio para buscar libros
    this.libroService.buscarLibros(this.terminoBusqueda).subscribe({
      next: (libros: Libro[]) => {
        this.librosEncontrados = libros;
        this.mostrarResultados = true;
        this.buscandoLibros = false;
      },
      error: (error) => {
        console.error('Error al buscar libros:', error);
        this.librosEncontrados = [];
        this.mostrarResultados = false;
        this.buscandoLibros = false;
      }
    });
  }

  // Método para seleccionar un libro
  public seleccionarLibro(libro: Libro): void {
    this.libroSeleccionado = libro;
    this.terminoBusqueda = libro.titulo ?? '';
    this.mostrarResultados = false;

    // Limpiar datos anteriores
    this.limpiarDatos();
  }

  // Método para obtener predicciones del libro seleccionado
  public obtenerPredicciones(): void {
    if (!this.libroSeleccionado) {
      alert('Por favor selecciona un libro primero');
      return;
    }

    this.cargandoPredicciones = true;

    this.detalleVentaSerice.obtenerPredicciones(this.libroSeleccionado.idLibro, this.diasPrediccion).subscribe({
      next: (data) => {
        this.predicciones = data;
        this.procesarDatos(data);
        this.calcularEstadisticas(data);
        this.cargandoPredicciones = false;
      },
      error: (error) => {
        console.error('Error al obtener predicciones:', error);
        this.cargandoPredicciones = false;
        alert('Error al obtener las predicciones. Por favor intenta nuevamente.');
      }
    });
  }

  // Método para limpiar datos
  private limpiarDatos(): void {
    this.predicciones = [];
    this.lineChartData = { labels: [], datasets: [] };
    this.barChartData = { labels: [], datasets: [] };
    this.estadisticas = {
      total: 0,
      promedio: 0,
      maximo: 0,
      minimo: 0,
      diasFinSemana: 0,
      diasLaborables: 0
    };
  }

  // Método para cerrar resultados de búsqueda
  public cerrarResultados(): void {
    this.mostrarResultados = false;
  }

  // Método para limpiar selección
  public limpiarSeleccion(): void {
    this.libroSeleccionado = null;
    this.terminoBusqueda = '';
    this.mostrarResultados = false;
    this.limpiarDatos();
  }

  private procesarDatos(data: Prediccion[]): void {
    const labels = data.map(d => this.formatearFecha(d.fecha));
    const cantidades = data.map(d => d.cantidadPredicha);

    // Colores diferentes para fines de semana vs días laborables
    const coloresBarras = data.map(d =>
      d.dimFecha.esFinDeSemana ? '#ff6b6b' : '#4ecdc4'
    );

    // Configurar gráfico de líneas
    this.lineChartData = {
      labels: labels,
      datasets: [
        {
          data: cantidades,
          label: 'Ventas Predichas',
          borderColor: '#4c84ff',
          backgroundColor: 'rgba(76, 132, 255, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: data.map(d =>
            d.dimFecha.esFinDeSemana ? '#ff6b6b' : '#4c84ff'
          ),
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    };

    // Configurar gráfico de barras
    this.barChartData = {
      labels: labels,
      datasets: [
        {
          data: cantidades,
          label: 'Ventas Predichas',
          backgroundColor: coloresBarras,
          borderColor: coloresBarras.map(color => color.replace('0.8', '1')),
          borderWidth: 1,
          borderRadius: 4
        }
      ]
    };
  }

  private formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
  }

  private calcularEstadisticas(data: Prediccion[]): void {
    const cantidades = data.map(d => d.cantidadPredicha);

    this.estadisticas = {
      total: cantidades.reduce((sum, val) => sum + val, 0),
      promedio: cantidades.reduce((sum, val) => sum + val, 0) / cantidades.length,
      maximo: Math.max(...cantidades),
      minimo: Math.min(...cantidades),
      diasFinSemana: data.filter(d => d.dimFecha.esFinDeSemana).length,
      diasLaborables: data.filter(d => !d.dimFecha.esFinDeSemana).length
    };
  }

  public cambiarVista(vista: 'lineas' | 'barras' | 'tabla'): void {
    this.vistaActual = vista;
  }

  public obtenerClaseTipoDia(tipoDia: string): string {
    switch (tipoDia) {
      case 'PrevioFeriado': return 'badge-warning';
      case 'Normal': return 'badge-success';
      default: return 'badge-secondary';
    }
  }
}