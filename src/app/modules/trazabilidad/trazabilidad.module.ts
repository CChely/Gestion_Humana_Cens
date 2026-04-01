import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrazabilidadRoutingModule } from './trazabilidad-routing.module';
import { TrazabilidadComponent } from './trazabilidad.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';


@NgModule({
  declarations: [
    TrazabilidadComponent
  ],
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule,
    TrazabilidadRoutingModule
  ],
  exports: [
    TrazabilidadComponent 
  ]
})
export class TrazabilidadModule { }
