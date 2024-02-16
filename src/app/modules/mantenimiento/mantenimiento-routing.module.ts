import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MantPersonaListComponent } from './component/persona/mant-persona-list/mant-persona-list.component';
import { MantGeneroListComponent } from './component/genero/mant-genero-list/mant-genero-list.component';

const routes: Routes = [
  {
    path:'persona',component:MantPersonaListComponent

  },
  {
    path:'genero',component:MantGeneroListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenimientoRoutingModule { }
