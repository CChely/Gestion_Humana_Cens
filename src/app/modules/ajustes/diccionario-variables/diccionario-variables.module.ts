import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiccionarioVariablesRoutingModule } from './diccionario-variables-routing.module';
import { DiccionarioVariablesComponent } from './diccionario-variables.component';


@NgModule({
  declarations: [
    DiccionarioVariablesComponent
  ],
  imports: [
    CommonModule,
    DiccionarioVariablesRoutingModule
  ]
})
export class DiccionarioVariablesModule { }
