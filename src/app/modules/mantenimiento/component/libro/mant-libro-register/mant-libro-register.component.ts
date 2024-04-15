import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccionMantConst } from '../../../../../constans/general.constans';
import { LibroResponse } from '../../../../../models/libro-response.models';
import { LibroRequest } from '../../../../../models/libro-request.models';
import { LibroService } from '../../../service/libro.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { convertToBoolean } from '../../../../../../functions/general.functions';

@Component({
  selector: 'app-mant-libro-register',
  templateUrl: './mant-libro-register.component.html',
  styleUrl: './mant-libro-register.component.css'
})

export class MantLibroRegisterComponent implements OnInit{
  //DECLARANDO VARIABLES DE ENTRADA 
  @Input() title: string = "";
  @Input() libro: LibroResponse = new LibroResponse;
  @Input() accion: number = 0;
  //DECLARANDO VARIABLES DE SALIDA 
  @Output() closeModalEmmit = new EventEmitter<boolean>();


  //DECLARANDO VARIABLES INTERNAS
  myFormL: FormGroup;
  libroEnvio: LibroRequest = new LibroRequest();
  //DECLARANDO CONSTRUCTOR 
  constructor(
    private fb : FormBuilder,
    private _libroService: LibroService,
    
  )
  {
    //nuestro formulario libro request
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
      imagen: [null, [Validators.required]],
    });
  }
  ngOnInit(): void {

    console.log("title==>", this.title)
    console.log("title==>", this.libro)

    this.myFormL.patchValue(this.libro);
    if (this.accion === AccionMantConst.crear) {
      this.myFormL.patchValue({ imagen: '../../../../../../assets/imagenes/sinimagen.jpg' });
      
    }
    
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
          imagen: libro.imagen // Asegúrate de que este campo está siendo actualizado
        });
      },
      error: (err) => {
        console.error('Error al cargar el libro: ', err);
      }
    });
  }

  guardarlibro(){
    this.libroEnvio = this.myFormL.getRawValue();
    this.libroEnvio.estado=convertToBoolean(this.libroEnvio.estado.toString());
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
  
  crearRegistro(){
    this._libroService.create(this.libroEnvio).subscribe({
      next: (data: LibroResponse) => {
        alert("creado de forma  correcta");
      },

      error: () => {
        
        alert("Ocurrio un error en crear libro");
      },
      complete: () => {
        this.cerrarModal(true);
      }

    })

  }
  editarRegistro(){
    this._libroService.update(this.libroEnvio).subscribe({
      next: (data: LibroResponse) => {

        alert("Actualizado de forma correct");
      },
      error: () => {
        
        alert("Ocurrio un error en editar");
      },
      complete: () => {
        this.cerrarModal(true);
      }
    })
  }
  cerrarModal(res: boolean)

  {
    this.closeModalEmmit.emit(res);

  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null; // Asegurarse de que hay un archivo seleccionado
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.myFormL.patchValue({ imagen: reader.result as string });
      };
      reader.readAsDataURL(file);
    } else {
      console.log("No se ha seleccionado ningún archivo.");
      // Puedes manejar aquí cómo deseas proceder si no hay archivo seleccionado.
      // Por ejemplo, podrías dejar la imagen por defecto o mostrar un mensaje al usuario.
    }
  }
  
  
}