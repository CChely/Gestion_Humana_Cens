import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CargaMasivaRoutingModule } from './carga-masiva-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { CargaMasivaComponent } from './carga-masiva.component';


@NgModule({
  declarations: [CargaMasivaComponent],
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule,
    CargaMasivaRoutingModule
  ]
})
export class CargaMasivaModule { }
