import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef, MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { forkJoin } from 'rxjs';
import { finalize, take } from 'rxjs/operators';
import { Rol, Modulo, ModuloNode, Permiso } from '../seguridad.types';
import { SeguridadService } from '../seguridad.service';
import { UserService } from 'app/core/user/user.service';
import { SeguridadModuloFormDialogComponent } from '../seguridad-modulo-form-dialog/seguridad-modulo-form-dialog.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector     : 'app-seguridad-modulos-dialog',
    templateUrl  : './seguridad-modulos-dialog.component.html',
    styles       : [`
        app-seguridad-modulos-dialog .mat-expansion-panel {
            margin: 0 !important;
            transition: margin 225ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        app-seguridad-modulos-dialog .mat-expansion-panel-spacing {
            margin: 0 !important;
        }
    `],
    encapsulation: ViewEncapsulation.None
})
export class SeguridadModulosDialogComponent implements OnInit {
    rol: Rol;
    modulos: Modulo[] = [];
    allModulos: Modulo[] = [];
    /** Nodos raíz del árbol (ModuloPadreId === null) */
    rootNodes: ModuloNode[] = [];
    allPermisos: Permiso[] = [];
    selectedPermisosIds: number[] = [];
    isSaving: boolean = false;
    expandedNodeIds: Set<number> = new Set();

    constructor(
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _dialogRef: MatDialogRef<SeguridadModulosDialogComponent>,
        private _dialog: MatDialog,
        private _seguridadService: SeguridadService,
        private _userService: UserService,
        private _fuseConfirmationService: FuseConfirmationService
    ) {
        this.rol = _data.rol;
        // Inicializar permisos seleccionados desde el rol
        this.selectedPermisosIds = this.rol.permisos ? this.rol.permisos.map(p => p.PermisoId) : [];
    }

    ngOnInit(): void {
        this.loadModulos();
        this.loadSelectedPermisos();
    }

    /**
     * Cargar los permisos asignados actualmente al rol desde la BD
     */
    loadSelectedPermisos(): void {
        this._seguridadService.getPermisosByRol(this.rol.RolId).subscribe(res => {
            if (res.status && res.data) {
                // Mapear los IDs de permisos asignados
                this.selectedPermisosIds = res.data.map(p => p.PermisoId);
                // También actualizar la lista en el objeto rol para el filtrado de saveChanges
                this.rol.permisos = res.data;
            }
        });
    }

    /**
     * Alternar estado de expansión de cualquier nodo del árbol
     */
    onExpansionChange(nodeId: number, expanded: boolean): void {
        if (expanded) {
            this.expandedNodeIds.add(nodeId);
        } else {
            this.expandedNodeIds.delete(nodeId);
        }
    }

    /**
     * Verificar si un nodo debe estar expandido
     */
    isNodeExpanded(nodeId: number): boolean {
        return this.expandedNodeIds.has(nodeId);
    }

    loadModulos(): void {
        // Cargar el catálogo completo primero
        this._seguridadService.getModulos().subscribe(res => {
            if (res.status) {
                this.allModulos = res.data;
                this.modulos = res.data;
                this._organizeModulos();
            }
        });

        // Cargar todos los permisos
        this._seguridadService.getPermisos().subscribe(res => {
            if (res.status) {
                this.allPermisos = res.data;
            }
        });
    }

    private _organizeModulos(): void {
        // Construir árbol recursivo de N niveles
        this.rootNodes = this._buildTree(null);
    }

    /**
     * Construye recursivamente los nodos hijos para un padre dado.
     * @param parentId null para obtener los nodos raíz
     */
    private _buildTree(parentId: number | null): ModuloNode[] {
        return this.modulos
            .filter(m => m.ModuloPadreId === parentId)
            .map(m => ({
                ...m,
                children: this._buildTree(m.ModuloId)
            }));
    }

    openNuevoModuloDialog(parentId: number = null): void {
        const dialogRef = this._dialog.open(SeguridadModuloFormDialogComponent, {
            data: {
                parentModulos: this.rootNodes,
                selectedParentId: parentId
            },
            width: '100%',
            maxWidth: '600px',
            panelClass: 'custom-security-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadModulos();
            }
        });
    }

    /**
     * Abrir diálogo para editar un módulo existente
     */
    openEditarModuloDialog(modulo: Modulo): void {
        const dialogRef = this._dialog.open(SeguridadModuloFormDialogComponent, {
            data: {
                parentModulos: this.rootNodes,
                modulo: modulo
            },
            width: '100%',
            maxWidth: '600px',
            panelClass: 'fuse-mat-dialog-rounded'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadModulos();
            }
        });
    }

    /**
     * Mostrar diálogo de confirmación y eliminar módulo
     */
    eliminarModulo(node: ModuloNode): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Eliminar módulo',
            message: `¿Estás seguro de que deseas eliminar el módulo <b>${node.NombreModulo}</b>? Esta acción no se puede deshacer.`,
            actions: {
                confirm: {
                    show: true,
                    label: 'Eliminar',
                    color: 'warn'
                },
                cancel: {
                    show: true,
                    label: 'Cancelar'
                }
            }
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.isSaving = true;
                this._seguridadService.deleteModulo(node.ModuloId).subscribe({
                    next: (res) => {
                        this.isSaving = false;
                        if (res.status) {
                            this.loadModulos();
                        } else {
                            console.error('Error al eliminar módulo:', res.message);
                        }
                    },
                    error: (err) => {
                        this.isSaving = false;
                        console.error('Error al eliminar módulo', err);
                    }
                });
            }
        });
    }

    /** Devuelve los hijos directos de un nodo buscándolo en el árbol */
    getChildren(node: ModuloNode): ModuloNode[] {
        return node.children || [];
    }

    /** Cuenta todos los permisos en el subárbol de un nodo (recursivo) */
    countSubtreePermisos(node: ModuloNode): number {
        const own = this.getPermisosByModulo(node.ModuloId).length;
        const fromChildren = node.children.reduce((sum, child) => sum + this.countSubtreePermisos(child), 0);
        return own + fromChildren;
    }

    getPermisosByModulo(moduloId: number): Permiso[] {
        return this.allPermisos.filter(p => p.ModuloId === moduloId);
    }

    /**
     * Reordenar módulos raíz
     */
    dropParent(event: CdkDragDrop<ModuloNode[]>): void {
        moveItemInArray(this.rootNodes, event.previousIndex, event.currentIndex);
    }

    /**
     * Reordenar hijos de cualquier nodo del árbol
     */
    dropChild(event: CdkDragDrop<ModuloNode[]>, parentId: number): void {
        const parentNode = this._findNode(this.rootNodes, parentId);
        if (parentNode) {
            moveItemInArray(parentNode.children, event.previousIndex, event.currentIndex);
        }
    }

    /**
     * Busca un nodo por ID en el árbol de forma recursiva
     */
    private _findNode(nodes: ModuloNode[], id: number): ModuloNode | null {
        for (const node of nodes) {
            if (node.ModuloId === id) return node;
            const found = this._findNode(node.children, id);
            if (found) return found;
        }
        return null;
    }

    /**
     * Alternar selección de permiso
     */
    togglePermiso(permisoId: number): void {
        const index = this.selectedPermisosIds.indexOf(permisoId);
        if (index >= 0) {
            this.selectedPermisosIds.splice(index, 1);
        } else {
            this.selectedPermisosIds.push(permisoId);
        }
    }

    /**
     * Verificar si un permiso está seleccionado
     */
    isPermisoSelected(permisoId: number): boolean {
        return this.selectedPermisosIds.includes(permisoId);
    }

    /**
     * Guardar los cambios de permisos (altas y bajas)
     */
    saveChanges(): void {
        this.isSaving = true;

        const currentIds = this.rol.permisos ? this.rol.permisos.map(p => p.PermisoId) : [];
        const newIds = this.selectedPermisosIds.filter(id => !currentIds.includes(id));
        const removedIds = currentIds.filter(id => !this.selectedPermisosIds.includes(id));

        if (newIds.length === 0 && removedIds.length === 0) {
            this.isSaving = false;
            this._dialogRef.close(true);
            return;
        }

        this._userService.user$.pipe(take(1)).subscribe(user => {
            const userId = parseInt(user.id, 10) || 1;
            const observables = [
                ...newIds.map(id => this._seguridadService.assignPermisoToRol(this.rol.RolId, id, userId)),
                ...removedIds.map(id => this._seguridadService.removePermisoFromRol(this.rol.RolId, id))
            ];

            forkJoin(observables)
                .pipe(
                    finalize(() => {
                        this.isSaving = false;
                    })
                )
                .subscribe({
                    next: (results) => {
                        const allOk = results.every((res: { status?: boolean }) => res?.status !== false);
                        if (allOk) {
                            this._dialogRef.close(true);
                        }
                    },
                    error: (error) => {
                        console.error('Error al guardar permisos:', error);
                    }
                });
        });
    }

    close(): void {
        this._dialogRef.close();
    }
}
