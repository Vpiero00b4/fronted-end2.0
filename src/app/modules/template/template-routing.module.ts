import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateComponent } from './component/template/template.component';

const routes: Routes = [
  {
      path:'',component:TemplateComponent,
      children:[
        {
          path: 'mantenimiento',
          loadChildren: () => import("./../mantenimiento/mantenimiento.module").then(x => x.MantenimientoModule),
        },
        {
          path: 'reportes',
          loadChildren: () => import("./../mantenimiento/mantenimiento.module").then(x => x.MantenimientoModule)  // Supuse que existe un módulo de reportes
        },  
        {
          path: 'configuracion',
          loadChildren: () => import("./../mantenimiento/mantenimiento.module").then(x => x.MantenimientoModule)  // Supuse que existe un módulo de reportes
        },  
      ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplateRoutingModule { }
