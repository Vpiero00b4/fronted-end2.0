import { Component,Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder,FormGroup,ValidationErrors,Validators } from '@angular/forms';
import { MatDialog, MatDialogRef , MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import*as moment from 'moment';

import { CategoriaService } from '../../../Services/categoria.service';

import { Categorium } from '../../../Interface/categorium';



@Component({
  selector: 'app-dialog-add-edit',
  templateUrl: './categoria-add-edit.component.html',
  styleUrl: './categoria-add-edit.component.scss'
})
export class CategoriaAddEditComponent implements OnInit{
  
  formCategoria: FormGroup;
  tituloAccion : string="Nuevo";
  botonAccion : string="guardar";
  listaCategoria:Categorium[]=[];
  constructor(

    private dialogoReferencia:MatDialogRef<CategoriaAddEditComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _categoriaServicio:CategoriaService,
    @Inject(MAT_DIALOG_DATA) public dataCategoria:Categorium

  ){
    this.formCategoria=this.fb.group({
      idCategoria:['',[]],
      nombreCategoria:[this.dataCategoria.nombreCategoria,[Validators.required]]
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

  addEditCategoria(){
    
    console.log(this.formCategoria.value)
    const modelo : Categorium={
      idCategoria:this.formCategoria.value.idCategoria,
      nombreCategoria:this.formCategoria.value.nombreCategoria
    }
    this._categoriaServicio.update(modelo.nombreCategoria,modelo).subscribe({
      next:(data)=>{
        this.mostrarAlerta("Autor actualizado","listo");
        this.dialogoReferencia.close("creado");
      },error:(e)=>{
        this.mostrarAlerta("No se Pudo Actualiar","Error");
      }
    })
  }

  
  ngOnInit(): void {
    this.formCategoria.patchValue(this.dataCategoria);
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
