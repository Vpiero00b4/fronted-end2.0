import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { VentaRoutingModule } from './venta-routing.module';
import { MantVentaListComponent } from './component/venta/mant-venta-list/mant-venta-list.component'; // Asegúrate de que la ruta del componente sea correcta
import { MantVentaRegisterComponent } from './component/venta/mant-venta-register/mant-venta-register.component'; // Asegúrate de que la ruta del componente sea correcta
import { RouterModule } from '@angular/router';
import { FventaRegisterComponent } from './component/Fventa/Fventaregister/mant-fventa-register/mant-fventa-register.component';
import { LibroModalComponentComponent } from './component/LibroModalComponent/libro-modal-component/libro-modal-component.component';

@NgModule({
  declarations: [
    MantVentaListComponent,
    MantVentaRegisterComponent,
    FventaRegisterComponent,
    LibroModalComponentComponent
    
    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    VentaRoutingModule,
    FormsModule,
    RouterModule
 
  ]
})
export class VentaModule { }
