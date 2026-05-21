import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaestroEmpleadoListRoutingModule } from './maestro-empleado-list-routing.module';
import { MaestroEmpleadoListComponent } from './maestro-empleado-list.component';


@NgModule({
  declarations: [
    MaestroEmpleadoListComponent
  ],
  imports: [
    CommonModule,
    MaestroEmpleadoListRoutingModule
  ]
})
export class MaestroEmpleadoListModule { }
