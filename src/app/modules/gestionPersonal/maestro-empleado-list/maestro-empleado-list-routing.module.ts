import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaestroEmpleadoListComponent } from './maestro-empleado-list.component';

const routes: Routes = [
    { path: '', component: MaestroEmpleadoListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaestroEmpleadoListRoutingModule { }
