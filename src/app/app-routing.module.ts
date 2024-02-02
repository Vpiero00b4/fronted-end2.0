import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutorComponent } from './Autor/autor.component';
import { AppComponent } from './app.component';
import { InicioComponent } from './Inicio/inicio.component';
import {CategoriaComponent} from './Categoria/categoria.component'
import { AlmacenComponent } from './Almacen/almacen.component';

const routes: Routes = [
  { path: 'home', component: InicioComponent }, // o cualquier componente que desees mostrar en la página de inicio
  { path: 'autor', component: AutorComponent },
  {path: 'categoria', component:CategoriaComponent},
  {path:'almacen',component:AlmacenComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
