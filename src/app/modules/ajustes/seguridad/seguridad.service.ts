import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { Rol, RolResponse, Permiso, PermisoResponse, Modulo, ModuloResponse } from './seguridad.types';

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
     * Obtener todos los módulos disponibles
     */
    getModulos(): Observable<ModuloResponse> {
        return this._httpClient.post<ModuloResponse>(`${environment.apiUrl}/collection/doit/dbo.uspModuloListar`, {
            "data": null,
            "params": null
        });
    }

    /**
     * Obtener módulos asignados a un rol
     */
    getModulosByRol(rolId: number): Observable<ModuloResponse> {
        return this._httpClient.post<ModuloResponse>(`${environment.apiUrl}/collection/doit/dbo.uspRolModuloListar`, {
            "data": null,
            "params": null
        });
    }

    /**
     * Guardar o actualizar Rol
     */
    saveRol(rol: Partial<Rol>): Observable<any> {
        console.log('Guardando rol:', rol);
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
     * Guardar un nuevo módulo
     */
    saveModulo(data: any): Observable<any> {
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
}
