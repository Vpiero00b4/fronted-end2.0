import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CrudService } from './services/crud.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    
    ModalModule.forRoot(),
    HttpClientModule,// sin este no podemos comnsumir servicios web
    
  ],
  exports:[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    
    ModalModule

  ]
})
export class SharedModule { }
