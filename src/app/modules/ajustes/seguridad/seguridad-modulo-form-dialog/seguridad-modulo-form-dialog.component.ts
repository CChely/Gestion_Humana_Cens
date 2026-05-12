import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { SeguridadService } from '../seguridad.service';
import { Modulo } from '../seguridad.types';

@Component({
    selector: 'seguridad-modulo-form-dialog',
    templateUrl: './seguridad-modulo-form-dialog.component.html',
    encapsulation: ViewEncapsulation.None
})
export class SeguridadModuloFormDialogComponent implements OnInit {
    form: FormGroup;
    parentModulos: Modulo[] = [];
    isSaving: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _dialogRef: MatDialogRef<SeguridadModuloFormDialogComponent>,
        private _fb: FormBuilder,
        private _seguridadService: SeguridadService
    ) {
        this.parentModulos = _data.parentModulos || [];
    }

    ngOnInit(): void {
        this.form = this._fb.group({
            p_IdModuloPadre: [null],
            p_Codigo: ['', [Validators.required, Validators.maxLength(100)]],
            p_Nombre: ['', [Validators.required, Validators.maxLength(150)]],
            p_Ruta: ['', [Validators.maxLength(300)]],
            p_Icono: ['', [Validators.maxLength(100)]],
            p_Orden: [0],
            p_EsVisibleMenu: [true],
            p_EsActivo: [true]
        });
    }

    save(): void {
        if (this.form.invalid) return;

        this.isSaving = true;
        this._seguridadService.saveModulo(this.form.value).subscribe({
            next: (res) => {
                this.isSaving = false;
                if (res.status) {
                    this._dialogRef.close(true);
                }
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
