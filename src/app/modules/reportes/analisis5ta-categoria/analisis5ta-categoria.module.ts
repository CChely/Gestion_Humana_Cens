import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Analisis5taCategoriaRoutingModule } from './analisis5ta-categoria-routing.module';
import { Analisis5taCategoriaComponent } from './analisis5ta-categoria.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

@NgModule({
  declarations: [
    Analisis5taCategoriaComponent
  ],
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule,
    Analisis5taCategoriaRoutingModule
  ]
})
export class Analisis5taCategoriaModule { }