import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UbigeoComponent } from './ubigeo.component';

const routes: Routes = [
    { path: '', component: UbigeoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UbigeoRoutingModule { }
