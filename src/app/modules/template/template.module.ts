import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplateRoutingModule } from './template-routing.module';
import { TemplateHeaderComponent } from './component/template-header/template-header.component';
import { TemplateFooterComponent } from './component/template-footer/template-footer.component';
import { TemplateSidebarComponent } from './component/template-sidebar/template-sidebar.component';
import { TemplateComponent } from './component/template/template.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    TemplateHeaderComponent,
    TemplateFooterComponent,
    TemplateSidebarComponent,
    TemplateComponent
  ],
  imports: [
    CommonModule,
    TemplateRoutingModule,
    SharedModule
    
  ]
})
export class TemplateModule { }
