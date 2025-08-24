import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { Categoria, SubCategoria } from '../../../../../models/libro-request.models';
import { SubCategoriaService } from '../../../service/sub-categoria.service';
import { CategoriaService } from '../../../service/categoria.service';

@Component({
  selector: 'app-sub-categoria-register',
  templateUrl: './sub-categoria-register.component.html',
  styleUrl: './sub-categoria-register.component.css'
})
export class SubCategoriaRegisterComponent implements OnInit {
  @Input() accion: number = 1; // 1 = Crear, 2 = Editar
  @Input() subcategoria: SubCategoria = {} as SubCategoria;
  @Output() closeModalEmmit = new EventEmitter<boolean>();

  form: FormGroup;
  categorias: Categoria[] = [];

  constructor(
    private fb: FormBuilder,
    private subcategoriaService: SubCategoriaService,
    private categoriaService: CategoriaService
  ) {
    this.form = this.fb.group({
      descripcion: ['', Validators.required],
      idCategoria: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarCategorias();

    if (this.accion === 2 && this.subcategoria && this.subcategoria.id) {
      this.form.patchValue({
        descripcion: this.subcategoria.descripcion,
        idCategoria: this.subcategoria.idCategoria
      });
    }
  }

  cargarCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (data: Categoria[]) => {
        this.categorias = data;
      },
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      Swal.fire('Error', 'Complete todos los campos obligatorios', 'error');
      return;
    }

    const subcategoriaEnvio: SubCategoria = {
      ...this.subcategoria,
      descripcion: this.form.value.descripcion,
      idCategoria: this.form.value.idCategoria
    };

    if (this.accion === 1) {
      // Crear
      this.subcategoriaService.createSubcategoria(subcategoriaEnvio).subscribe({
        next: () => Swal.fire('¡Creado!', 'Subcategoría creada correctamente', 'success'),
        error: () => Swal.fire('Error', 'Ocurrió un error al crear', 'error'),
        complete: () => this.cerrarModal(true)
      });
    } else if (this.accion === 2) {
      // Editar
      this.subcategoriaService.update(subcategoriaEnvio).subscribe({
        next: () => Swal.fire('Actualizado', 'Subcategoría actualizada correctamente', 'success'),
        error: () => Swal.fire('Error', 'Ocurrió un error al actualizar', 'error'),
        complete: () => this.cerrarModal(true)
      });
    }
  }

  cerrarModal(res: boolean): void {
    this.closeModalEmmit.emit(res);
  }
  cancelar(): void {
    this.closeModalEmmit.emit(false);
  }
}
