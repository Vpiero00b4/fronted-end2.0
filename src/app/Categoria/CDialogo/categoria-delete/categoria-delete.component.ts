import { Component,Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Autor } from '../../../Interface/autor';
import { Categorium } from '../../../Interface/categorium';


@Component({
  selector: 'app-categoria-dialogo-delete',
  templateUrl: './categoria-delete.component.html',
  styleUrl: './categoria-delete.component.css'
})
export class CategoriaDeleteComponent  implements OnInit{

  constructor(
    private dialogoReferencia:MatDialogRef<CategoriaDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public dataCategoria:Categorium
  ){

  }

  ngOnInit(): void {
  }

  confirmarEliminar(){
    if(this.dataCategoria){
      this.dialogoReferencia.close("Eliminar")
    }
  }

}
