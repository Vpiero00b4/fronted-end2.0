import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';

//controles de formulariosa
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core';
import { MomentDateModule } from '@angular/material-moment-adapter';

//alertas
import{MatSnackBarModule} from '@angular/material/snack-bar'

//iconos de material
import { MatCommonModule } from '@angular/material/core';

//modales de material
import {MatDialogModule} from '@angular/material/dialog'

//cuadriculas
import {MatGridListModule} from '@angular/material/grid-list'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { DialogAddEditComponent } from './Autor/Dialogo/dialog-add-edit/dialog-add-edit.component';
import { DialogoDeleteComponent } from './Autor/Dialogo/dialogo-delete/dialogo-delete.component';
import { AutorComponent } from './Autor/autor.component';
import { InicioComponent } from './Inicio/inicio.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DialogNewComponent } from './Autor/Dialogo/dialog-new/dialog-new.component';





@NgModule({
  declarations: [
    AppComponent,
    DialogAddEditComponent,
    DialogoDeleteComponent,
    AutorComponent,
    InicioComponent,
    DialogNewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MomentDateModule,
    MatSnackBarModule,
    MatCommonModule,
    MatDialogModule,
    MatGridListModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatToolbarModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
