import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentoImpresionRoutingModule } from './documento-impresion-routing.module';
import { DocumentoImpresionComponent } from './documento-impresion.component';

@NgModule({
  declarations: [
    DocumentoImpresionComponent
  ],
  imports: [
    CommonModule,
    DocumentoImpresionRoutingModule
  ]
})
export class DocumentoImpresionModule { }