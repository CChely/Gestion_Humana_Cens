import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
import { User, Usuario, UsuariosResponse, RolCatalogo, RolesResponse, RegistroUsuarioRequest, RegistroUsuarioResponse } from 'app/core/user/user.types';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService
{
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User)
    {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User>
    {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<User>
    {
        return this._httpClient.get<User>('api/common/user').pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any>
    {
        return this._httpClient.patch<User>('api/common/user', {user}).pipe(
            map((response) => {
                this._user.next(response);
            })
        );
    }

    /**
     * Get all usuarios from API
     */
    getUsuarios(): Observable<Usuario[]>
    {
        return this._httpClient.get<UsuariosResponse>(`${environment.apiUrl}/usuarios`).pipe(
            map((response) => response.data)
        );
    }

    /**
     * Get all roles from API
     */
    getRoles(): Observable<RolCatalogo[]>
    {
        return this._httpClient.get<RolesResponse>(`${environment.apiUrl}/roles`).pipe(
            map((response) => response.data)
        );
    }

    /**
     * Register a new user
     */
    registrarUsuario(data: RegistroUsuarioRequest): Observable<RegistroUsuarioResponse>
    {
        return this._httpClient.post<RegistroUsuarioResponse>(`${environment.apiUrl}/usuarios/registrar`, data);
    }

    /**
     * Generate a random secure password
     */
    generatePassword(length: number = 12): string
    {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*';
        const allChars = uppercase + lowercase + numbers + symbols;

        let password = '';

        // Ensure at least one character from each category
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += symbols[Math.floor(Math.random() * symbols.length)];

        // Fill the rest randomly
        for (let i = password.length; i < length; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }

        // Shuffle the password
        return password.split('').sort(() => Math.random() - 0.5).join('');
    }
}
