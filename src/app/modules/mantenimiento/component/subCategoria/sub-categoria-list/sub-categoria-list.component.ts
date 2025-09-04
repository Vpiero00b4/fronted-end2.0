import { Component, OnInit } from '@angular/core';
import { Categoria, SubCategoria } from '../../../../../models/libro-request.models';
import { SubCategoriaService } from '../../../service/sub-categoria.service';
import { CategoriaService } from '../../../service/categoria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sub-categoria-list',
  templateUrl: './sub-categoria-list.component.html',
  styleUrl: './sub-categoria-list.component.css'
})
export class SubCategoriaListComponent implements OnInit {
  subcategorias: SubCategoria[] = [];
  subcategoriaSeleccionada: SubCategoria = {} as SubCategoria;

  mostrarModalSubcategoria: boolean = false;
  accionModal: number = 1; // 1 = Crear, 2 = Editar

  constructor(
    private subcategoriaService: SubCategoriaService,
    private categoriaService: CategoriaService
  ) { }

  ngOnInit(): void {
    this.listarSubcategorias();
  }

  listarSubcategorias(): void {
    this.subcategoriaService.getList().subscribe({
      next: (subs: SubCategoria[]) => {
        this.subcategorias = subs;

        // Cargar nombre de categoría
        this.subcategorias.forEach(sub => {
          if (sub.idCategoria) {
            this.categoriaService.getCategoriaById(sub.idCategoria).subscribe((cat: Categoria) => {
              sub.categoriaNombre = cat ? cat.categoria1 : 'Sin categoría';
            });
          } else {
            sub.categoriaNombre = 'Sin categoría';
          }
        });
      },
      error: (err) => console.error('Error al listar subcategorías', err)
    });
  }

  crearSubcategoria() {
    this.accionModal = 1;
    this.subcategoriaSeleccionada = {} as SubCategoria;
    this.mostrarModalSubcategoria = true;
    console.log("click");

  }

  editarSubcategoria(sub: SubCategoria) {
    this.accionModal = 2;
    this.subcategoriaSeleccionada = { ...sub };
    this.mostrarModalSubcategoria = true;
  }
  cerrarModalSubcategoria(actualizo: boolean): void {
    this.mostrarModalSubcategoria = false;
    if (actualizo) {
      this.listarSubcategorias();
    }
  }

  eliminarSubcategoria(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then(result => {
      if (result.isConfirmed) {
        this.subcategoriaService.delete(id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'La subcategoría ha sido eliminada.', 'success');
            this.listarSubcategorias();
          },
          error: (err) => {
            console.error('Error al eliminar subcategoría:', err);
            Swal.fire('Error', 'No se pudo eliminar la subcategoría.', 'error');
          }
        });
      }
    });
  }


  paginaActual: number = 1;
  elementosPorPagina: number = 10;

  // Lista paginada
  get subcategoriasPaginadas() {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.subcategorias.slice(inicio, fin);
  }

  // Total de páginas
  get totalPaginas() {
    return Math.ceil(this.subcategorias.length / this.elementosPorPagina);
  }

  // Cambiar página
  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

}
