import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MantPersonaListComponent } from './component/persona/mant-persona-list/mant-persona-list.component';
import { MantLibroListComponent } from './component/libro/mant-libro-list/mant-libro-list.component';
import { MantUsuarioListComponent } from './component/usuario/mant-usuario-list/mant-usuario-list.component';
import { MantReporteInventarioComponent } from './component/inventarioc/mant-inventa-list/mant-reporte-inventario.component';
import { ProveedorListComponent } from './component/proveedor/proveedor-list/proveedor-list.component';
import { SubCategoriaListComponent } from './component/subCategoria/sub-categoria-list/sub-categoria-list.component';

const routes: Routes = [
  {
    path: 'persona', component: MantPersonaListComponent

  },

  {
    path: 'libro', component: MantLibroListComponent
  },
  {
    path: 'usuario', component: MantUsuarioListComponent
  },

  {
    path: 'proveedor', component: ProveedorListComponent
  },
  {
    path: 'subcategoria', component: SubCategoriaListComponent
  },
  {
    path: 'reporte-inventario', component: MantReporteInventarioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenimientoRoutingModule { }
