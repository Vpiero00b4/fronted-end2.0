import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms'; // Agregar esta importación
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    LoginComponent,
  ],      
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule, // Agregar ReactiveFormsModule aquí
    SharedModule,
    HttpClientModule // Si necesitas HttpClient, lo importas aquí
  ]
})
export class AuthModule { }
