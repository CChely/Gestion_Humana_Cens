import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef, MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Rol, Modulo, Permiso } from '../seguridad.types';
import { SeguridadService } from '../seguridad.service';
import { SeguridadModuloFormDialogComponent } from '../seguridad-modulo-form-dialog/seguridad-modulo-form-dialog.component';

@Component({
    selector     : 'app-seguridad-modulos-dialog',
    templateUrl  : './seguridad-modulos-dialog.component.html',
    encapsulation: ViewEncapsulation.None
})
export class SeguridadModulosDialogComponent implements OnInit {
    rol: Rol;
    modulos: Modulo[] = [];
    allModulos: Modulo[] = [];
    allPermisos: Permiso[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _dialogRef: MatDialogRef<SeguridadModulosDialogComponent>,
        private _dialog: MatDialog,
        private _seguridadService: SeguridadService
    ) {
        this.rol = _data.rol;
    }

    openNuevoModuloDialog(): void {
        const dialogRef = this._dialog.open(SeguridadModuloFormDialogComponent, {
            data: {
                parentModulos: this.parentModulos
            },
            width: '100%',
            maxWidth: '600px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadModulos();
            }
        });
    }

    ngOnInit(): void {
        this.loadModulos();
    }

    loadModulos(): void {
        // Cargar el catálogo completo primero
        this._seguridadService.getModulos().subscribe(res => {
            if (res.status) {
                this.allModulos = res.data;
                this.modulos = res.data;
            }
        });

        // Cargar todos los permisos
        this._seguridadService.getPermisos().subscribe(res => {
            if (res.status) {
                this.allPermisos = res.data;
            }
        });
    }

    get parentModulos(): Modulo[] {
        return this.modulos.filter(m => m.ModuloPadreId === null);
    }

    getChildren(parentId: number): Modulo[] {
        return this.modulos.filter(m => m.ModuloPadreId === parentId);
    }

    getPermisosByModulo(moduloId: number): Permiso[] {
        return this.allPermisos.filter(p => p.ModuloId === moduloId);
    }

    close(): void {
        this._dialogRef.close();
    }
}
