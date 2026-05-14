import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaestroAreasComponent } from './maestro-areas.component';

const routes: Routes = [
    { path: '', component: MaestroAreasComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaestroAreasRoutingModule { }
