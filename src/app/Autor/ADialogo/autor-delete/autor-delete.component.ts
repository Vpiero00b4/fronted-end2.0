import { Component,Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Autor } from '../../../Interface/autor';


@Component({
  selector: 'app-dialogo-delete',
  templateUrl: './autor-delete.component.html',
  styleUrl: './autor-delete.component.css'
})
export class AutorDeleteComponent  implements OnInit{

  constructor(
    private dialogoReferencia:MatDialogRef<AutorDeleteComponent>,
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
