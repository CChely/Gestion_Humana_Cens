import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { SeguridadService } from '../seguridad.service';
import { Rol, Permiso, Modulo } from '../seguridad.types';

@Component({
    selector     : 'app-seguridad-dialog',
    templateUrl  : './seguridad-dialog.component.html',
    encapsulation: ViewEncapsulation.None
})
export class SeguridadDialogComponent implements OnInit {
    form: FormGroup;
    mode: 'create' | 'edit';
    rol: Rol;
    isSaving: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _dialogRef: MatDialogRef<SeguridadDialogComponent>,
        private _fb: FormBuilder,
        private _seguridadService: SeguridadService
    ) {
        this.mode = _data.mode;
        this.rol = _data.rol;
    }

    ngOnInit(): void {
        this.form = this._fb.group({
            NombreRol     : [this.rol?.NombreRol || '', [Validators.required]],
            DescripcionRol: [this.rol?.DescripcionRol || '', [Validators.required]]
        });
    }

    save(): void {
        if (this.form.invalid) return;

        this.isSaving = true;
        const payload = {
            ...this.rol,
            ...this.form.value
        };

        this._seguridadService.saveRol(payload).subscribe({
            next: () => {
                this.isSaving = false;
                this._dialogRef.close(true);
            },
            error: () => {
                this.isSaving = false;
            }
        });
    }

    close(): void {
        this._dialogRef.close();
    }
}
