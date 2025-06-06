import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { MantPersonaListComponent } from './component/persona/mant-persona-list/mant-persona-list.component';
import { MantPersonaRegisterComponent } from './component/persona/mant-persona-register/mant-persona-register.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MantLibroListComponent } from './component/libro/mant-libro-list/mant-libro-list.component';
import { MantLibroRegisterComponent } from './component/libro/mant-libro-register/mant-libro-register.component';
import { MantUsuarioListComponent } from './component/usuario/mant-usuario-list/mant-usuario-list.component';
import { MantUsuarioRegisterComponent } from './component/usuario/mant-usuario-register/mant-usuario-register.component';
import { MantReporteInventarioComponent } from './component/inventarioc/mant-inventa-list/mant-reporte-inventario.component';
import { MantVentaRegisterComponent } from './component/venta/mant-venta-register/mant-venta-register.component';

@NgModule({
  declarations: [
    MantPersonaListComponent,
    MantPersonaRegisterComponent,
    MantLibroListComponent,
    MantLibroRegisterComponent,
    MantUsuarioListComponent,
    MantUsuarioRegisterComponent,
    MantReporteInventarioComponent,
    MantVentaRegisterComponent,
    
    

  ],
  imports: [
    CommonModule,
    MantenimientoRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
   
  ]
})
export class MantenimientoModule { }
