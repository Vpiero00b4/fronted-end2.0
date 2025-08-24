import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateComponent } from './component/template/template.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { PrediccionComponent } from '../prediccion-component/prediccion-component.component';

const routes: Routes = [
  {
    path: '', component: TemplateComponent,
    children: [
      {
        path: 'mantenimiento',
        loadChildren: () => import("./../mantenimiento/mantenimiento.module").then(x => x.MantenimientoModule),
      },
      { path: 'prediccion/libro', component: PrediccionComponent },
      {
        path: 'ventas',
        loadChildren: () => import("./../mantenimiento/venta.module").then(x => x.VentaModule),
      },
      {
        path: '', component: DashboardComponent  // <-- esto carga el dashboard por defecto
      },


    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplateRoutingModule { }
