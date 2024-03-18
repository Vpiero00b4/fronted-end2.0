import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    LoginComponent,

    
  ],      
  imports: [
    CommonModule,
    AuthRoutingModule,
    // FormsModule,
    // ReactiveFormsModule,
    SharedModule
    
    
  ]
})
export class AuthModule { }
