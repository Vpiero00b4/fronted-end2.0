import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
//import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormsModule,  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    LoginComponent
    
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    
    
    //FormGroup
    
  ]
})
export class AuthModule { }
