import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Autor } from '../../../Interface/autor';
import { AutorService } from '../../../Services/autor.service';

@Component({
  selector: 'app-dialog-new',
  templateUrl: './autor-new.component.html',
  styleUrl: './autor-new.component.scss'
})
export class AutorNewComponent implements OnInit {
  formAutor: FormGroup = this.fb.group({
    idAutor:['',[]],
    descripcion: [this.dataAutor?.descripcion || '', [Validators.required]]
  });

  tituloAccion: string = "Nuevo";
  botonAccion: string = "Guardar";
  listaAutor: Autor[] = [];

  constructor(
    private dialogoReferencia: MatDialogRef<AutorNewComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _autorServicio: AutorService,
    @Inject(MAT_DIALOG_DATA) public dataAutor: Autor
 ) {
    this.formAutor = this.fb.group({
       idAutor: [this.dataAutor?.idAutor || '', []],
       descripcion: [this.dataAutor?.descripcion || '', [Validators.required]]
    });
 }
 mostrarAlerta(msg: string, accion: string) {
  this._snackBar.open(msg, accion,{
    horizontalPosition:"end",
    verticalPosition:"top",
    duration:3000
  })
}
newAutor(){
console.log(this.formAutor);
console.log(this.formAutor.value);

  const modelo : Autor={
    idAutor:0,
    descripcion:this.formAutor.value.descripcion
  }
  this._autorServicio.add(modelo).subscribe({
    next:(data)=>{
      this.mostrarAlerta("Autor Creado","Listo")
      this.dialogoReferencia.close("creado")
    },error:(e)=>{
      this.mostrarAlerta("No se puede crear","Error")
    }
  })
}


  ngOnInit(): void {
    
  }
}
