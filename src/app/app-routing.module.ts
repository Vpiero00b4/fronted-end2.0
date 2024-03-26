import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

import { WelcomeComponent } from './pages/welcome/welcome.component';
import { PruebaComponent } from './pages/prueba/prueba.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'prueba', component: PruebaComponent },

  { path: '404', component: NotFoundComponent },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(x => x.AuthModule)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    
    loadChildren: () => import('./modules/template/template.module').then(x => x.TemplateModule)
  },

  {
    path: 'reportes',
    loadChildren: () => import('./modules/mantenimiento/mantenimiento.module').then(x => x.MantenimientoModule)
  },
  
  // { path: 'categoria', component: CategoriaComponent },
  // { path: 'almacen', component: AlmacenComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
