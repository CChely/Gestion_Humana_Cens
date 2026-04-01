import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VencimientoContratoRoutingModule } from './vencimiento-contrato-routing.module';
import { VencimientoContratoComponent } from './vencimiento-contrato.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';


@NgModule({
  declarations: [
    VencimientoContratoComponent
  ],
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule,
    VencimientoContratoRoutingModule
  ]
})
export class VencimientoContratoModule { }
