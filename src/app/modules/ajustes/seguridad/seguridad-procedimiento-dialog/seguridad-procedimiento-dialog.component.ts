import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { SeguridadService } from '../seguridad.service';
import { Procedimiento, Permiso } from '../seguridad.types';

@Component({
    selector: 'seguridad-procedimiento-dialog',
    templateUrl: './seguridad-procedimiento-dialog.component.html',
    encapsulation: ViewEncapsulation.None
})
export class SeguridadProcedimientoDialogComponent implements OnInit {
    form: FormGroup;
    mode: 'create' | 'edit' = 'create';
    procedimiento: Procedimiento;
    isSaving: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _dialogRef: MatDialogRef<SeguridadProcedimientoDialogComponent>,
        private _fb: FormBuilder,
        private _seguridadService: SeguridadService
    ) { }

    ngOnInit(): void {
        this.procedimiento = this._data.procedimiento;
        this.mode = this.procedimiento ? 'edit' : 'create';

        this.form = this._fb.group({
            p_IdProcedimiento: [this.procedimiento?.ProcedimientoId || null],
            p_Nombre: [this.procedimiento?.NombreProcedimiento || '', [Validators.required, Validators.maxLength(300)]],
            p_Descripcion: [this.procedimiento?.Descripcion || '', [Validators.maxLength(500)]],
            p_EsPublico: [this.procedimiento ? (this.procedimiento.EsPublico === 1) : true],
            p_EsActivo: [this.procedimiento ? (this.procedimiento.EsActivo === 1) : true]
        });
    }

    /**
     * Normalizar nombre al perder el foco
     */
    onNombreBlur(): void {
        let nombre = this.form.get('p_Nombre').value;
        if (nombre && nombre.trim() !== '' && !nombre.toLowerCase().startsWith('dbo.')) {
            this.form.get('p_Nombre').setValue(`dbo.${nombre.trim()}`);
        }
    }

    close(): void {
        this._dialogRef.close();
    }

    save(): void {
        if (this.form.invalid) return;

        // Normalizar nombre con prefijo dbo.
        let nombre = this.form.get('p_Nombre').value;
        if (nombre && !nombre.toLowerCase().startsWith('dbo.')) {
            nombre = `dbo.${nombre}`;
            this.form.get('p_Nombre').setValue(nombre);
        }

        this.isSaving = true;
        this._seguridadService.saveProcedimiento(this.form.value).subscribe(res => {
            this.isSaving = false;
            if (res.status) {
                this._dialogRef.close(true);
            }
        });
    }
}
