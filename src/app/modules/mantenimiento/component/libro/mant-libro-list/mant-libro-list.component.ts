import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AccionMantConst } from '../../../../../constans/general.constans'; // Reemplaza 'ruta/del/archivo' con la ruta correcta
import { LibroResponse } from '../../../../../models/libro-response.models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DetalleVentaResponse } from '../../../../../models/detallle-venta-response.models';
import { CategoriaResponse } from '../../../../../models/categoria-response.models';
import { CategoriaService } from '../../../service/categoria.service';
import { SubcategoriaService } from '../../../service/subcategoria.service';
import { SubcategoriaResponse } from '../../../../../models/subcategoria-response.models';
import { LibroService } from '../../../service/libro.service';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-mant-libro-list',
  templateUrl: './mant-libro-list.component.html',
  styleUrls: ['./mant-libro-list.component.css']
})
export class MantLibroListComponent implements OnInit {
  filtroForm: FormGroup;
  filtroFormCategorias: FormGroup;
  librosFiltrados!: LibroResponse[];
  libros: LibroResponse[] = [];
  subcategorias: SubcategoriaResponse[] = [];
  categorias: CategoriaResponse[] = [];
  
  productosAgregados: DetalleVentaResponse[] = [];
  modalRef?: BsModalRef;
  libroSelected: LibroResponse = new LibroResponse();
  titleModal: string = "";
  accionModal: number = 0;
  currentPage: number = 1;
  totalPages: number = 0;
  totalItems: number = 0;
  // myFormFilter: FormGroup;

  constructor(
    private _route: Router,
    private _libroService: LibroService,
    private modalService: BsModalService,
    private _categoriaService: CategoriaService,
    private _subcategoriaService: SubcategoriaService,
    private formBuilder: FormBuilder)
    {
      this.filtroFormCategorias = this.formBuilder.group({
        idSubcategoria: ['']  // Asegúrate de que coincide con el formControlName en el HTML.
      });
    
  
    // Inicializa el formulario de filtro dentro del constructor
    this.filtroForm = this.formBuilder.group({
      
      idCategoria: [''],
      estadoDescripcion: [false], // Campo para filtrar por estado
      idSubcategoria: [''], // Campo para filtrar por categoría
    },
    
    this.filtroFormCategorias = this.formBuilder.group({
      idSubcategoria: [6] // Campo para filtrar por categoría
    }));

    // Inicializa el formulario de filtro dentro del constructor
    this.filtroFormCategorias = this.formBuilder.group({
      idLibro: [{ value: 0, disabled: true }, [Validators.required]],
      titulo: [null, []],
      isbn: [null, []],
      tamanno: [null, []],
      descripcion: [null, []],
      condicion: [null, []],
      impresion: [null, []],
      tipoTapa: [null, []],
      estado: [null, []],
      idSubcategoria: [''],
      idTipoPapel: [null, []],
      idProveedor: [null, []],
      estadoDescripcion: [null, []],
      tipoPapelDescripcion: [null, []],
      idCategoria: ['', Validators.required],
            });
  }

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarSubcategorias();
    this.listarLibros();
    this.loadInventoryData(this.currentPage, 15);

  }
  cargarSubcategorias() {
    this._subcategoriaService.getSubcategorias().subscribe(subcategorias => {
      this.subcategorias = subcategorias;
    });
  }
  cargarCategorias() {
    this._categoriaService.getCategorias().subscribe(categorias => {
      this.categorias = categorias;
      console.log('Categorías cargadas:', this.categorias); // Esto te mostrará las categorías cargadas
    }, error => {
      console.error('Error al cargar categorías:', error);
    });
  }
  getDescripcionCategoria(idSubcategoria: number): string {
    // Encuentra la subcategoría correspondiente al libro
    const subcategoria = this.subcategorias.find(sc => sc.id === idSubcategoria);
  
    // Si se encuentra la subcategoría, utiliza su Id_Categoria para encontrar la categoría correspondiente
    if (subcategoria) {
      const categoria = this.categorias.find(c => c.idCategoria === subcategoria.idCategoria);
      // Asegúrate de devolver el nombre de la categoría, no el ID.
      return categoria ? categoria.categoria1 : 'Categoría no encontrada';
    } else {
      return 'Subcategoría no encontrada';
    }
  }
  
  listarLibros() {
    this._libroService.getAll().subscribe({
      next: (data: LibroResponse[]) => {
        this.libros = data;
        console.log('Libros cargados:', this.libros); // Aquí puedes revisar cada idCategoria de los libros.
        // Por ejemplo, para probar si las categorías coinciden
        this.libros.forEach(libro => {
          const categoria = this.categorias.find(c => c.idCategoria === libro.idCategoria);
        });
      },
      error: (err) => {
        console.log("error", err);
      }
    });
  }
  

  crearLibro(template: TemplateRef<any>) {
    this.libroSelected = new LibroResponse();
    this.titleModal = "NUEVO LIBRO"
    this.accionModal = AccionMantConst.crear;
    this.openModal(template);
  }

  editarLibro(template: TemplateRef<any>, libro: LibroResponse) {
    this.libroSelected = libro;
    this.titleModal = "EDIT LIBRO"
    this.accionModal = AccionMantConst.editar;
    this.openModal(template);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  getCloseModalEmmit(res: boolean) {
    this.modalRef?.hide();
    if (res) {
      this.listarLibros();
    }
  }

  eliminarRegistro(id: number) {
    let result = confirm("¿Está seguro de eliminar el registro?");
    if (result) {
      this._libroService.delete(id).subscribe({
        next: (data: number) => {
          alert("Registro eliminado de forma correcta");
        },
        error: () => { },
        complete: () => {
          this.listarLibros();
        }
      });
    }
  }

  filtrar() {
    const estadoDescripcion = this.filtroForm.value.estadoDescripcion;
  
    // Filtrar los libros según el estado seleccionado
    this.librosFiltrados = this.libros.filter(libro =>
      (!estadoDescripcion || libro.estadoDescripcion === estadoDescripcion)
    );
  }
  filtrarPorCategoria() {
    const idCategoria = this.filtroForm.value.idCategoria;
    console.log("Filtrando por categoría con ID:", idCategoria); // Muestra el ID de la categoría seleccionada
  
    if (idCategoria) {
      this._categoriaService.getCategoriasConLibros(idCategoria).subscribe({
        next: (libros: LibroResponse[]) => {
          console.log("Libros recibidos para la categoría:", libros); // Muestra los libros recibidos
          this.librosFiltrados = libros;
        },
        error: (err) => {
          console.error('Error fetching books for category:', err);
        }
      });
    } else {
      console.log("No se seleccionó ninguna categoría, cargando todos los libros.");
      this.listarLibros(); // Si no hay categoría seleccionada, cargar todos los libros
    }
  }
  
  
  listarLibrosPorCategoria(idSubcategoria: number) {
    this._subcategoriaService.getLibrosBySubcategoria(idSubcategoria).subscribe({
      next: (data: LibroResponse[]) => {
        // Actualiza la lista de libros filtrados para mostrar solo los que corresponden a la subcategoría
        this.librosFiltrados = data;
      },
      error: (err) => {
        console.error("Error al obtener libros por subcategoría", err);
      }
    });
  }
  buscarLibro(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const consulta = inputElement.value.trim();
  
    if (!consulta) {
      // Si la consulta está vacía, mostrar todos los libros
      this.listarLibros();
      return;
    }
    
    // Filtrar los libros según la consulta
    this.librosFiltrados = this.libros.filter(libro =>
      libro.titulo.toLowerCase().includes(consulta.toLowerCase())
      //AGREGAR isbn 
    );
  }
  filtrarPorCategoriaYSubcategoria() {
    const idCategoria = this.filtroForm.value.idCategoria;
    const idSubcategoria = this.filtroForm.value.idSubcategoria;
  
    console.log("Filtrando por categoría con ID:", idCategoria, "y subcategoría con ID:", idSubcategoria);
  
    if (idCategoria && idSubcategoria) {
      // Filtrar por categoría y subcategoría simultáneamente si ambos están presentes
      this._categoriaService.getCategoriasConLibros(idCategoria).subscribe({
        next: libros => {
          this.librosFiltrados = libros;
          console.log("Libros filtrados por categoría y subcategoría:", libros);
        },
        error: error => console.error('Error al filtrar libros por categoría y subcategoría:', error)
      });
    } else if (idCategoria) {
      // Filtrar solo por categoría si solo idCategoria está presente
      this._categoriaService.getCategoriasConLibros(idCategoria).subscribe({
        next: libros => {
          this.librosFiltrados = libros;
          console.log("Libros filtrados por categoría:", libros);
        },
        error: error => console.error('Error al filtrar libros por categoría:', error)
      });
    } else if (idSubcategoria) {
      // Filtrar solo por subcategoría si solo idSubcategoria está presente
      this._subcategoriaService.getLibrosBySubcategoria(idSubcategoria).subscribe({
        next: libros => {
          this.librosFiltrados = libros;
          console.log("Libros filtrados por subcategoría:", libros);
        },
        error: error => console.error('Error al filtrar libros por subcategoría:', error)
      });
    } else {
      // Si no se seleccionó ninguna categoría ni subcategoría, mostrando todos los libros
      console.log("No se seleccionó ninguna categoría ni subcategoría, mostrando todos los libros.");
      this.listarLibros();
    }
  }
  loadInventoryData(pageIndex: number, pageSize: number): void {
    this._libroService.getAllPaginated(pageIndex, pageSize).pipe(
      switchMap(response => {
        if (response.libros && response.libros.length > 0) {
          this.totalPages = response.totalPages;
          this.currentPage = response.currentPage;
          this.totalItems = response.totalItems;
  
          const detailsObservables = response.libros.map(libro => 
            forkJoin({
              libro: of(libro),
              precio: this._libroService.getUltimoPrecioByLibroId(libro.idLibro).pipe(catchError(() => of(null))),
              stock: this._libroService.getKardexByLibroId(libro.idLibro).pipe(
                catchError((error) => {
                  console.error('Error al obtener el stock:', error);
                  return of(0); // Proporciona un valor predeterminado en caso de error
                })
              )
            }).pipe(
              map(({ libro, precio }) => ({
                ...libro,
                precioVenta: precio?.precioVenta ?? 0,
                porcUtilidad: precio?.porcUtilidad ?? 0,
                idPrecios: precio?.idPrecios ?? 0,
              }))
            )
          );
  
          return forkJoin(detailsObservables);
        } else {
          return of([]);
        }
      })
    ).subscribe({
      next: librosConDetalles => {
        this.libros = librosConDetalles;
      },
      error: e => console.error(e)
    });
  }
  
  
  onPageChange(newPageIndex: number): void {
    this.currentPage = newPageIndex;
    this.loadInventoryData(newPageIndex, 10);
  }
}