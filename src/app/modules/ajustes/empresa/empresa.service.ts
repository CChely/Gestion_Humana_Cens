import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";
import {
    EmpresaResponse,
    EmpresaRequest,
    EmpresaInsertRequest,
} from "./empresa.types";

/** Respuesta del endpoint de subida de archivos */
export interface FileUploadResponse {
    data: {
        baseCodeFile: string;
        name: string;
    };
}

export interface FileDownloadResponse {
    data: {
        extension: string;
        fileName: string;
        bytesFile: string;
        contentType: string;
    };
    status: boolean;
}

const FILE_BASE_FOLDER = 'CB581EF0-4736-4091-BC49-314AE485CFFB';

@Injectable({
    providedIn: "root",
})
export class EmpresaService {
    constructor(private _httpClient: HttpClient) {}

    /**
     * Get list of companies — POST /collection/doit/uspEmpresaListar
     */
    listarEmpresas(): Observable<EmpresaResponse> {
        const request: EmpresaRequest = { data: null, params: null };
        return this._httpClient.post<EmpresaResponse>(
            `${environment.apiUrl}/collection/doit/uspEmpresaListar`,
            request,
        );
    }

    /**
     * Insert a new company — POST /collection/doit/uspEmpresaInsertar
     */
    insertarEmpresa(request: EmpresaInsertRequest): Observable<EmpresaResponse> {
        return this._httpClient.post<EmpresaResponse>(
            `${environment.apiUrl}/collection/doit/uspEmpresaInsertar`,
            request,
        );
    }

    /**
     * Update an existing company — POST /collection/doit/uspEmpresaActualizar
     */
    actualizarEmpresa(request: any): Observable<EmpresaResponse> {
        return this._httpClient.post<EmpresaResponse>(
            `${environment.apiUrl}/collection/doit/uspEmpresaActualizar`,
            request,
        );
    }

    /**
     * Delete a company — POST /collection/doit/uspEmpresaEliminar
     */
    eliminarEmpresa(request: any): Observable<EmpresaResponse> {
        return this._httpClient.post<EmpresaResponse>(
            `${environment.apiUrl}/collection/doit/uspEmpresaEliminar`,
            request,
        );
    }

    /**
     * Sube una imagen al servidor de archivos y retorna el baseCodeFile.
     * POST http://localhost:8086/api/file/upload
     */
    uploadImagen(file: File): Observable<FileUploadResponse> {
        const token = localStorage.getItem('accessToken') ?? '';

        const formData = new FormData();
        formData.append('BaseCodeFolder', FILE_BASE_FOLDER);
        formData.append('file', file, file.name);

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        return this._httpClient.post<FileUploadResponse>(`${environment.apiUrl}/file/upload`, formData, { headers });
    }

    /**
     * Descarga una imagen por su baseCode.
     * GET {apiUrl}/file/download/{baseCode}
     */
    downloadImagen(baseCode: string): Observable<FileDownloadResponse> {
        return this._httpClient.get<FileDownloadResponse>(`${environment.apiUrl}/file/download/${baseCode}`);
    }
}
