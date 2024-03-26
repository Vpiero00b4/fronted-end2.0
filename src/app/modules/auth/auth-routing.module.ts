import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path:'', component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), FormsModule], // Mueve FormsModule dentro del arreglo de imports
  exports: [RouterModule]
})
export class AuthRoutingModule { }
