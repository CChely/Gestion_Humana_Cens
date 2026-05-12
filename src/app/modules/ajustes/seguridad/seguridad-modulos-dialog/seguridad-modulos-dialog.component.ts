import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef, MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
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
    parentModulos: Modulo[] = [];
    childrenMap: Map<number, Modulo[]> = new Map();
    allPermisos: Permiso[] = [];
    selectedPermisosIds: number[] = [];
    isSaving: boolean = false;
    expandedParentIds: Set<number> = new Set();

    constructor(
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _dialogRef: MatDialogRef<SeguridadModulosDialogComponent>,
        private _dialog: MatDialog,
        private _seguridadService: SeguridadService
    ) {
        this.rol = _data.rol;
        // Inicializar permisos seleccionados desde el rol
        this.selectedPermisosIds = this.rol.permisos ? this.rol.permisos.map(p => p.PermisoId) : [];
    }

    ngOnInit(): void {
        this.loadModulos();
    }

    /**
     * Alternar estado de expansión de un módulo padre
     */
    onParentExpansionChange(parentId: number, expanded: boolean): void {
        if (expanded) {
            this.expandedParentIds.add(parentId);
        } else {
            this.expandedParentIds.delete(parentId);
        }
    }

    /**
     * Verificar si un módulo padre debe estar expandido
     */
    isParentExpanded(parentId: number): boolean {
        return this.expandedParentIds.has(parentId);
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
        this.parentModulos = this.modulos.filter(m => m.ModuloPadreId === null);
        this.childrenMap.clear();
        this.parentModulos.forEach(parent => {
            const children = this.modulos.filter(m => m.ModuloPadreId === parent.ModuloId);
            this.childrenMap.set(parent.ModuloId, children);
        });
    }

    openNuevoModuloDialog(parentId: number = null): void {
        const dialogRef = this._dialog.open(SeguridadModuloFormDialogComponent, {
            data: {
                parentModulos: this.parentModulos,
                selectedParentId: parentId
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

    getChildren(parentId: number): Modulo[] {
        return this.childrenMap.get(parentId) || [];
    }

    getPermisosByModulo(moduloId: number): Permiso[] {
        return this.allPermisos.filter(p => p.ModuloId === moduloId);
    }

    /**
     * Reordenar módulos padres
     */
    dropParent(event: CdkDragDrop<Modulo[]>): void {
        moveItemInArray(this.parentModulos, event.previousIndex, event.currentIndex);
        console.log('Nuevo orden de padres:', this.parentModulos);
    }

    /**
     * Reordenar módulos hijos
     */
    dropChild(event: CdkDragDrop<Modulo[]>, parentId: number): void {
        const children = this.childrenMap.get(parentId);
        if (children) {
            moveItemInArray(children, event.previousIndex, event.currentIndex);
            console.log(`Nuevo orden de hijos para el padre ${parentId}:`, children);
        }
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
     * Guardar los cambios de permisos
     */
    saveChanges(): void {
        this.isSaving = true;
        // En una implementación real, aquí también se guardaría el nuevo orden (p_Orden)
        console.log('Permisos seleccionados:', this.selectedPermisosIds);
        console.log('Orden actual de módulos:', this.parentModulos);
        
        setTimeout(() => {
            this.isSaving = false;
            this._dialogRef.close(true);
        }, 1000);
    }

    close(): void {
        this._dialogRef.close();
    }
}
