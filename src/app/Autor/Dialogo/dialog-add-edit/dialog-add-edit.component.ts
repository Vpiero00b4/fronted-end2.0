import { Component,Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder,FormGroup,ValidationErrors,Validators } from '@angular/forms';
import { MatDialog, MatDialogRef , MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import*as moment from 'moment';

import { Autor } from '../../../Interface/autor';
import { AutorService } from '../../../Services/autor.service';



@Component({
  selector: 'app-dialog-add-edit',
  templateUrl: './dialog-add-edit.component.html',
  styleUrl: './dialog-add-edit.component.css'
})
export class DialogAddEditComponent implements OnInit{
  
  formAutor: FormGroup;
  tituloAccion : string="Nuevo";
  botonAccion : string="guardar";
  listaAutor:Autor[]=[];
  constructor(

    private dialogoReferencia:MatDialogRef<DialogAddEditComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _autorServicio:AutorService,
    @Inject(MAT_DIALOG_DATA) public dataAutor:Autor

  ){
    this.formAutor=this.fb.group({
      idAutor:['',[]],
      descripcion:[this.dataAutor.descripcion,[Validators.required]]
    })

    // this._autorServicio.getList().subscribe({
    //   next:(data)=>{
    //   this.listaAutor=data;},
    //   error:(e)=>{}
    // })
    

  }
  mostrarAlerta(msg: string, accion: string) {
    this._snackBar.open(msg, accion,{
      horizontalPosition:"end",
      verticalPosition:"top",
      duration:3000
    })
  }

  addEditAutor(){
    debugger
    console.log(this.formAutor.value)
    const modelo : Autor={
      idAutor:this.formAutor.value.idAutor,
      descripcion:this.formAutor.value.descripcion
    }
    this._autorServicio.update(modelo.descripcion,modelo).subscribe({
      next:(data)=>{
        this.mostrarAlerta("Autor actualizado","listo");
        this.dialogoReferencia.close("creado");
      },error:(e)=>{
        this.mostrarAlerta("No se Pudo Actualiar","Error");
      }
    })
  }

  
  ngOnInit(): void {
    this.formAutor.patchValue(this.dataAutor);
    //   this.formAutor.patchValue({
    // if (this.dataAutor) {
    //     ID_Autor: this.dataAutor.idAutor,
    //     Descripcion: this.dataAutor.Descripcion
    //   });
  
    //   this.tituloAccion = "Editar";
    //   this.botonAccion = "Actualizar";
    // }
  }
  
}
