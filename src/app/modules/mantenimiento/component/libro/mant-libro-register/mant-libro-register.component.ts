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
    private _libroService: LibroService
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
      idCategoria: [null, [Validators.required]],
      idTipoPapel: [null, [Validators.required]],
      idProveedor: [null, [Validators.required]],
    });
  }
  ngOnInit(): void {

    console.log("title==>", this.title)
    console.log("title==>", this.libro)

    this.myFormL.patchValue(this.libro);
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
        alert("creado de forma  coorerctae");
      },

      error: () => {
        
        alert("Ocurrio un error en crear");
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
}