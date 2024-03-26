import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MantPersonaListComponent } from './component/persona/mant-persona-list/mant-persona-list.component';
import { MantGeneroListComponent } from './component/genero/mant-genero-list/mant-genero-list.component';
import { MantLibroListComponent } from './component/libro/mant-libro-list/mant-libro-list.component';
import { MantUsuarioListComponent } from './component/usuario/mant-usuario-list/mant-usuario-list.component';
import { MantReporteInventarioComponent } from './component/inventarioc/mant-inventa-list/mant-reporte-inventario.component';
import { MantClienteListComponent } from './component/cliente/cliente/mant-cliente-list/mant-cliente-list.component';

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
  { 
    path:'cliente',component:MantClienteListComponent
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
