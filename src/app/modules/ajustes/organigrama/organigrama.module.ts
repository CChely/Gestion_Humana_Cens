import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganigramaRoutingModule } from './organigrama-routing.module';
import { OrganigramaComponent } from './organigrama.component';

@NgModule({
  declarations: [
    OrganigramaComponent
  ],
  imports: [
    CommonModule,
    OrganigramaRoutingModule
  ]
})
export class OrganigramaModule { }