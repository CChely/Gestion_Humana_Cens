import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { finalize } from 'rxjs/operators';
import { SeguridadService } from '../seguridad.service';
import { Modulo, Permiso, Procedimiento } from '../seguridad.types';

@Component({
    selector: 'seguridad-permiso-dialog',
    templateUrl: './seguridad-permiso-dialog.component.html',
    encapsulation: ViewEncapsulation.None
})
export class SeguridadPermisoDialogComponent implements OnInit {
    form: FormGroup;
    mode: 'create' | 'edit' = 'create';
    permiso: Permiso;
    modulos: Modulo[] = [];
    modulosRaiz: Modulo[] = [];
    submodulosFiltrados: Modulo[] = [];
    acciones: any[] = [];
    isSaving: boolean = false;
    procedimientos: Procedimiento[] = [];
    filteredProcedimientos: Procedimiento[] = [];
    selectedProcedimientoIds: number[] = [];
    searchQueryProcedimientos: string = '';

    // Estados para selectores personalizados
    isModuloOpen: boolean = false;
    isSubModuloOpen: boolean = false;
    isAccionOpen: boolean = false;
    selectedModuloName: string = '';
    selectedSubModuloName: string = '';
    selectedAccionName: string = '';

    constructor(
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _dialogRef: MatDialogRef<SeguridadPermisoDialogComponent>,
        private _fb: FormBuilder,
        private _seguridadService: SeguridadService
    ) { }

    ngOnInit(): void {
        this.permiso = this._data.permiso;
        this.mode = this.permiso ? 'edit' : 'create';

        this.form = this._fb.group({
            p_IdModulo: [null, [Validators.required]],
            p_IdSubModulo: [null],
            p_IdAccion: [this.permiso?.AccionId || null, [Validators.required]],
            p_TipoValidacion: ['AND'],
            p_Descripcion: [this.permiso?.DescripcionPermiso || '', [Validators.maxLength(500)]]
        });

        if (this.permiso) {
            this.selectedAccionName = this.permiso.NombreAccion;
            
            // Cargar detalle completo del permiso (incluyendo procedimientos y jerarquía de módulos)
            this._seguridadService.getPermisoById(this.permiso.PermisoId).subscribe(res => {
                if (res.status && res.data && res.data.length > 0) {
                    // El SP devuelve un array plano donde cada fila tiene la info del permiso + un procedimiento
                    const primerRegistro = res.data[0];

                    // 1. Extraer IDs de todos los procedimientos vinculados
                    this.selectedProcedimientoIds = res.data
                        .filter(reg => reg.ProcedimientoId)
                        .map(reg => reg.ProcedimientoId);

                    this.filterProcedimientos();

                    // 2. Actualizar nombres y validación base
                    this.selectedAccionName = this.acciones.find(a => a.AccionId === primerRegistro.AccionId)?.NombreAccion || this.selectedAccionName;
                    
                    if (primerRegistro.TipoValidacion) {
                        this.form.get('p_TipoValidacion').setValue(primerRegistro.TipoValidacion);
                    }
                }
            });
        }

        // Escuchar cambios en el módulo para filtrar submódulos
        this.form.get('p_IdModulo').valueChanges.subscribe(moduloId => {
            this.filterSubmodulos(moduloId);
            const mod = this.modulosRaiz.find(m => m.ModuloId === moduloId);
            this.selectedModuloName = mod ? mod.NombreModulo : '';
            if (this.mode === 'create' || !this.form.get('p_IdSubModulo').value) {
                this.selectedSubModuloName = '';
            }
        });

        this.form.get('p_IdSubModulo').valueChanges.subscribe(subModuloId => {
            const sub = this.submodulosFiltrados.find(m => m.ModuloId === subModuloId);
            this.selectedSubModuloName = sub ? sub.NombreModulo : (subModuloId === null ? 'Ninguno' : '');
        });

        this.loadCatalogs();
        this.loadProcedimientos();
    }

    /**
     * Cargar catálogos necesarios
     */
    loadCatalogs(): void {
        // Cargar módulos
        this._seguridadService.getModulos().subscribe(res => {
            if (res.status) {
                this.modulos = res.data;
                // Filtrar solo los módulos principales (sin padre)
                this.modulosRaiz = this.modulos.filter(m => !m.ModuloPadreId);

                // Si estamos editando, inicializar los selectores de módulos usando la info del SP
                if (this.permiso) {
                    this._seguridadService.getPermisoById(this.permiso.PermisoId).subscribe(res => {
                        if (res.status && res.data && res.data.length > 0) {
                            const detalle = res.data[0];
                            
                            if (detalle) {
                                if (detalle.ModuloPadreId) {
                                    // Es un submódulo
                                    this.form.get('p_IdModulo').setValue(detalle.ModuloPadreId);
                                    setTimeout(() => {
                                        this.form.get('p_IdSubModulo').setValue(detalle.ModuloId);
                                        const sub = this.modulos.find(m => m.ModuloId === detalle.ModuloId);
                                        this.selectedSubModuloName = sub ? sub.NombreModulo : '';
                                    }, 100);
                                } else {
                                    // Es un módulo raíz
                                    this.form.get('p_IdModulo').setValue(detalle.ModuloId);
                                }
                            }
                        }
                    });
                }
            }
        });

        // Cargar acciones
        this._seguridadService.getAcciones().subscribe(res => {
            if (res.status) {
                this.acciones = res.data;
            }
        });
    }

    /**
     * Cargar catálogo de procedimientos
     */
    loadProcedimientos(): void {
        this._seguridadService.getProcedimientos().subscribe(res => {
            if (res.status) {
                this.procedimientos = res.data;
                this.filterProcedimientos();
            }
        });
    }

    /**
     * Filtrar procedimientos por nombre
     */
    filterProcedimientos(): void {
        let baseList = [];
        if (!this.searchQueryProcedimientos) {
            baseList = [...this.procedimientos];
        } else {
            const query = this.searchQueryProcedimientos.toLowerCase();
            baseList = this.procedimientos.filter(p => 
                p.NombreProcedimiento.toLowerCase().includes(query) ||
                (p.Descripcion && p.Descripcion.toLowerCase().includes(query))
            );
        }

        // Ordenar: Seleccionados primero
        this.filteredProcedimientos = baseList.sort((a, b) => {
            const isASelected = this.selectedProcedimientoIds.includes(a.ProcedimientoId);
            const isBSelected = this.selectedProcedimientoIds.includes(b.ProcedimientoId);
            if (isASelected && !isBSelected) return -1;
            if (!isASelected && isBSelected) return 1;
            return 0;
        });
    }

    /**
     * Gestionar selección de procedimientos
     */
    toggleProcedimiento(id: number): void {
        const index = this.selectedProcedimientoIds.indexOf(id);
        if (index > -1) {
            this.selectedProcedimientoIds.splice(index, 1);
        } else {
            this.selectedProcedimientoIds.push(id);
        }
    }

    isProcedimientoSelected(id: number): boolean {
        return this.selectedProcedimientoIds.includes(id);
    }

    /**
     * Filtrar submódulos basados en el módulo padre
     */
    filterSubmodulos(moduloPadreId: number): void {
        this.submodulosFiltrados = this.modulos.filter(m => m.ModuloPadreId === moduloPadreId);
        
        const subModuloControl = this.form.get('p_IdSubModulo');
        
        if (this.submodulosFiltrados.length > 0) {
            subModuloControl.setValidators([Validators.required]);
        } else {
            subModuloControl.clearValidators();
        }
        
        // Resetear el valor del submódulo al cambiar el padre y actualizar validez
        subModuloControl.setValue(null);
        subModuloControl.updateValueAndValidity();
    }

    selectAccion(accion: any): void {
        this.form.get('p_IdAccion').setValue(accion.AccionId);
        this.selectedAccionName = accion.NombreAccion;
        this.isAccionOpen = false;
    }

    save(): void {
        if (this.form.invalid) return;

        this.isSaving = true;
        const data = this.form.value;
        const finalModuloId = data.p_IdSubModulo || data.p_IdModulo;

        if (this.mode === 'edit') {
            const payload = {
                p_IdPermiso: this.permiso.PermisoId,
                p_IdModulo: finalModuloId,
                p_IdAccion: data.p_IdAccion,
                p_Descripcion: data.p_Descripcion,
                p_IdsProcedimientos: this.selectedProcedimientoIds.join(','),
                p_TipoValidacion: data.p_TipoValidacion,
                p_IdUsuarioActual: 1
            };

            this._seguridadService.updatePermiso(payload).subscribe(res => {
                this.isSaving = false;
                if (res.status) {
                    this._dialogRef.close(true);
                }
            });
            return;
        }

        // Modo Creación: Mantener lógica por cada procedimiento si no hay un SP único de inserción
        if (this.selectedProcedimientoIds.length === 0) {
            this.isSaving = false;
            // Aquí se podría manejar el caso de permiso sin procedimientos si el SP lo permite
            return;
        }

        const requests = this.selectedProcedimientoIds.map(procedimientoId => {
            const payload = {
                p_IdModulo: finalModuloId,
                p_IdAccion: data.p_IdAccion,
                p_IdProcedimiento: procedimientoId,
                p_Descripcion: data.p_Descripcion,
                p_TipoValidacion: data.p_TipoValidacion,
                p_IdUsuarioActual: 1
            };
            return this._seguridadService.savePermisoProcedimiento(payload).toPromise();
        });

        Promise.all(requests)
            .then(() => {
                this.isSaving = false;
                this._dialogRef.close(true);
            })
            .catch(() => {
                this.isSaving = false;
            });
    }

    close(): void {
        this._dialogRef.close();
    }

    /**
     * Selectores Personalizados
     */
    toggleModulo(): void {
        this.isModuloOpen = !this.isModuloOpen;
        this.isSubModuloOpen = false;
    }

    toggleSubModulo(): void {
        this.isSubModuloOpen = !this.isSubModuloOpen;
        this.isModuloOpen = false;
        this.isAccionOpen = false;
    }

    toggleAccionSelect(): void {
        this.isAccionOpen = !this.isAccionOpen;
        this.isModuloOpen = false;
        this.isSubModuloOpen = false;
    }

    selectModulo(modulo: Modulo): void {
        this.form.get('p_IdModulo').setValue(modulo.ModuloId);
        this.isModuloOpen = false;
    }

    selectSubModulo(modulo: Modulo | null): void {
        this.form.get('p_IdSubModulo').setValue(modulo ? modulo.ModuloId : null);
        this.isSubModuloOpen = false;
    }
}
