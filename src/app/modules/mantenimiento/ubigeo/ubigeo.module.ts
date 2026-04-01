import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UbigeoRoutingModule } from './ubigeo-routing.module';
import { UbigeoComponent } from './ubigeo.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    UbigeoComponent
  ],
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule,
    UbigeoRoutingModule
  ]
})
export class UbigeoModule { }
