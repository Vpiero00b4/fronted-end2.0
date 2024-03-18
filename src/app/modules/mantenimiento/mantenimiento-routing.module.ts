import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MantPersonaListComponent } from './component/persona/mant-persona-list/mant-persona-list.component';
import { MantGeneroListComponent } from './component/genero/mant-genero-list/mant-genero-list.component';
import { MantLibroListComponent } from './component/libro/mant-libro-list/mant-libro-list.component';
import { MantUsuarioListComponent } from './component/usuario/mant-usuario-list/mant-usuario-list.component';

const routes: Routes = [
  {
    path:'persona',component:MantPersonaListComponent

  },
  {
    path:'genero',component:MantGeneroListComponent
  },
  { 
    path:'libro',component:MantLibroListComponent
  },
  { 
    path:'usuario',component:MantUsuarioListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenimientoRoutingModule { }
