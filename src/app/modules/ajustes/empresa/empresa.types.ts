export interface Empresa {
    EmpresaId: number;
    NombreEmpresa: string;
    RucEmpresa: string;
    ImagenEmpresa?: string;
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
        p_Imagen: string;
        p_IdUsuarioActual: string;
    };
    params: any;
}
