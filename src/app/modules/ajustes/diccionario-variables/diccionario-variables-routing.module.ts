import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiccionarioVariablesComponent } from './diccionario-variables.component';

const routes: Routes = [
    { path: '', component: DiccionarioVariablesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiccionarioVariablesRoutingModule { }
