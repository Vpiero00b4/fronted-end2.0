import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Almacen } from '../../../Interface/almacen';
import { almacenService } from '../../../Services/almacen.service';
@Component({
  selector: 'app-almacen-new',
  templateUrl: './almacen-new.component.html',
  styleUrl: './almacen-new.component.scss'
})
export class AlmacenNewComponent {
  formAlmacen: FormGroup = this.fb.group({
    idAlmacen:['',[]],
    nroEstante: [this.dataAlmacen?.nroEstante || '', [Validators.required]],
    libroEstante:[this.dataAlmacen?.librosEstante || '',[Validators.required]],
    ubicacion:[this.dataAlmacen?.ubicacion || '',[Validators.required]]
  });

  tituloAccion: string = "Nuevo";
  botonAccion: string = "Guardar";
  listaAlmacen: Almacen[] = [];

  constructor(
    private dialogoReferencia: MatDialogRef<AlmacenNewComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _almacenServicio: almacenService,
    @Inject(MAT_DIALOG_DATA) public dataAlmacen: Almacen
 ) {
    this.formAlmacen = this.fb.group({
       idAlmacen: [this.dataAlmacen?.idAlmacen || '', []],
       nroEstante: [this.dataAlmacen?.nroEstante || '', [Validators.required]],
       libroEstante:[this.dataAlmacen?.librosEstante || '',[Validators.required]],
       ubicacion:[this.dataAlmacen?.ubicacion || '',[Validators.required]]
    });
 }
 mostrarAlerta(msg: string, accion: string) {
  this._snackBar.open(msg, accion,{
    horizontalPosition:"end",
    verticalPosition:"top",
    duration:3000
  })
}
newAlmacen(){
console.log(this.formAlmacen);
console.log(this.formAlmacen.value);

  const modelo : Almacen={
    idAlmacen:0,
    nroEstante:this.formAlmacen.value.nroEstante,
    librosEstante:this.formAlmacen.value.libroEstante,
    ubicacion:this.formAlmacen.value.ubicacion
  }
  this._almacenServicio.add(modelo).subscribe({
    next:(data)=>{
      this.mostrarAlerta("Almcaen Creado","Listo")
      this.dialogoReferencia.close("creado")
    },error:(e)=>{
      this.mostrarAlerta("No se puede crear","Error")
    }
  })
}


  ngOnInit(): void {
    
  }
}
