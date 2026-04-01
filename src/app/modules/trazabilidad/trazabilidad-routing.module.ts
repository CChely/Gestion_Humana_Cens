import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrazabilidadComponent } from './trazabilidad.component';

const routes: Routes = [
  { path: '', component: TrazabilidadComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrazabilidadRoutingModule { }
