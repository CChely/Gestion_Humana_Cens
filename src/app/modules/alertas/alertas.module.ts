import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertasRoutingModule } from './alertas-routing.module';
import { AlertasComponent } from './alertas.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    AlertasComponent
  ],
  imports: [
    MatIconModule,
    MatButtonModule,
    CommonModule,
    AlertasRoutingModule
  ]
})
export class AlertasModule { }
