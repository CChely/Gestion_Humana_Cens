import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PuestoJerarquiaComponent } from './puesto-jerarquia.component';

const routes: Routes = [
    { path: '', component: PuestoJerarquiaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PuestoJerarquiaRoutingModule { }
