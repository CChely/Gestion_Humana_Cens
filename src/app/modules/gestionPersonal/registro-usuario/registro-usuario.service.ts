import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, map } from 'rxjs';
import { RolCatalogo, RolesCatalogoResponse, Usuario, UsuariosResponse } from './registro-usuario.types';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RegistroUsuarioService
{
    private _usuarios: BehaviorSubject<Usuario[] | null> = new BehaviorSubject(null);
    private _rolesCatalogo: BehaviorSubject<RolCatalogo[] | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get usuarios$(): Observable<Usuario[]>
    {
        return this._usuarios.asObservable();
    }

    /**
     * Synchronous snapshot of the current users list
     */
    getUsuariosSnapshot(): Usuario[] | null
    {
        return this._usuarios.getValue();
    }

    get rolesCatalogo$(): Observable<RolCatalogo[]>
    {
        return this._rolesCatalogo.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all users — GET /usuarios
     */
    getUsuarios(): Observable<UsuariosResponse>
    {
        return this._httpClient.get<UsuariosResponse>(`${environment.apiUrl}/usuarios`).pipe(
            tap((response) => {
                if (response.status) {
                    // Normalize roles: ensure NombreRol is always populated
                    const normalized = response.data.map(u => ({
                        ...u,
                        roles: (u.roles ?? []).map(r => ({
                            ...r,
                            NombreRol     : r.NombreRol ?? (r as any).Nombre ?? '',
                            DescripcionRol: r.DescripcionRol ?? (r as any).Descripcion ?? ''
                        }))
                    }));
                    this._usuarios.next(normalized);
                }
            })
        );
    }

    /**
     * Get roles catalogue — GET /roles (cached after first call)
     */
    getRolesCatalogo(): Observable<RolCatalogo[]>
    {
        const cached = this._rolesCatalogo.getValue();
        if (cached) {
            return of(cached);
        }

        return this._httpClient.get<RolesCatalogoResponse>(`${environment.apiUrl}/roles`).pipe(
            map((response) => response.data),
            tap((roles) => this._rolesCatalogo.next(roles))
        );
    }

    /**
     * Create a new user — POST /usuarios/registrar
     */
    crearUsuario(correo: string, password: string, roles: number[]): Observable<any>
    {
        return this._httpClient.post<any>(`${environment.apiUrl}/usuarios/registrar`, {
            correo,
            password,
            roles
        }).pipe(
            tap((response) => {
                if (response?.status) {
                    // Reload full list to get server-assigned ID and data
                    this.getUsuarios().subscribe();
                }
            })
        );
    }

    /**
     * Update user email and roles — PUT /usuarios/:id
     */
    updateUsuario(usuarioId: number, correo: string, rolIds: number[]): Observable<any>
    {
        return this._httpClient.put<any>(`${environment.apiUrl}/usuarios/${usuarioId}`, {
            correo,
            roles: rolIds
        }).pipe(
            tap((response) => {
                if (response?.status) {
                    const current = this._usuarios.getValue();
                    if (current) {
                        const updated = current.map(u =>
                            u.UsuarioId === usuarioId ? { ...u, Correo: correo } : u
                        );
                        this._usuarios.next(updated);
                    }
                }
            })
        );
    }

    /**
     * Delete user — DELETE /usuarios/:id
     */
    deleteUsuario(usuarioId: number): Observable<any>
    {
        return this._httpClient.delete<any>(`${environment.apiUrl}/usuarios/${usuarioId}`).pipe(
            tap((response) => {
                if (response?.status) {
                    const current = this._usuarios.getValue();
                    if (current) {
                        const updated = current.filter(u => u.UsuarioId !== usuarioId);
                        this._usuarios.next(updated);
                    }
                }
            })
        );
    }
}
