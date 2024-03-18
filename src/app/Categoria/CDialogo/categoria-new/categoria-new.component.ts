import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


import { CategoriaService } from '../../../Services/categoria.service';
import { Categorium } from '../../../Interface/categorium';

@Component({
  selector: 'app-dialog-new',
  templateUrl: './categoria-new.component.html',
  styleUrl: './categoria-new.component.scss'
})
export class CategoriaNewComponent implements OnInit {
    formCategoria: FormGroup = this.fb.group({
    idCategoria:['',[]],
    nombreCategoria: [this.dataCategoria?.nombreCategoria || '', [Validators.required]]
  });

  tituloAccion: string = "Nuevo";
  botonAccion: string = "Guardar";
  listaAutor: Categorium[] = [];

  constructor(
    private dialogoReferencia: MatDialogRef<CategoriaNewComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _categoriaServicio: CategoriaService,
    @Inject(MAT_DIALOG_DATA) public dataCategoria: Categorium
 ) {
    this.formCategoria = this.fb.group({
       idCategoria: [this.dataCategoria?.idCategoria || '', []],
       nombreCategoria: [this.dataCategoria?.nombreCategoria || '', [Validators.required]]
    });
 }
 mostrarAlerta(msg: string, accion: string) {
  this._snackBar.open(msg, accion,{
    horizontalPosition:"end",
    verticalPosition:"top",
    duration:3000
  })
}
newCategoria() {
  const modelo: Categorium = {
    idCategoria: 0,
    nombreCategoria: this.formCategoria.value.nombreCategoria 
  };

  this._categoriaServicio.add(modelo).subscribe({
    next: (data) => {
      this.mostrarAlerta("Categoria Creada", "Listo");
      this.dialogoReferencia.close("creado");
    },
    error: (e) => {
      this.mostrarAlerta("No se puede crear", "Error");
    }
  });
}



  ngOnInit(): void {
    
  }
}
