export interface Empresa {
    EmpresaId: number;
    NombreEmpresa: string;
    RucEmpresa: string;
    ImagenEmpresa?: string;
    FirmaEmpresa?: string;
    DireccionEmpresa?: string;
    MovilEmpresa?: string;
    CorreoEmpresa?: string;
    SitioWebEmpresa?: string;
    FechaRegistro?: string;
    [key: string]: any;
}

export interface EmpresaResponse {
    data: Empresa[];
    errors: any[];
    message: string;
    metadata: any[];
    status: boolean;
}

export interface EmpresaRequest {
    data: any;
    params: any;
}

export interface EmpresaInsertRequest {
    data: {
        p_Nombre: string;
        p_Ruc: string;
        p_Imagen?: string;
        p_Firma?: string;
        p_Direccion?: string;
        p_CorreoElectronico?: string;
        p_Movil?: string;
        p_SitioWeb?: string;
        p_IdUsuarioActual: string;
    };
    params: any;
}

export interface EmpresaUpdateRequest {
    data: {
        p_IdEmpresa: number;
        p_Nombre: string;
        p_Ruc: string;
        p_Imagen?: string;
        p_Firma?: string;
        p_Direccion?: string;
        p_Movil?: string;
        p_CorreoElectronico?: string;
        p_SitioWeb?: string;
        p_IdUsuarioActual: string;
    };
    params: any;
}
