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
    parentModuloName: string = '';
    isSaving: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _dialogRef: MatDialogRef<SeguridadModuloFormDialogComponent>,
        private _fb: FormBuilder,
        private _seguridadService: SeguridadService
    ) {
        this.parentModulos = _data.parentModulos || [];
        if (_data.selectedParentId) {
            const parent = this.parentModulos.find(m => m.ModuloId === _data.selectedParentId);
            this.parentModuloName = parent ? parent.NombreModulo : '';
        }
    }

    ngOnInit(): void {
        this.form = this._fb.group({
            p_IdModuloPadre: [this._data.selectedParentId || null],
            p_Codigo: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(100)]],
            p_Nombre: ['', [Validators.required, Validators.maxLength(150)]],
            p_Ruta: ['', [Validators.maxLength(300)]],
            p_Icono: ['', [Validators.maxLength(100)]],
            p_Orden: [0],
            p_EsVisibleMenu: [true],
            p_EsActivo: [true]
        });

        // Generar código desde el nombre automáticamente
        this.form.get('p_Nombre').valueChanges.subscribe(value => {
            if (value) {
                const slug = this._slugify(value);
                this.form.get('p_Codigo').setValue(slug);
            } else {
                this.form.get('p_Codigo').setValue('');
            }
        });
    }

    /**
     * Convierte texto a un formato de código (slug)
     */
    private _slugify(text: string): string {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .normalize('NFD') // Separar acentos del carácter
            .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
            .replace(/\s+/g, '-') // Reemplazar espacios por -
            .replace(/[^\w\-]+/g, '') // Eliminar caracteres no alfanuméricos (excepto -)
            .replace(/\-\-+/g, '-'); // Reemplazar múltiples - por uno solo
    }

    save(): void {
        if (this.form.invalid) return;

        this.isSaving = true;
        // Usar getRawValue para incluir campos deshabilitados (p_Codigo)
        const formData = {
            ...this.form.getRawValue(),
            p_IdUsuarioActual: 1 // TODO: Obtener del servicio de autenticación
        };

        this._seguridadService.saveModulo(formData).subscribe({
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
