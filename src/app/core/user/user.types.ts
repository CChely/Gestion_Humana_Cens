export interface User {
    id: string;
    name: string;
    correo: string;
    avatar?: string;
    status?: string;
}

export interface Rol {
    RolId: number;
    NombreRol: string;
    DescripcionRol: string;
    FechaAsignacion: string;
}

export interface Usuario {
    UsuarioId: number;
    Correo: string;
    Estado: boolean;
    FechaCreacion: string;
    roles: Rol[];
}

export interface UsuariosResponse {
    data: Usuario[];
    errors: any[];
    message: string;
    metadata: any[];
    status: boolean;
}

export interface RolCatalogo {
    RolId: number;
    Nombre: string;
    Descripcion: string;
}

export interface RolesResponse {
    data: RolCatalogo[];
    errors: any[];
    message: string;
    metadata: any[];
    status: boolean;
}

export interface RegistroUsuarioRequest {
    correo: string;
    password: string;
    roles: number[];
}

export interface RegistroUsuarioResponse {
    data: any;
    errors: any[];
    message: string;
    metadata: any[];
    status: boolean;
}
