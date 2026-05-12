import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { SeguridadService } from './seguridad.service';
import { Rol } from './seguridad.types';
import { SeguridadDialogComponent } from './seguridad-dialog/seguridad-dialog.component';
import { SeguridadModulosDialogComponent } from './seguridad-modulos-dialog/seguridad-modulos-dialog.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { finalize } from 'rxjs/operators';

@Component({
    selector       : 'app-seguridad',
    templateUrl    : './seguridad.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeguridadComponent implements OnInit {
    roles: Rol[] = [];
    isLoading: boolean = false;

    constructor(
        private _seguridadService: SeguridadService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _dialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService
    ) { }

    ngOnInit(): void {
        this.loadRoles();
    }

    /**
     * Cargar lista de roles
     */
    loadRoles(): void {
        this.isLoading = true;
        this._changeDetectorRef.markForCheck();

        this._seguridadService.getRoles()
            .pipe(finalize(() => {
                this.isLoading = false;
                this._changeDetectorRef.markForCheck();
            }))
            .subscribe((response) => {
                if (response.status) {
                    this.roles = response.data;
                }
            });
    }

    /**
     * Abrir diálogo para crear
     */
    openCreateDialog(): void {
        const dialogRef = this._dialog.open(SeguridadDialogComponent, {
            width: '600px',
            disableClose: true,
            data: { mode: 'create' }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.loadRoles();
            }
        });
    }

    /**
     * Abrir diálogo para editar
     */
    openEditDialog(rol: Rol): void {
        const dialogRef = this._dialog.open(SeguridadDialogComponent, {
            width: '600px',
            disableClose: true,
            data: { mode: 'edit', rol }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.loadRoles();
            }
        });
    }

    /**
     * Abrir modal de visualización de módulos
     */
    openModulosDialog(rol: Rol): void {
        this._dialog.open(SeguridadModulosDialogComponent, {
            data: { rol },
            width: '100%',
            maxWidth: '1000px',
            panelClass: 'no-padding-dialog'
        });
    }

    /**
     * Confirmar y eliminar
     */
    deleteRol(rol: Rol): void {
        const dialogRef = this._fuseConfirmationService.open({
            title  : 'Eliminar Rol',
            message: `¿Estás seguro de que deseas eliminar el rol "${rol.NombreRol}"? Esta acción no se puede deshacer.`,
            icon   : {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'warn'
            },
            actions: {
                confirm: {
                    label: 'Eliminar',
                    color: 'warn'
                }
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this._seguridadService.deleteRol(rol.RolId).subscribe(() => {
                    this.loadRoles();
                });
            }
        });
    }

    /**
     * Track by function para ngFor
     */
    trackByFn(index: number, item: Rol): any {
        return item.RolId || index;
    }
}
