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
    allPermisos: Permiso[] = [];
    allModulos: Modulo[] = [];
    selectedPermisosIds: number[] = [];
    selectedModulosIds: number[] = [];
    isSaving: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _dialogRef: MatDialogRef<SeguridadDialogComponent>,
        private _fb: FormBuilder,
        private _seguridadService: SeguridadService
    ) {
        this.mode = _data.mode;
        this.rol = _data.rol;
        if (this.rol) {
            this.selectedPermisosIds = this.rol.permisos ? this.rol.permisos.map(p => p.PermisoId) : [];
            this.selectedModulosIds = this.rol.modulos ? this.rol.modulos.map(v => v.ModuloId) : [];
        }
    }

    ngOnInit(): void {
        this.form = this._fb.group({
            NombreRol     : [this.rol?.NombreRol || '', [Validators.required]],
            DescripcionRol: [this.rol?.DescripcionRol || '', [Validators.required]],
            activo        : [this.rol ? this.rol.activo : true]
        });

        this.loadPermisos();
        this.loadModulos();
    }

    loadPermisos(): void {
        this._seguridadService.getPermisos().subscribe(res => {
            if (res.status) {
                this.allPermisos = res.data;
            }
        });
    }

    loadModulos(): void {
        this._seguridadService.getModulos().subscribe(res => {
            if (res.status) {
                this.allModulos = res.data;
            }
        });
    }

    // Permisos Helpers
    get permissionsByModule(): { [key: string]: Permiso[] } {
        return this.allPermisos.reduce((acc, curr) => {
            const groupName = curr.NombreModulo || `Modulo ${curr.ModuloId}`;
            if (!acc[groupName]) acc[groupName] = [];
            acc[groupName].push(curr);
            return acc;
        }, {});
    }

    get moduleNamesPermisos(): string[] {
        return Object.keys(this.permissionsByModule);
    }

    isPermissionSelected(id: number): boolean {
        return this.selectedPermisosIds.includes(id);
    }

    togglePermission(id: number): void {
        const index = this.selectedPermisosIds.indexOf(id);
        if (index > -1) {
            this.selectedPermisosIds.splice(index, 1);
        } else {
            this.selectedPermisosIds.push(id);
        }
    }

    // Módulos Helpers
    get modulosByParent(): { [key: string]: Modulo[] } {
        return this.allModulos.reduce((acc, curr) => {
            // Si tiene padre, buscamos el nombre del padre para el grupo
            // Si no tiene padre, es un módulo principal
            let groupName = 'Módulos Principales';
            if (curr.ModuloPadreId) {
                const parent = this.allModulos.find(m => m.ModuloId === curr.ModuloPadreId);
                if (parent) groupName = parent.NombreModulo;
            }
            if (!acc[groupName]) acc[groupName] = [];
            acc[groupName].push(curr);
            return acc;
        }, {});
    }

    get moduleNamesModulos(): string[] {
        return Object.keys(this.modulosByParent);
    }

    isModuloSelected(id: number): boolean {
        return this.selectedModulosIds.includes(id);
    }

    toggleModulo(id: number): void {
        const index = this.selectedModulosIds.indexOf(id);
        if (index > -1) {
            this.selectedModulosIds.splice(index, 1);
        } else {
            this.selectedModulosIds.push(id);
        }
    }

    save(): void {
        if (this.form.invalid) return;

        this.isSaving = true;
        const payload = {
            ...this.rol,
            ...this.form.value,
            permisos: this.allPermisos.filter(p => this.selectedPermisosIds.includes(p.PermisoId)),
            modulos: this.allModulos.filter(m => this.selectedModulosIds.includes(m.ModuloId)),
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
