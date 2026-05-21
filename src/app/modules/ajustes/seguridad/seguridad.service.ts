import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { Rol, RolResponse, Permiso, PermisoResponse, Modulo, ModuloResponse, Procedimiento, ProcedimientoResponse } from './seguridad.types';

@Injectable({
    providedIn: 'root'
})
export class SeguridadService {
    private _apiUrl = environment.apiUrl;

    constructor(private _httpClient: HttpClient) { }

    /**
     * Obtener todos los roles
     */
    getRoles(): Observable<RolResponse> {
        return this._httpClient.post<RolResponse>(`${environment.apiUrl}/collection/doit/dbo.uspRolListar`, {
            "data": null,
            "params": null
        });
    }

    /**
     * Obtener todos los permisos disponibles
     */
    /**
     * Obtener todos los permisos disponibles
     */
    getPermisos(): Observable<PermisoResponse> {
        return this._httpClient.post<PermisoResponse>(`${environment.apiUrl}/collection/doit/dbo.uspPermisoListar`, {
            "data": null,
            "params": null
        });
    }

    /**
     * Obtener detalle completo de un permiso por ID
     */
    getPermisoById(permisoId: number): Observable<any> {
        return this._httpClient.post<any>(`${environment.apiUrl}/collection/doit/dbo.uspPermisoObtenerPorId`, {
            "data": {
                "p_IdPermiso": permisoId
            },
            "params": null
        });
    }

    /**
     * Obtener todos los módulos disponibles
     */
    getModulos(): Observable<ModuloResponse> {
        return this._httpClient.post<ModuloResponse>(`${environment.apiUrl}/collection/doit/dbo.uspModuloListar`, {
            "data": null,
            "params": null
        });
    }

    /**
     * Obtener catálogo de acciones (para permisos)
     */
    getAcciones(): Observable<any> {
        return this._httpClient.post<any>(`${environment.apiUrl}/collection/doit/dbo.uspAccionListar`, {
            "data": null,
            "params": null
        });
    }

    /**
     * Obtener módulos asignados a un rol
     */
    getModulosByRol(rolId: number): Observable<ModuloResponse> {
        return this._httpClient.post<ModuloResponse>(`${environment.apiUrl}/collection/doit/dbo.uspRolModuloListar`, {
            "data": {
                "p_IdRol": rolId
            },
            "params": null
        });
    }

    /**
     * Obtener permisos asignados a un rol
     */
    getPermisosByRol(rolId: number): Observable<any> {
        return this._httpClient.post<any>(`${environment.apiUrl}/collection/doit/dbo.uspRolPermisoObtenerPorId`, {
            "data": {
                "p_IdRol": rolId
            },
            "params": null
        });
    }

    /**
     * Guardar o actualizar Rol
     */
    saveRol(rol: Partial<Rol>): Observable<any> {
        if (rol.RolId) {
            return this.updateRol(rol);
        }

        return this._httpClient.post(`${environment.apiUrl}/collection/doit/dbo.uspRolInsertar`, {
            "data": {
                "p_Nombre": rol.NombreRol,
                "p_Descripcion": rol.DescripcionRol || '',
                "p_IdUsuarioActual": 1 // TODO: Obtener del servicio de autenticación
            },
            "params": null
        });
    }

    /**
     * Actualizar rol existente (pendiente de SP en backend)
     */
    private updateRol(rol: Partial<Rol>): Observable<any> {
        console.log('Actualizando rol:', rol);
        return of({ status: true, message: 'Rol guardado correctamente' });
    }

    /**
     * Eliminar Rol
     */
    deleteRol(id: number): Observable<any> {
        console.log('Eliminando rol:', id);
        return of({ status: true, message: 'Rol eliminado correctamente' });
    }

    /**
     * Guardar un nuevo módulo o actualizar uno existente
     */
    saveModulo(data: any): Observable<any> {
        if (data.p_IdModulo) {
            return this.updateModulo(data);
        }

        return this._httpClient.post(`${environment.apiUrl}/collection/doit/dbo.uspModuloInsertar`, {
            "data": {
                "p_IdModuloPadre": data.p_IdModuloPadre || null,
                "p_Codigo": data.p_Codigo,
                "p_Nombre": data.p_Nombre,
                "p_Ruta": data.p_Ruta || null,
                "p_Icono": data.p_Icono || null,
                "p_Orden": data.p_Orden || 0,
                "p_EsVisibleMenu": data.p_EsVisibleMenu ? 1 : 0,
                "p_EsActivo": data.p_EsActivo ? 1 : 0,
                "p_IdUsuarioActual": 1 // TODO: Obtener del servicio de autenticación
            },
            "params": null
        });
    }

    /**
     * Actualizar un módulo existente
     */
    updateModulo(data: any): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/collection/doit/dbo.uspModuloActualizar`, {
            "data": {
                "p_IdModulo": data.p_IdModulo,
                "p_IdModuloPadre": data.p_IdModuloPadre || null,
                "p_Codigo": data.p_Codigo,
                "p_Nombre": data.p_Nombre,
                "p_Ruta": data.p_Ruta || null,
                "p_Icono": data.p_Icono || null,
                "p_Orden": data.p_Orden || 0,
                "p_EsVisibleMenu": data.p_EsVisibleMenu ? 1 : 0,
                "p_EsActivo": data.p_EsActivo ? 1 : 0,
                "p_IdUsuarioActual": 1 // TODO: Obtener del servicio de autenticación
            },
            "params": null
        });
    }

    /**
     * Eliminar un módulo existente
     */
    deleteModulo(idModulo: number): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/collection/doit/dbo.uspModuloEliminar`, {
            "data": {
                "p_IdModulo": idModulo,
                "p_IdUsuarioActual": 1 // TODO: Obtener del servicio de autenticación
            },
            "params": null
        });
    }

    /**
     * Guardar asociación de permiso con procedimiento
     */
    savePermisoProcedimiento(data: any): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/collection/doit/dbo.uspPermisoProcedimientoInsertar`, {
            "data": {
                "p_IdModulo": data.p_IdModulo,
                "p_IdAccion": data.p_IdAccion,
                "p_IdProcedimiento": data.p_IdProcedimiento,
                "p_Descripcion": data.p_Descripcion,
                "p_TipoValidacion": data.p_TipoValidacion || 'OR',
                "p_IdUsuarioActual": 1
            },
            "params": null
        });
    }

    /**
     * Obtener lista de procedimientos
     */
    getProcedimientos(): Observable<ProcedimientoResponse> {
        return this._httpClient.post<ProcedimientoResponse>(`${environment.apiUrl}/collection/doit/dbo.uspProcedimientoListar`, {
            "data": null,
            "params": null
        });
    }

    /**
     * Obtener procedimientos asociados a un permiso
     */
    getProcedimientosByPermiso(permisoId: number): Observable<ProcedimientoResponse> {
        return this._httpClient.post<ProcedimientoResponse>(`${environment.apiUrl}/collection/doit/dbo.uspPermisoProcedimientoListar`, {
            "data": {
                "p_IdPermiso": permisoId
            },
            "params": null
        });
    }

    /**
     * Guardar o actualizar procedimiento
     */
    saveProcedimiento(data: any): Observable<any> {
        if (data.p_IdProcedimiento) {
            return this.updateProcedimiento(data);
        }

        return this._httpClient.post(`${environment.apiUrl}/collection/doit/dbo.uspProcedimientoInsertar`, {
            "data": {
                "p_Nombre": data.p_Nombre,
                "p_Descripcion": data.p_Descripcion,
                "p_EsPublico": data.p_EsPublico ? 1 : 0,
                "p_EsActivo": data.p_EsActivo ? 1 : 0,
                "p_IdUsuarioActual": 1
            },
            "params": null
        });
    }

    /**
     * Actualizar procedimiento
     */
    updateProcedimiento(data: any): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/collection/doit/dbo.uspProcedimientoActualizar`, {
            "data": {
                "p_IdProcedimiento": data.p_IdProcedimiento,
                "p_Nombre": data.p_Nombre,
                "p_Descripcion": data.p_Descripcion,
                "p_EsPublico": data.p_EsPublico ? 1 : 0,
                "p_EsActivo": data.p_EsActivo ? 1 : 0,
                "p_IdUsuarioActual": 1
            },
            "params": null
        });
    }

    /**
     * Actualizar permiso existente
     */
    updatePermiso(data: any): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/collection/doit/dbo.uspPermisoActualizar`, {
            "data": {
                "p_IdPermiso": data.p_IdPermiso,
                "p_IdModulo": data.p_IdModulo,
                "p_IdAccion": data.p_IdAccion,
                "p_Descripcion": data.p_Descripcion,
                "p_IdsProcedimientos": data.p_IdsProcedimientos,
                "p_TipoValidacion": data.p_TipoValidacion,
                "p_IdUsuarioActual": 1
            },
            "params": null
        });
    }

    /**
     * Asignar un permiso a un rol
     */
    assignPermisoToRol(rolId: number, permisoId: number, userId: number): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/collection/doit/dbo.uspRolPermisoInsertar`, {
            "data": {
                "p_IdRol": rolId,
                "p_IdPermiso": permisoId,
                "p_IdUsuarioActual": userId
            },
            "params": null
        });
    }

    /**
     * Quitar un permiso asignado a un rol
     */
    removePermisoFromRol(rolId: number, permisoId: number): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/collection/doit/dbo.uspRolPermisoEliminar`, {
            "data": {
                "p_IdRol": rolId,
                "p_IdPermiso": permisoId
            },
            "params": null
        });
    }

    /**
     * Eliminar procedimiento
     */
    deleteProcedimiento(id: number): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/collection/doit/dbo.uspProcedimientoEliminar`, {
            "data": {
                "p_IdProcedimiento": id,
                "p_IdUsuarioActual": 1
            },
            "params": null
        });
    }
}
