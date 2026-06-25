import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermissionToastComponent } from 'app/shared/components/permission-toast/permission-toast.component';

@NgModule({
    declarations: [
        PermissionToastComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PermissionToastComponent
    ]
})
export class SharedModule
{
}
