import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MantVentaListComponent } from './component/venta/mant-venta-list/mant-venta-list.component';
import { MantVentaRegisterComponent } from './component/venta/mant-venta-register/mant-venta-register.component';
import { FventaRegisterComponent } from './component/Fventa/Fventaregister/mant-fventa-register/mant-fventa-register.component';

const routes: Routes = [

  {
    path:'venta',component:MantVentaListComponent
  },
  { 
    path: 'mant-venta-register', component: MantVentaRegisterComponent 
  } ,
  { 
    path: 'mant-venta-registred', component: FventaRegisterComponent
  } 
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentaRoutingModule { }
