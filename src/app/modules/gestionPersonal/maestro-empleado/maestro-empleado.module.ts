import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaestroEmpleadoRoutingModule } from './maestro-empleado-routing.module';
import { MaestroEmpleadoComponent } from './maestro-empleado.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { SearchSelectComponent } from '../../components/search-select-component/search-select-component.component';

@NgModule({
  declarations: [
    MaestroEmpleadoComponent
  ],
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MaestroEmpleadoRoutingModule,
    FormsModule,
    SearchSelectComponent
  ]
})
export class MaestroEmpleadoModule { }
