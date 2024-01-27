import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutorComponent } from './Autor/autor.component';
import { AppComponent } from './app.component';
import { InicioComponent } from './Inicio/inicio.component';

const routes: Routes = [
  { path: 'home', component: InicioComponent }, // o cualquier componente que desees mostrar en la página de inicio
  { path: 'autor', component: AutorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
