import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { VentaRoutingModule } from './venta-routing.module';
import { MantVentaListComponent } from './component/venta/mant-venta-list/mant-venta-list.component'; // Asegúrate de que la ruta del componente sea correcta
import { RouterModule } from '@angular/router';
import { LibroModalComponentComponent } from './component/LibroModalComponent/libro-modal-component/libro-modal-component.component';
import { MantCajaRegisterComponent } from './component/venta/mant-caja-register/mant-caja-register.component';
import { MantCajaListComponent } from './component/venta/caja-venta-list/mant-caja-list/mant-caja-list.component';
import { FventaRegisterComponent } from './component/Fventa/Fventaregister/mant-fventa-register.component';
import { FpagoComponent } from './component/Fventa/Fpago/fpago.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ProveedorListComponent } from './component/proveedor/proveedor-list/proveedor-list.component';
import { ProveedorRegisterComponent } from './component/proveedor/proveedor-register/proveedor-register.component';




@NgModule({
  declarations: [
    MantVentaListComponent,
    FventaRegisterComponent,
    LibroModalComponentComponent,
    MantCajaRegisterComponent,
    MantCajaListComponent,
    FpagoComponent,

    
    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    VentaRoutingModule,
    FormsModule,
    RouterModule,
    NgxExtendedPdfViewerModule
]
})
export class VentaModule { }
