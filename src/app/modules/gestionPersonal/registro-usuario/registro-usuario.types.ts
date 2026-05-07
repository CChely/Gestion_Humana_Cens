export interface Rol {
    NombreRol: string;
    DescripcionRol: string;
    FechaAsignacion: string;
    RolId: number;
    // Some API responses use these alternative field names
    Nombre?: string;
    Descripcion?: string;
}

// Rol as returned by GET /roles endpoint
export interface RolCatalogo {
    RolId: number;
    Nombre: string;
    Descripcion: string;
}

export interface RolesCatalogoResponse {
    data: RolCatalogo[];
    errors: any[];
    message: string;
    metadata: any[];
    status: boolean;
}

export interface Usuario {
    UsuarioId: number;
    Correo: string;
    Estado: boolean;
    FechaCreacion: string;
    roles: Rol[];
    avatar?: string;
    Nombres?: string;
    ProveedorArchivos?: string;
}

export interface UsuariosResponse {
    data: Usuario[];
    errors: any[];
    message: string;
    metadata: any[];
    status: boolean;
}
