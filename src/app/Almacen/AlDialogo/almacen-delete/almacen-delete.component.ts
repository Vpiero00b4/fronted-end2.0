import { Component,Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Autor } from '../../../Interface/autor';
import { Almacen } from '../../../Interface/almacen';
@Component({
  selector: 'app-almacen-delete',
  templateUrl: './almacen-delete.component.html',
  styleUrl: './almacen-delete.component.scss'
})
export class AlmacenDeleteComponent {
  constructor(
    private dialogoReferencia:MatDialogRef<AlmacenDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public dataAlmacen:Almacen
  ){

  }

  ngOnInit(): void {
  }

  confirmarEliminar(){
    if(this.dataAlmacen){
      this.dialogoReferencia.close("Eliminar")
    }
  }
}
