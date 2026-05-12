import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FuseConfirmationModule } from '@fuse/services/confirmation';
import { SharedModule } from 'app/shared/shared.module';
import { SeguridadComponent } from './seguridad.component';
import { SeguridadDialogComponent } from './seguridad-dialog/seguridad-dialog.component';
import { SeguridadModulosDialogComponent } from './seguridad-modulos-dialog/seguridad-modulos-dialog.component';
import { SeguridadModuloFormDialogComponent } from './seguridad-modulo-form-dialog/seguridad-modulo-form-dialog.component';
import { Route } from '@angular/router';

const routes: Route[] = [
    {
        path     : '',
        component: SeguridadComponent
    }
];

@NgModule({
    declarations: [
        SeguridadComponent,
        SeguridadDialogComponent,
        SeguridadModulosDialogComponent,
        SeguridadModuloFormDialogComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        MatTabsModule,
        MatTooltipModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatExpansionModule,
        DragDropModule,
        FuseConfirmationModule,
        SharedModule
    ]
})
export class SeguridadModule { }
