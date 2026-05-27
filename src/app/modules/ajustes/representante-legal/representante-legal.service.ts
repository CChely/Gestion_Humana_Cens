import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

export interface RepresentanteLegalCreateRequest {
    data: {
        p_IdEmpresa: number;
        p_NombreRepresentante: string;
        p_Dni: string;
        p_Firma?: string;
        p_Direccion?: string;
        p_Movil?: string;
        p_CorreoElectronico?: string;
        p_SitioWeb?: string;
        p_IdUsuarioActual: number;
    };
    params: null;
}

export interface RepresentanteLegalUpdateRequest {
    data: {
        p_IdRepresentanteLegal: number;
        p_IdEmpresa: number;
        p_NombreRepresentante: string;
        p_Dni: string;
        p_Firma?: string;
        p_Direccion?: string;
        p_Movil?: string;
        p_CorreoElectronico?: string;
        p_SitioWeb?: string;
        p_IdUsuarioActual: number;
    };
    params: null;
}

export interface RepresentanteLegalDeleteRequest {
    data: {
        p_IdRepresentanteLegal: number;
        p_IdUsuarioActual: number;
    };
    params: null;
}

export interface RepresentanteLegalResponse {
    data: any;
    errors: any[];
    message: string;
    metadata: any[];
    status: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class RepresentanteLegalService {
    constructor(private _httpClient: HttpClient) {}

    /**
     * Crear un nuevo representante legal
     * POST /collection/doit/dbo.uspRepresentanteLegalCrear
     */
    crearRepresentante(request: RepresentanteLegalCreateRequest): Observable<RepresentanteLegalResponse> {
        return this._httpClient.post<RepresentanteLegalResponse>(
            `${environment.apiUrl}/collection/doit/dbo.uspRepresentanteLegalCrear`,
            request
        );
    }

    /**
     * Actualizar un representante legal existente
     * POST /collection/doit/dbo.uspRepresentanteLegalActualizar
     */
    actualizarRepresentante(request: RepresentanteLegalUpdateRequest): Observable<RepresentanteLegalResponse> {
        return this._httpClient.post<RepresentanteLegalResponse>(
            `${environment.apiUrl}/collection/doit/dbo.uspRepresentanteLegalActualizar`,
            request
        );
    }

    /**
     * Eliminar un representante legal
     * POST /collection/doit/dbo.uspRepresentanteLegalEliminar
     */
    eliminarRepresentante(request: RepresentanteLegalDeleteRequest): Observable<RepresentanteLegalResponse> {
        return this._httpClient.post<RepresentanteLegalResponse>(
            `${environment.apiUrl}/collection/doit/dbo.uspRepresentanteLegalEliminar`,
            request
        );
    }

    /**
     * Listar todos los representantes legales
     * POST /collection/doit/dbo.uspRepresentanteLegalListarTodos
     */
    listarRepresentantes(): Observable<RepresentanteLegalResponse> {
        return this._httpClient.post<RepresentanteLegalResponse>(
            `${environment.apiUrl}/collection/doit/dbo.uspRepresentanteLegalListarTodos`,
            { data: null, params: null }
        );
    }
}
