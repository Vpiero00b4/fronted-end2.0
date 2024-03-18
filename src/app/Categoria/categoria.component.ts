import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

import { Categorium } from '../Interface/categorium';
import { CategoriaService } from '../Services/categoria.service';
import { HttpHeaders } from '@angular/common/http';

import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';

import { CategoriaAddEditComponent } from './CDialogo/categoria-add-edit/categoria-add-edit.component';

import { CategoriaDeleteComponent } from './CDialogo/categoria-delete/categoria-delete.component';
import { CategoriaNewComponent } from './CDialogo/categoria-new/categoria-new.component';


@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.scss'
})
export class CategoriaComponent  implements AfterViewInit,OnInit{
  displayedColumns: string[] = ['nombreCategoria','Acciones'];
  dataSource = new MatTableDataSource<Categorium>();
  constructor(
    private _categoriaServicio:CategoriaService,
    public dialog: MatDialog,
    private _snackBar:MatSnackBar

    ){
    
  }
  ngOnInit(): void {
    this.mostrarcategoria()
  }


  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  mostrarcategoria() {
    
    this._categoriaServicio.getList().subscribe({
      next: (dataResponse) => {
        this.dataSource.data = dataResponse;
      },
      error: (e) => {
        console.error(e);
      }
    });
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };    
  }

  Nuevocategoria() {
    const dialogRef = this.dialog.open(CategoriaNewComponent, {
      disableClose: true,
      width: "350px",
    });
  
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado === "creado") {
        this.mostrarcategoria();
      }
    });
  }
  

  editarcategoria(datacategoria:Categorium){
    this.dialog.open(CategoriaAddEditComponent,{
      disableClose:true,
      width:"350px",
      data:datacategoria
    }).afterClosed().subscribe(resultado => {
      if(resultado === "Editado"){
        this.mostrarcategoria();
      }
    })
}
mostrarAlerta(msg: string, accion: string) {
  this._snackBar.open(msg, accion,{
    horizontalPosition:"end",
    verticalPosition:"top",
    duration:3000
  })
}

DialogoEliminarComponent(datacategoria:Categorium){
  this.dialog.open(CategoriaDeleteComponent,{
    disableClose:true,
    data:datacategoria
  }).afterClosed().subscribe(resultado => {
    ;
    if( resultado === "Eliminar"){
      this._categoriaServicio.delete(datacategoria.idCategoria).subscribe({
        next:(data)=>{ 
          this.mostrarAlerta("Categoria Eliminada","Listo");
          this.mostrarcategoria();
        },error:(e)=>{ ; console.log(e)}
      })
    }
  })

}
}
