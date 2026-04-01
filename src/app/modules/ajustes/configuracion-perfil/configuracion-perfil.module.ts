import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionPerfilRoutingModule } from './configuracion-perfil-routing.module';
import { ConfiguracionPerfilComponent } from './configuracion-perfil.component';
import { TrazabilidadModule } from '../../trazabilidad/trazabilidad.module';


@NgModule({
  declarations: [
    ConfiguracionPerfilComponent
  ],
  imports: [
    CommonModule,
    ConfiguracionPerfilRoutingModule,
    
    TrazabilidadModule
  ]
})
export class ConfiguracionPerfilModule { }
