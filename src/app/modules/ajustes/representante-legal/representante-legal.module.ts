import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatLegacyDialogModule as MatDialogModule } from "@angular/material/legacy-dialog";
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { RepresentanteLegalRoutingModule } from "./representante-legal-routing.module";
import { RepresentanteLegalComponent } from "./representante-legal.component";
import { RepresentanteLegalDialogComponent } from "./dialogs/representante-legal-dialog/representante-legal-dialog.component";

@NgModule({
    declarations: [
        RepresentanteLegalComponent,
        RepresentanteLegalDialogComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        RepresentanteLegalRoutingModule
    ]
})
export class RepresentanteLegalModule {}
