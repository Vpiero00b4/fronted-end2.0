import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccionMantConst } from '../../../../../constans/general.constans';
import { LibroResponse } from '../../../../../models/libro-response.models';
import { LibroRequest } from '../../../../../models/libro-request.models';
import { LibroService } from '../../../service/libro.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { alert_error, alert_success, convertToBoolean } from '../../../../../../functions/general.functions';

@Component({
  selector: 'app-mant-libro-register',
  templateUrl: './mant-libro-register.component.html',
  styleUrl: './mant-libro-register.component.css'
})
export class MantLibroRegisterComponent implements OnInit {
  // VARIABLES DE ENTRADA
  @Input() title: string = "";
  @Input() libro: LibroResponse = new LibroResponse();
  @Input() accion: number = 0;
  // VARIABLES DE SALIDA
  @Output() closeModalEmmit = new EventEmitter<boolean>();

  // VARIABLES INTERNAS
  myFormL: FormGroup;
  libroEnvio: LibroRequest = new LibroRequest();
  archivoSeleccionado: File | null = null;   // <- Debe ser propiedad de la clase

  constructor(
    private fb: FormBuilder,
    private _libroService: LibroService
  ) {
    // Construcción del formulario reactivo
    this.myFormL = this.fb.group({
      idLibro: [{ value: 0, disabled: true }, [Validators.required]],
      titulo: [null, [Validators.required]],
      isbn: [null, [Validators.required]],
      tamanno: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
      condicion: [null, [Validators.required]],
      impresion: [null, [Validators.required]],
      tipoTapa: [null, [Validators.required]],
      estado: [null, [Validators.required]],
      idSubcategoria: [null, [Validators.required]],
      idTipoPapel: [null, [Validators.required]],
      idProveedor: [null, [Validators.required]],
      imagen: [null]
    });
  }

  ngOnInit(): void {
    this.myFormL.patchValue(this.libro);
    if (this.accion === AccionMantConst.crear) {
      this.myFormL.patchValue({ imagen: '' });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoSeleccionado = input.files[0];
    } else {
      this.archivoSeleccionado = null;
    }
    // Si quieres limpiar el control imagen:
    this.myFormL.get('imagen')?.setValue(null);
  }

  cargarLibro(libroId: number) {
    this._libroService.getLibroById(libroId).subscribe({
      next: (libro: LibroResponse) => {
        this.myFormL.patchValue({
          idLibro: libro.idLibro,
          titulo: libro.titulo,
          isbn: libro.isbn,
          tamanno: libro.tamanno,
          descripcion: libro.descripcion,
          condicion: libro.condicion,
          impresion: libro.impresion,
          tipoTapa: libro.tipoTapa,
          estado: libro.estado,
          idSubcategoria: libro.idSubcategoria,
          idTipoPapel: libro.idTipoPapel,
          idProveedor: libro.idProveedor,
          imagen: libro.imagen
        });
      },
      error: (err) => {
        console.error('Error al cargar el libro: ', err);
      }
    });
  }

  guardarlibro() {
    this.libroEnvio = this.myFormL.getRawValue();
    this.libroEnvio.estado = convertToBoolean(this.libroEnvio.estado.toString());
    switch (this.accion) {
      case AccionMantConst.crear:
        this.crearRegistro();
        break;
      case AccionMantConst.editar:
        this.editarRegistro();
        break;
      case AccionMantConst.eliminar:
        break;
    }
  }

  crearRegistro() {
    const formData = new FormData();
    const valores = this.myFormL.getRawValue();

    formData.append('Titulo', valores.titulo);
    formData.append('Isbn', valores.isbn);
    formData.append('Tamanno', valores.tamanno);
    formData.append('Descripcion', valores.descripcion);
    formData.append('Condicion', valores.condicion);
    formData.append('Impresion', valores.impresion);
    formData.append('TipoTapa', valores.tipoTapa);
    formData.append('Estado', valores.estado ? 'true' : 'false');
    formData.append('IdSubcategoria', valores.idSubcategoria.toString());
    formData.append('IdTipoPapel', valores.idTipoPapel.toString());
    formData.append('IdProveedor', valores.idProveedor.toString());

    if (this.archivoSeleccionado) {
      formData.append('imageFile', this.archivoSeleccionado);
    }

    this._libroService.crearLibro(formData).subscribe({
      next: (data: LibroResponse) => {
        alert_success("Creado de forma correcta");
        this.cerrarModal();
      },
      error: () => {
        alert_error("Error", "Ocurrió un error al crear libro");
      }
    });
  }

  editarRegistro() {
    this._libroService.update(this.libroEnvio).subscribe({
      next: (data: LibroResponse) => {
        alert_success("Guardado exitoso");
      },
      error: () => {
        alert_error("Formulario inválido", "Por favor completa los campos obligatorios.");
      },
      complete: () => {
        this.cerrarModal();
      }
    });
  }

  cerrarModal() {
    this.closeModalEmmit.emit(true);
  }

  // Si usas normalizarImagen, puedes dejarlo:
  normalizarImagen(valor: string) {
    const imagenControl = this.myFormL.get('imagen');
    if (!imagenControl) return;

    if (valor.trim().toLowerCase() === 'null' || valor.trim() === '') {
      imagenControl.setValue(null);
    } else {
      imagenControl.setValue(valor);
    }
  }
}
