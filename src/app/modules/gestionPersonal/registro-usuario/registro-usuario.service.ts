import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { Usuario, RolCatalogo, RegistroUsuarioRequest, UsuariosResponse, RolesResponse } from 'app/core/user/user.types';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RegistroUsuarioService
{
    private _usuario: BehaviorSubject<Usuario | null> = new BehaviorSubject(null);
    private _usuarios: BehaviorSubject<Usuario[] | null> = new BehaviorSubject(null);
    private _roles: BehaviorSubject<RolCatalogo[] | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get usuario$(): Observable<Usuario>
    {
        return this._usuario.asObservable().pipe(
            filter(usuario => usuario !== null)
        );
    }

    get usuarios$(): Observable<Usuario[]>
    {
        return this._usuarios.asObservable();
    }

    get roles$(): Observable<RolCatalogo[]>
    {
        return this._roles.asObservable();
    }

    setUsuario(usuario: Usuario): void
    {
        this._usuario.next(usuario);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    getUsuarios(): Observable<Usuario[]>
    {
        return this._httpClient.get<UsuariosResponse>(`${environment.apiUrl}/usuarios`).pipe(
            tap((response) => {
                this._usuarios.next(response.data);
            }),
            map((response) => response.data)
        );
    }

    searchUsuarios(query: string): Observable<Usuario[]>
    {
        return this._httpClient.get<UsuariosResponse>(`${environment.apiUrl}/usuarios`, {
            params: { query }
        }).pipe(
            tap((response) => {
                this._usuarios.next(response.data);
            }),
            map((response) => response.data)
        );
    }

    getUsuarioById(id: string): Observable<Usuario>
    {
        return this._usuarios.pipe(
            take(1),
            map((usuarios) => {
                // If usuarios is null or empty, return null
                if (!usuarios || usuarios.length === 0) {
                    return null;
                }
                const usuario = usuarios.find(item => item.UsuarioId === parseInt(id)) || null;
                this._usuario.next(usuario);
                return usuario;
            }),
            switchMap((usuario) => {
                if (!usuario) {
                    return throwError('No se pudo encontrar el usuario con id ' + id + '!');
                }
                return of(usuario);
            })
        );
    }

    getRoles(): Observable<RolCatalogo[]>
    {
        return this._httpClient.get<RolesResponse>(`${environment.apiUrl}/roles`).pipe(
            tap((response) => {
                this._roles.next(response.data);
            }),
            map((response) => response.data)
        );
    }

    createUsuario(): Observable<Usuario>
    {
        // Generate a new temporary usuario with a temporary ID (like contacts does)
        const newUsuario: Usuario = {
            UsuarioId: Date.now(), // Temporary ID using timestamp
            Correo: '',
            Estado: true,
            FechaCreacion: null,
            roles: []
        };

        // Add to the usuarios list temporarily
        this._usuarios.pipe(take(1)).subscribe(usuarios => {
            if (usuarios) {
                this._usuarios.next([newUsuario, ...usuarios]);
            } else {
                this._usuarios.next([newUsuario]);
            }
        });

        // Set the new usuario as the current usuario
        this._usuario.next(newUsuario);

        // Return the new usuario
        return of(newUsuario);
    }

    registrarUsuario(usuarioData: RegistroUsuarioRequest): Observable<any>
    {
        return this._httpClient.post(`${environment.apiUrl}/usuarios/registrar`, usuarioData).pipe(
            tap((response: any) => {
                // Refresh the usuarios list after registration
                this.getUsuarios().subscribe();
            })
        );
    }

    updateUsuario(id: number, usuario: Usuario): Observable<Usuario>
    {
        return this.usuarios$.pipe(
            take(1),
            switchMap(usuarios => this._httpClient.patch<Usuario>(`${environment.apiUrl}/usuarios/${id}`, usuario).pipe(
                map((updatedUsuario) => {
                    // Find the index of the updated usuario
                    const index = usuarios.findIndex(item => item.UsuarioId === id);
                    // Update the usuario
                    usuarios[index] = updatedUsuario;
                    // Update the usuarios
                    this._usuarios.next(usuarios);
                    // Return the updated usuario
                    return updatedUsuario;
                }),
                switchMap(updatedUsuario => this.usuario$.pipe(
                    take(1),
                    filter(item => item && item.UsuarioId === id),
                    tap(() => {
                        // Update the usuario if it's selected
                        this._usuario.next(updatedUsuario);
                        // Return the updated usuario
                        return updatedUsuario;
                    })
                ))
            ))
        );
    }

    deleteUsuario(id: number): Observable<boolean>
    {
        return this.usuarios$.pipe(
            take(1),
            switchMap(usuarios => this._httpClient.delete(`${environment.apiUrl}/usuarios/${id}`).pipe(
                map((isDeleted: boolean) => {
                    // Find the index of the deleted usuario
                    const index = usuarios.findIndex(item => item.UsuarioId === id);
                    // Delete the usuario
                    usuarios.splice(index, 1);
                    // Update the usuarios
                    this._usuarios.next(usuarios);
                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }

    generatePassword(length: number = 12): string
    {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*';
        const allChars = uppercase + lowercase + numbers + symbols;

        let password = '';
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += symbols[Math.floor(Math.random() * symbols.length)];

        for (let i = password.length; i < length; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }

        return password.split('').sort(() => Math.random() - 0.5).join('');
    }
}
