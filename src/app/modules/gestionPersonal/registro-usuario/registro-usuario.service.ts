import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, of, tap, map } from "rxjs";
import {
    RolCatalogo,
    RolesCatalogoResponse,
    Usuario,
    UsuariosResponse,
} from "./registro-usuario.types";
import { environment } from "environments/environment";
import { AuthService } from "app/core/auth/auth.service";

@Injectable({
    providedIn: "root",
})
export class RegistroUsuarioService {
    private _usuarios: BehaviorSubject<Usuario[] | null> = new BehaviorSubject(
        null,
    );
    private _rolesCatalogo: BehaviorSubject<RolCatalogo[] | null> =
        new BehaviorSubject(null);

    constructor(
        private _httpClient: HttpClient,
        private _authService: AuthService,
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get usuarios$(): Observable<Usuario[]> {
        return this._usuarios.asObservable();
    }

    /**
     * Synchronous snapshot of the current users list
     */
    getUsuariosSnapshot(): Usuario[] | null {
        return this._usuarios.getValue();
    }

    get rolesCatalogo$(): Observable<RolCatalogo[]> {
        return this._rolesCatalogo.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all users — GET /usuarios
     */
    getUsuarios(): Observable<UsuariosResponse> {
        return this._httpClient
            .get<UsuariosResponse>(`${environment.apiUrl}/usuarios`)
            .pipe(
                tap((response) => {
                    if (response.status) {
                        // Normalize roles: ensure NombreRol is always populated
                        const normalized = response.data.map((u) => ({
                            ...u,
                            roles: (u.roles ?? []).map((r) => ({
                                ...r,
                                NombreRol:
                                    r.NombreRol ?? (r as any).Nombre ?? "",
                                DescripcionRol:
                                    r.DescripcionRol ??
                                    (r as any).Descripcion ??
                                    "",
                            })),
                        }));
                        this._usuarios.next(normalized);
                    }
                }),
            );
    }

    /**
     * Get roles catalogue — GET /roles (cached after first call)
     */
    getRolesCatalogo(): Observable<RolCatalogo[]> {
        const cached = this._rolesCatalogo.getValue();
        if (cached) {
            return of(cached);
        }

        return this._httpClient
            .get<RolesCatalogoResponse>(`${environment.apiUrl}/roles`)
            .pipe(
                map((response) => response.data),
                tap((roles) => this._rolesCatalogo.next(roles)),
            );
    }

    /**
     * Upload avatar image and get reference — POST /file/upload
     */
    uploadAvatar(
        file: File,
    ): Observable<{ status: boolean; data: string; message?: string }> {
        const formData = new FormData();
        formData.append("file", file, file.name);
        const baseCode = localStorage.getItem("containerId") ?? "";
        debugger;
        formData.append("BaseCodeFolder", baseCode);
        formData.append("token", this._authService.accessToken ?? "");

        return this._httpClient.post<{
            status: boolean;
            data: string;
            message?: string;
        }>(`${environment.apiUrl}/file/upload`, formData);
    }

    /**
     * Create a new user — POST /usuarios/registrar
     */
    crearUsuario(
        correo: string,
        password: string,
        roles: number[],
        nombres?: string,
        avatarRef?: string,
    ): Observable<any> {
        const body: any = {
            correo,
            password,
            roles,
            avatar: avatarRef || "", // Always send avatar as string, empty if not provided
            ProveedorArchivos: "censdrive", // Automatically set to 'censdrive'
        };

        if (nombres) {
            body.nombres = nombres;
        }

        return this._httpClient
            .post<any>(`${environment.apiUrl}/usuarios/registrar`, body)
            .pipe(
                tap((response) => {
                    if (response?.status) {
                        // Reload full list to get server-assigned ID and data
                        this.getUsuarios().subscribe();
                    }
                }),
            );
    }

    /**
     * Update user email and roles — PUT /usuarios/:id
     */
    updateUsuario(
        usuarioId: number,
        correo: string,
        rolIds: number[],
        nombres?: string,
        avatarRef?: string | null,
        removeAvatar?: boolean,
    ): Observable<any> {
        const body: any = {
            correo,
            roles: rolIds,
            avatar: avatarRef || "", // Always send avatar as string, empty if not provided
        };

        if (nombres) {
            body.nombres = nombres;
        }

        if (removeAvatar) {
            body.removeAvatar = true;
            body.avatar = ""; // Explicitly set to empty string when removing
        }

        return this._httpClient
            .put<any>(`${environment.apiUrl}/usuarios/${usuarioId}`, body)
            .pipe(
                tap((response) => {
                    if (response?.status) {
                        const current = this._usuarios.getValue();
                        if (current) {
                            const updated = current.map((u) =>
                                u.UsuarioId === usuarioId
                                    ? { ...u, Correo: correo, Nombres: nombres }
                                    : u,
                            );
                            this._usuarios.next(updated);
                        }
                    }
                }),
            );
    }

    /**
     * Delete user — DELETE /usuarios/:id
     */
    deleteUsuario(usuarioId: number): Observable<any> {
        return this._httpClient
            .delete<any>(`${environment.apiUrl}/usuarios/${usuarioId}`)
            .pipe(
                tap((response) => {
                    if (response?.status) {
                        const current = this._usuarios.getValue();
                        if (current) {
                            const updated = current.filter(
                                (u) => u.UsuarioId !== usuarioId,
                            );
                            this._usuarios.next(updated);
                        }
                    }
                }),
            );
    }
}
