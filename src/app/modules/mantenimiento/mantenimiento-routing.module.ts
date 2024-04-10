import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MantPersonaListComponent } from './component/persona/mant-persona-list/mant-persona-list.component';
import { MantLibroListComponent } from './component/libro/mant-libro-list/mant-libro-list.component';
import { MantUsuarioListComponent } from './component/usuario/mant-usuario-list/mant-usuario-list.component';
import { MantReporteInventarioComponent } from './component/inventarioc/mant-inventa-list/mant-reporte-inventario.component';

const routes: Routes = [
  {
    path:'persona',component:MantPersonaListComponent

  },
  
  { 
    path:'libro',component:MantLibroListComponent
  },
  { 
    path:'usuario',component:MantUsuarioListComponent
  },
  
  
  
  { 
    path:'reporte-inventario',component:MantReporteInventarioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenimientoRoutingModule { }
