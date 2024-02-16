import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { MantPersonaListComponent } from './component/persona/mant-persona-list/mant-persona-list.component';
import { MantPersonaRegisterComponent } from './component/persona/mant-persona-register/mant-persona-register.component';


@NgModule({
  declarations: [
    MantPersonaListComponent,
    MantPersonaRegisterComponent,
    
  ],
  imports: [
    CommonModule,
    MantenimientoRoutingModule,
    
  ]
})
export class MantenimientoModule { }
