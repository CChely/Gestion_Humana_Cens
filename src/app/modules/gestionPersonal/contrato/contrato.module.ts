import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContratoRoutingModule } from './contrato-routing.module';
import { ContratoComponent } from './contrato.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

@NgModule({
  declarations: [
    ContratoComponent
  ],
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule,
    ContratoRoutingModule
  ]
})
export class ContratoModule { }