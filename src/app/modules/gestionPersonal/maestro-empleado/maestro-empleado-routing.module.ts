import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaestroEmpleadoComponent } from './maestro-empleado.component';

const routes: Routes = [
    { path: '', component: MaestroEmpleadoComponent },
    { path: ':id', component: MaestroEmpleadoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaestroEmpleadoRoutingModule { }
