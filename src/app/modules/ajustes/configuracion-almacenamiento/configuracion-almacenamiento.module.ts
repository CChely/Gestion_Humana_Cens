import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { ConfiguracionAlmacenamientoComponent } from 'app/modules/ajustes/configuracion-almacenamiento/configuracion-almacenamiento.component';
import { configuracionAlmacenamientoRoutes } from 'app/modules/ajustes/configuracion-almacenamiento/configuracion-almacenamiento.routing';

@NgModule({
    declarations: [
        ConfiguracionAlmacenamientoComponent
    ],
    imports     : [
        RouterModule.forChild(configuracionAlmacenamientoRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        FuseAlertModule,
        SharedModule
    ]
})
export class ConfiguracionAlmacenamientoModule
{
}
