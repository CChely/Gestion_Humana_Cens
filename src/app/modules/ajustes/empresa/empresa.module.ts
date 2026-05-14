import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from "@angular/material/legacy-progress-spinner";
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { MatLegacyDialogModule as MatDialogModule } from "@angular/material/legacy-dialog";
import { MatDividerModule } from "@angular/material/divider";
import { EmpresaRoutingModule } from "./empresa-routing.module";
import { EmpresaComponent } from "./empresa.component";
import { EmpresaCreateDialogComponent } from "./empresa-create-dialog/empresa-create-dialog.component";

@NgModule({
    declarations: [
        EmpresaComponent,
        EmpresaCreateDialogComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatDividerModule,
        EmpresaRoutingModule,
    ],
})
export class EmpresaModule {}
