import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CrudService } from './services/crud.service';
import { Highlight } from '../../pipes/Highlight';

@NgModule({
  declarations: [
    // Añade aquí tu HighlightPipe
    Highlight,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    HttpClientModule, // Sin este no podemos consumir servicios web
  ],
  exports: [
    // Exporta CommonModule, FormsModule, ReactiveFormsModule, y ModalModule para reutilizarlos en otros módulos
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    // Además, exporta HighlightPipe para que pueda ser utilizado en los componentes de los módulos que importan SharedModule
    Highlight,
  ],
  providers: [
    // Aunque aquí no se muestra, es buen lugar para incluir servicios que serán utilizados a lo largo de tu aplicación
    CrudService,
  ]
})
export class SharedModule { }
