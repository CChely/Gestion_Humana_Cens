import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaestroEmpleadoRoutingModule } from './maestro-empleado-routing.module';
import { MaestroEmpleadoComponent } from './maestro-empleado.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

@NgModule({
  declarations: [
    MaestroEmpleadoComponent
  ],
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MaestroEmpleadoRoutingModule
  ]
})
export class MaestroEmpleadoModule { }