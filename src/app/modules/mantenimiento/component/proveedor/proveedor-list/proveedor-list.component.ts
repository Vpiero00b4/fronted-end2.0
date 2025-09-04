import { Component } from '@angular/core';
import { ProveedorResponse } from '../../../../../models/proveedor-response.models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProveedorService } from '../../../service/proveedor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedor-list',
  templateUrl: './proveedor-list.component.html',
  styleUrl: './proveedor-list.component.css'
})
export class ProveedorListComponent {
  proveedores: ProveedorResponse[] = [];
  formFiltro: FormGroup;
  mostrarModalProveedor = false;
  accionModal = 1; // 1 = Crear, 2 = Editar
  proveedorSeleccionado: ProveedorResponse = new ProveedorResponse();
  constructor(
    private proveedorService: ProveedorService,
    private fb: FormBuilder
  ) {
    this.formFiltro = this.fb.group({
      filtroRazonSocial: ['']
    });
  }

  ngOnInit(): void {
    this.obtenerProveedores();
  }
  paginaActual: number = 1;

  // Cantidad de elementos por página
  elementosPorPagina: number = 10;
  obtenerProveedores(): void {
    this.proveedorService.getAll().subscribe({
      next: (data) => this.proveedores = data,
      error: (err) => console.error('Error al obtener proveedores', err)
    });
  }

  // Lista filtrada para la página actual
  get proveedoresPaginados() {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.proveedores.slice(inicio, fin);
  }

  // Total de páginas
  get totalPaginas() {
    return Math.ceil(this.proveedores.length / this.elementosPorPagina);
  }

  // Cambiar de página
  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  aplicarFiltro() {
    const filtro = this.formFiltro.get('filtroRazonSocial')?.value.toLowerCase();
    this.proveedores = this.proveedores.filter(p => p.razonSocial.toLowerCase().includes(filtro));
  }
  abrirModalCrear() {
    this.accionModal = 1;
    this.proveedorSeleccionado = new ProveedorResponse();
    this.mostrarModalProveedor = true;
  }
  abrirModalEditar(proveedor: ProveedorResponse) {
    this.accionModal = 2;
    this.proveedorSeleccionado = { ...proveedor };
    this.mostrarModalProveedor = true;
  }

  cerrarModalProveedor(actualizo: boolean) {
    this.mostrarModalProveedor = false;
    if (actualizo) {
      this.obtenerProveedores();
    }
  }

  eliminarProveedor(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.proveedorService.delete(id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El proveedor fue eliminado.', 'success');
            this.obtenerProveedores();
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar al proveedor.', 'error');
          }
        });
      }
    });
  }
}
