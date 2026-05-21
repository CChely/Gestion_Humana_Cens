import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { SeguridadService } from './seguridad.service';
import { Rol, Permiso, Procedimiento } from './seguridad.types';
import { SeguridadDialogComponent } from './seguridad-dialog/seguridad-dialog.component';
import { SeguridadModulosDialogComponent } from './seguridad-modulos-dialog/seguridad-modulos-dialog.component';
import { SeguridadPermisoDialogComponent } from './seguridad-permiso-dialog/seguridad-permiso-dialog.component';
import { SeguridadProcedimientoDialogComponent } from './seguridad-procedimiento-dialog/seguridad-procedimiento-dialog.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { finalize } from 'rxjs/operators';

@Component({
    selector       : 'app-seguridad',
    templateUrl    : './seguridad.component.html',
    styleUrls      : ['./seguridad.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeguridadComponent implements OnInit {
    roles: Rol[] = [];
    filteredRoles: Rol[] = [];
    permisos: Permiso[] = [];
    filteredPermisos: Permiso[] = [];
    procedimientos: Procedimiento[] = [];
    filteredProcedimientos: Procedimiento[] = [];
    searchQueryRoles: string = '';
    searchQueryPermisos: string = '';
    searchQueryProcedimientos: string = '';
    isLoading: boolean = false;
    isLoadingPermisos: boolean = false;
    isLoadingProcedimientos: boolean = false;
    selectedTabIndex: number = 0;

    constructor(
        private _seguridadService: SeguridadService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _dialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService
    ) { }

    ngOnInit(): void {
        this.loadRoles();
        this.loadPermisos();
        this.loadProcedimientos();
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
                    this.filterRoles();
                }
            });
    }

    /**
     * Filtrar lista de roles localmente
     */
    filterRoles(): void {
        if (!this.searchQueryRoles) {
            this.filteredRoles = this.roles;
        } else {
            const query = this.searchQueryRoles.toLowerCase();
            this.filteredRoles = this.roles.filter(r => 
                r.NombreRol.toLowerCase().includes(query) || 
                (r.DescripcionRol && r.DescripcionRol.toLowerCase().includes(query))
            );
        }
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Cargar lista de permisos globales
     */
    loadPermisos(): void {
        this.isLoadingPermisos = true;
        this._changeDetectorRef.markForCheck();

        this._seguridadService.getPermisos()
            .pipe(finalize(() => {
                this.isLoadingPermisos = false;
                this._changeDetectorRef.markForCheck();
            }))
            .subscribe((response) => {
                if (response.status) {
                    this.permisos = response.data;
                    this.filterPermisos();
                }
            });
    }

    /**
     * Filtrar lista de permisos localmente
     */
    filterPermisos(): void {
        if (!this.searchQueryPermisos) {
            this.filteredPermisos = this.permisos;
        } else {
            const query = this.searchQueryPermisos.toLowerCase();
            this.filteredPermisos = this.permisos.filter(p => 
                p.CodigoPermiso.toLowerCase().includes(query) || 
                p.DescripcionPermiso.toLowerCase().includes(query) ||
                (p.NombreModulo && p.NombreModulo.toLowerCase().includes(query))
            );
        }
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Cargar lista de procedimientos
     */
    loadProcedimientos(): void {
        this.isLoadingProcedimientos = true;
        this._changeDetectorRef.markForCheck();

        this._seguridadService.getProcedimientos()
            .pipe(finalize(() => {
                this.isLoadingProcedimientos = false;
                this._changeDetectorRef.markForCheck();
            }))
            .subscribe((response) => {
                if (response.status) {
                    this.procedimientos = response.data;
                    this.filterProcedimientos();
                }
            });
    }

    /**
     * Filtrar lista de procedimientos localmente
     */
    filterProcedimientos(): void {
        if (!this.searchQueryProcedimientos) {
            this.filteredProcedimientos = this.procedimientos;
        } else {
            const query = this.searchQueryProcedimientos.toLowerCase();
            this.filteredProcedimientos = this.procedimientos.filter(p => 
                p.NombreProcedimiento.toLowerCase().includes(query) || 
                (p.Descripcion && p.Descripcion.toLowerCase().includes(query))
            );
        }
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Abrir diálogo para crear
     */
    openCreateDialog(): void {
        const dialogRef = this._dialog.open(SeguridadDialogComponent, {
            panelClass: 'custom-security-dialog',
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
     * Abrir diálogo para crear o editar permiso
     */
    openPermisoDialog(permiso?: Permiso): void {
        const dialogRef = this._dialog.open(SeguridadPermisoDialogComponent, {
            panelClass: 'custom-security-dialog',
            width: '100%',
            maxWidth: '500px',
            disableClose: true,
            data: { permiso }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.loadPermisos();
            }
        });
    }

    /**
     * Eliminar un permiso
     */
    deletePermiso(permiso: Permiso): void {
        // TODO: Implementar diálogo de confirmación real
        if (confirm('¿Está seguro de eliminar este permiso?')) {
            // Nota: Aquí se necesitaría un método deletePermiso en el servicio
            // Por ahora asumo que se implementará similar a los otros
            console.log('Eliminando permiso:', permiso.PermisoId);
        }
    }

    /**
     * Abrir diálogo para editar
     */
    openEditDialog(rol: Rol): void {
        const dialogRef = this._dialog.open(SeguridadDialogComponent, {
            panelClass: 'custom-security-dialog',
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
            panelClass: 'custom-security-dialog',
            width: '100%',
            maxWidth: '1000px'
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
     * Abrir diálogo para CRUD de procedimientos
     */
    openProcedimientoDialog(procedimiento?: Procedimiento): void {
        const dialogRef = this._dialog.open(SeguridadProcedimientoDialogComponent, {
            panelClass: 'custom-security-dialog',
            width: '100%',
            maxWidth: '500px',
            disableClose: true,
            data: { procedimiento }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.loadProcedimientos();
            }
        });
    }

    /**
     * Confirmar y eliminar procedimiento
     */
    deleteProcedimiento(proc: Procedimiento): void {
        const dialogRef = this._fuseConfirmationService.open({
            title  : 'Eliminar Procedimiento',
            message: `¿Estás seguro de que deseas eliminar el procedimiento "${proc.NombreProcedimiento}"? Esta acción no se puede deshacer.`,
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
                this._seguridadService.deleteProcedimiento(proc.ProcedimientoId).subscribe(() => {
                    this.loadProcedimientos();
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
