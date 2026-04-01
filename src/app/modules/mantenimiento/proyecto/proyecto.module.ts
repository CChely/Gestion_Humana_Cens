import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProyectoRoutingModule } from './proyecto-routing.module';
import { ProyectoComponent } from './proyecto.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { ReactiveFormsModule } from '@angular/forms';
import { TrazabilidadModule } from '../../trazabilidad/trazabilidad.module';

@NgModule({
  declarations: [
    ProyectoComponent
  ],
  imports: [
    CommonModule,
    ProyectoRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    TrazabilidadModule
  ]
})
export class ProyectoModule { }