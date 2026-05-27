import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RepresentanteLegalComponent } from './representante-legal.component';

const routes: Routes = [
    { path: '', component: RepresentanteLegalComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepresentanteLegalRoutingModule { }
