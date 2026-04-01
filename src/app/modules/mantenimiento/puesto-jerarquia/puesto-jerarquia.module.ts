import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PuestoJerarquiaRoutingModule } from './puesto-jerarquia-routing.module';
import { PuestoJerarquiaComponent } from './puesto-jerarquia.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';


@NgModule({
  declarations: [
    PuestoJerarquiaComponent
  ],
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule,
    PuestoJerarquiaRoutingModule
  ]
})
export class PuestoJerarquiaModule { }
