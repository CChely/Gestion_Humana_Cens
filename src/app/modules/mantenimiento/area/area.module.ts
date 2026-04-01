import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreaRoutingModule } from './area-routing.module';
import { AreaComponent } from './area.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

@NgModule({
  declarations: [
    AreaComponent
  ],
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule,
    AreaRoutingModule
  ]
})
export class AreaModule { }