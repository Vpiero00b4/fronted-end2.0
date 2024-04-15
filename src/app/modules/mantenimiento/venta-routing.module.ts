import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MantVentaListComponent } from './component/venta/mant-venta-list/mant-venta-list.component';
import { FventaRegisterComponent } from './component/Fventa/Fventaregister/mant-fventa-register/mant-fventa-register.component';
import { MantCajaListComponent } from './component/venta/caja-venta-list/mant-caja-list/mant-caja-list.component';
import { MantCajaRegisterComponent } from './component/venta/mant-caja-register/mant-caja-register.component';

const routes: Routes = [

  {
    path:'venta',component:MantVentaListComponent
  },
  
  { 
    path: 'mant-venta-registred', component: FventaRegisterComponent
  } ,
  { 
    path: 'caja-list', component: MantCajaListComponent
  }, 
  
  {
    path: 'caja-register', component: MantCajaRegisterComponent
  }, 
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentaRoutingModule { }
