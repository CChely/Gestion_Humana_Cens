import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VencimientoContratoComponent } from './vencimiento-contrato.component';

const routes: Routes = [
    { path: '', component: VencimientoContratoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VencimientoContratoRoutingModule { }
