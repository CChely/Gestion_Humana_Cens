import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { Router } from '@angular/router';

export interface LoginResponse {
    data: {
        correo: string;
        roles: string[];
        usuarioId: number;
        token: string;
    };
    errors: any[];
    message: string;
    metadata: any[];
    status: boolean;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: {
        id: string;
        email: string;
        name: string;
    } | null;
    token: string | null;
}

@Injectable()
export class AuthService
{
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);
    private _router = inject(Router);

    // Signals para el estado de autenticación
    private _authState = signal<AuthState>({
        isAuthenticated: false,
        user: null,
        token: null
    });

    // Computed signals para obtener datos derivados
    public isAuthenticated = computed(() => this._authState().isAuthenticated);
    public user = computed(() => this._authState().user);
    public token = computed(() => this._authState().token);

    /**
     * Constructor
     */
    constructor()
    {
        // Sincronizar con localStorage al inicializar
        this._initializeAuthState();

        // Effect para persistir cambios en localStorage
        effect(() => {
            const state = this._authState();
            if ( state.token )
            {
                localStorage.setItem('accessToken', state.token);
                if ( state.user )
                {
                    localStorage.setItem('user', JSON.stringify(state.user));
                }
            }
        });
    }

    /**
     * Inicializar el estado de autenticación desde localStorage
     */
    private _initializeAuthState(): void
    {
        const token = localStorage.getItem('accessToken');
        const userData = localStorage.getItem('user');

        if ( token && !AuthUtils.isTokenExpired(token) )
        {
            let user = null;
            if ( userData )
            {
                try
                {
                    user = JSON.parse(userData);
                }
                catch ( e )
                {
                    console.error('Error parsing user data from localStorage', e);
                }
            }

            this._authState.set({
                isAuthenticated: true,
                user: user,
                token: token
            });

            // Actualizar el usuario en el servicio
            if ( user )
            {
                this._userService.user = {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    avatar: '',
                    status: 'online'
                };
            }
        }
    }

    // Getter para compatibilidad con código existente
    get accessToken(): string
    {
        return this.token() ?? '';
    }

    set accessToken(token: string)
    {
        this._authState.update(state => ({
            ...state,
            token: token
        }));
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { correo: string; password: string }): Observable<LoginResponse>
    {
        return this._httpClient.post<LoginResponse>('http://localhost:8080/api/v1/auth/login', credentials).pipe(
            switchMap((response: LoginResponse) => {

                // Validar que la respuesta sea exitosa
                if ( response.status && response.data && response.data.token )
                {
                    const userData = {
                        id: response.data.usuarioId.toString(),
                        email: response.data.correo,
                        name: response.data.correo
                    };

                    // Actualizar el Signal de estado
                    this._authState.set({
                        isAuthenticated: true,
                        user: userData,
                        token: response.data.token
                    });

                    // Actualizar el usuario en el servicio
                    this._userService.user = {
                        id: userData.id,
                        email: userData.email,
                        name: userData.name,
                        avatar: '',
                        status: 'online'
                    };

                    return of(response);
                }

                // Si status es false o no existe token, retornar error
                return throwError({
                    error: {
                        message: response.message || 'An error occurred during sign in'
                    }
                });
            }),
            catchError((error: HttpErrorResponse) => {

                // Manejo de errores HTTP
                if ( error.status === 400 || error.status === 401 )
                {
                    const errorMessage = error.error?.message || 'Invalid credentials';

                    return throwError({
                        error: {
                            message: errorMessage
                        }
                    });
                }

                return throwError({
                    error: {
                        message: error.error?.message || 'An error occurred'
                    }
                });
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): void
    {
        // Limpiar localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');

        // Resetear el estado
        this._authState.set({
            isAuthenticated: false,
            user: null,
            token: null
        });

        // Limpiar el usuario del servicio
        this._userService.user = null;

        // Redirigir al login
        this._router.navigate(['/sign-in']);
    }

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any>
    {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Log out or destroy session
     */
    logOut(): Observable<any>
    {
        return this._httpClient.delete('api/auth/logout').pipe(
            switchMap(() => {
                this.signOut();
                return of(true);
            })
        );
    }

    /**
     * Confirmation required
     *
     * @param confirmationRequired
     */
    confirmationRequired(confirmationRequired: boolean): void
    {
        // Do something with the confirmation required parameter
    }

    /**
     * Password reset
     *
     * @param password
     */
    passwordReset(password: string): Observable<any>
    {
        return this._httpClient.post('api/auth/password-reset', { password });
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this.isAuthenticated() )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        // Renew token
        return this._httpClient.post('api/auth/refresh-access-token', {
            accessToken: this.accessToken
        }).pipe(
            catchError(() => of(false)),
            switchMap((response: any) => {

                // Store the access token in the local storage
                if ( response && response.accessToken )
                {
                    this._authState.update(state => ({
                        ...state,
                        token: response.accessToken
                    }));

                    // Store the user on the user service
                    this._userService.user = response.user;
                }

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Check token expiration
     */
    checkTokenExpiration(): boolean
    {
        const token = this.token();
        if ( !token )
        {
            return true;
        }
        return AuthUtils.isTokenExpired(token);
    }
}
