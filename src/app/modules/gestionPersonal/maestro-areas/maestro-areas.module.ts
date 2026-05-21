import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaestroAreasRoutingModule } from './maestro-areas-routing.module';
import { MaestroAreasComponent } from './maestro-areas.component';
import { FormsModule } from '@angular/forms';
import { TrazabilidadModule } from '../../trazabilidad/trazabilidad.module';
import { SearchSelectComponent } from '../../components/search-select-component/search-select-component.component';


@NgModule({
  declarations: [
    MaestroAreasComponent
  ],
  imports: [
    CommonModule,
    MaestroAreasRoutingModule,
    FormsModule,
    TrazabilidadModule,
    SearchSelectComponent
  ]
})
export class MaestroAreasModule { }
