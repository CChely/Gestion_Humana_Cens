export interface Permiso {
    PermisoId: number;
    ModuloId: number;
    AccionId: number;
    CodigoPermiso: string;
    DescripcionPermiso: string;
    NombreModulo?: string;
    CodigoModulo?: string;
    NombreAccion?: string;
    CodigoAccion?: string;
}

export interface Modulo {
    ModuloId: number;
    ModuloPadreId: number | null;
    CodigoModulo: string;
    NombreModulo: string;
    RutaModulo: string;
    IconoModulo: string;
    OrdenModulo: number;
    EsVisibleMenu: number;
    EsActivo: number;
}

export interface Rol {
    RolId: number;
    NombreRol: string;
    DescripcionRol: string;
    FechaRegistro?: string;
    FechaModificacion?: string;
    permisos?: Permiso[];
    modulos?: Modulo[];
    activo?: boolean;
}

export interface RolResponse {
    status: boolean;
    data: Rol[];
    message: string;
}

export interface PermisoResponse {
    status: boolean;
    data: Permiso[];
    message: string;
}

export interface ModuloResponse {
    status: boolean;
    data: Modulo[];
    message: string;
}
