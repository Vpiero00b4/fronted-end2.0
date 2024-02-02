import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

import { Autor } from '../Interface/autor'; 
import { AutorService } from '../Services/autor.service';
import { HttpHeaders } from '@angular/common/http';
import { AlmacenAddEditComponent } from './AlDialogo/almacen-add-edit/almacen-add-edit.component';
import { AlmacenNewComponent } from './AlDialogo/almacen-new/almacen-new.component';
import { AlmacenDeleteComponent } from './AlDialogo/almacen-delete/almacen-delete.component';

import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Almacen } from '../Interface/almacen';
import { almacenService } from '../Services/almacen.service';



@Component({
  selector: 'app-almacen',
  templateUrl: './almacen.component.html',
  styleUrl: './almacen.component.scss'
})
export class AlmacenComponent {
  displayedColumns: string[] = ['nroEstante','librosEstante','ubicacion','Acciones'];
  dataSource = new MatTableDataSource<Almacen>();
  constructor(
    private _almacenServicio:almacenService,
    public dialog: MatDialog,
    private _snackBar:MatSnackBar

    ){
    
  }
  ngOnInit(): void {
    this.mostrarAlmacen()
  }


  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  mostrarAlmacen() {
    
    this._almacenServicio.getList().subscribe({
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

  NuevoAlmacen() {
    const dialogRef = this.dialog.open(AlmacenNewComponent, {
      disableClose: true,
      width: "350px",
    });
  
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado === "creado") {
        this.mostrarAlmacen();
      }
    });
  }
  

  editarAlmacen(dataAlmacen:Almacen){
    this.dialog.open(AlmacenAddEditComponent,{
      disableClose:true,
      width:"350px",
      data:dataAlmacen
    }).afterClosed().subscribe(resultado => {
      if(resultado === "Editado"){
        this.mostrarAlmacen();
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

DialogoEliminarComponent(dataAlmacen:Almacen){
  this.dialog.open(AlmacenDeleteComponent,{
    disableClose:true,
    data:dataAlmacen
  }).afterClosed().subscribe(resultado => {
    ;
    if( resultado === "Eliminar"){
      this._almacenServicio.delete(dataAlmacen.idAlmacen).subscribe({
        next:(data)=>{ 
          this.mostrarAlerta("Autor fue Eliminado","Listo");
          this.mostrarAlmacen();
        },error:(e)=>{ ; console.log(e)}
      })
    }
  })

}
}
