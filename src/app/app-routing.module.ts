import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutorComponent } from './Autor/autor.component';
import { AppComponent } from './app.component';
import { InicioComponent } from './Inicio/inicio.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { PruebaComponent } from './pages/prueba/prueba.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { authGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: 'welcome', component:WelcomeComponent }, // o cualquier componente que desees mostrar en la página de inicio
  { path: 'prueba', component:PruebaComponent }, // o cualquier componente que desees mostrar en la página de inicio
  { path: 'home', component: InicioComponent }, // o cualquier componente que desees mostrar en la página de inicio
  { path: 'autor', component: AutorComponent },
  { path: '404', component:NotFoundComponent },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(x => x.AuthModule)
  },
  {
    path: 'dashboard',
    canActivate:[authGuard],
    loadChildren: () => import('./modules/template/template.module').then(x => x.TemplateModule)
  },
 
  {
    path: 'reportes',
    loadChildren: () => import('./modules/mantenimiento/mantenimiento.module').then(x => x.MantenimientoModule)
  },
  // Puedes comentar o eliminar el objeto vacío
  // {
  // },
  // Si intentabas agregar una redirección, aquí está la sintaxis correcta:
  // {
  //   path: '',
  //   redirectTo: '/404',
  //   pathMatch: 'full'
  // }
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
