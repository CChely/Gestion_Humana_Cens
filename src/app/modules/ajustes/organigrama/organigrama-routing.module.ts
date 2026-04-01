import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganigramaComponent } from './organigrama.component';

const routes: Routes = [
    { path: '', component: OrganigramaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganigramaRoutingModule { }
