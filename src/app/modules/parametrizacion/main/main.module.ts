import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { PeriodoCalculoComponent } from './components/periodo-calculo/periodo-calculo.component';
import { ComisionesSpComponent } from './components/comisiones-sp/comisiones-sp.component';
import { TasasImpuestoComponent } from './components/tasas-impuesto/tasas-impuesto.component';
import { NominasRegimenComponent } from './components/nominas-regimen/nominas-regimen.component';
import { AportesEmpleadorComponent } from './components/aportes-empleador/aportes-empleador.component';
import { ConceptosComponent } from './components/conceptos/conceptos.component';
import { NominaAprobadoresComponent } from './components/nomina-aprobadores/nomina-aprobadores.component';
import { ValoresGeneralesComponent } from './components/valores-generales/valores-generales.component';
import { CamposAdicionalesComponent } from './components/campos-adicionales/campos-adicionales.component';
import { PeriodoComponent } from './components/periodo/periodo.component';
import { IncrementoSalarialComponent } from './components/incremento-salarial/incremento-salarial.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [
    MainComponent,
    PeriodoCalculoComponent,
    ComisionesSpComponent,
    TasasImpuestoComponent,
    NominasRegimenComponent,
    AportesEmpleadorComponent,
    ConceptosComponent,
    NominaAprobadoresComponent,
    ValoresGeneralesComponent,
    CamposAdicionalesComponent,
    PeriodoComponent,
    IncrementoSalarialComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule
  ]
})
export class MainModule { }


