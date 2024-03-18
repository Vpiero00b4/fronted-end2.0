import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { MantPersonaListComponent } from './component/persona/mant-persona-list/mant-persona-list.component';
import { MantPersonaRegisterComponent } from './component/persona/mant-persona-register/mant-persona-register.component';
import { SharedModule } from '../shared/shared.module';
import { MantGeneroListComponent } from './component/genero/mant-genero-list/mant-genero-list.component';
import { MantGeneroRegisterComponent } from './component/genero/mant-genero-register/mant-genero-register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MantLibroListComponent } from './component/libro/mant-libro-list/mant-libro-list.component';
import { MantLibroRegisterComponent } from './component/libro/mant-libro-register/mant-libro-register.component';
import { MantUsuarioListComponent } from './component/usuario/mant-usuario-list/mant-usuario-list.component';
import { MantUsuarioRegisterComponent } from './component/usuario/mant-usuario-register/mant-usuario-register.component';

@NgModule({
  declarations: [
    MantGeneroListComponent,
    MantGeneroRegisterComponent,
    MantPersonaListComponent,
    MantPersonaRegisterComponent,
    MantLibroListComponent,
    MantLibroRegisterComponent,
    MantUsuarioListComponent,
    MantUsuarioRegisterComponent
  
    
  ],
  imports: [
    CommonModule,
    MantenimientoRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class MantenimientoModule { }
  