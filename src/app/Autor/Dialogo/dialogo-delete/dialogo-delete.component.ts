import { Component,Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Autor } from '../../../Interface/autor';


@Component({
  selector: 'app-dialogo-delete',
  templateUrl: './dialogo-delete.component.html',
  styleUrl: './dialogo-delete.component.css'
})
export class DialogoDeleteComponent  implements OnInit{

  constructor(
    private dialogoReferencia:MatDialogRef<DialogoDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public dataAutor:Autor
  ){

  }

  ngOnInit(): void {
  }

  confirmarEliminar(){
    if(this.dataAutor){
      this.dialogoReferencia.close("Eliminar")
    }
  }

}
