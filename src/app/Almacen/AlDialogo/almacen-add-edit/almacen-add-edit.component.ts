import { Component,Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder,FormGroup,ValidationErrors,Validators } from '@angular/forms';
import { MatDialog, MatDialogRef , MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import*as moment from 'moment';
import { Almacen } from '../../../Interface/almacen';
import { almacenService } from '../../../Services/almacen.service';


@Component({
  selector: 'app-almacen-add-edit',
  templateUrl: './almacen-add-edit.component.html',
  styleUrl: './almacen-add-edit.component.scss'
})
export class AlmacenAddEditComponent {
  formAlmacen: FormGroup;
  tituloAccion : string="Nuevo";
  botonAccion : string="guardar";
  listaAutor:Almacen[]=[];
  constructor(

    private dialogoReferencia:MatDialogRef<AlmacenAddEditComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _almacenServicio:almacenService,
    @Inject(MAT_DIALOG_DATA) public dataAlmacen:Almacen

  ){
    this.formAlmacen=this.fb.group({
      idAlmacen:['',[]],
      nroEstante:[this.dataAlmacen.nroEstante,[Validators.required]],
      librosEstante:[this.dataAlmacen.librosEstante,[Validators.required]],
      ubicacion:[this.dataAlmacen.ubicacion,[Validators.required]]
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

  addEditAlmacen(){
    debugger
    console.log(this.formAlmacen.value)
    const modelo : Almacen={
      idAlmacen:this.formAlmacen.value.idAlmacen,
      nroEstante:this.formAlmacen.value.nroEstante,
      librosEstante:this.formAlmacen.value.librosEstante,
      ubicacion:this.formAlmacen.value.ubicacion
    }
    this._almacenServicio.update(modelo.nroEstante,modelo.librosEstante,modelo.ubicacion,modelo).subscribe({
      next:(data)=>{
        this.mostrarAlerta("Autor actualizado","listo");
        this.dialogoReferencia.close("creado");
      },error:(e)=>{
        this.mostrarAlerta("No se Pudo Actualiar","Error");
      }
    })
  }

  
  ngOnInit(): void {
    this.formAlmacen.patchValue(this.dataAlmacen);
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
