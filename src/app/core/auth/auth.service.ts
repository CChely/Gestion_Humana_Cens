import { Injectable, inject, signal, computed, effect } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, of, switchMap, throwError } from "rxjs";
import { AuthUtils } from "app/core/auth/auth.utils";
import { UserService } from "app/core/user/user.service";
import { Router } from "@angular/router";
import { environment } from "environments/environment";

export interface LoginResponse {
    data: {
        contenedorArchivo: string;
        proveedorArchivo: string;
        correo: string;
        roles: string[];
        avatar: string;
        usuarioId: number;
        token: string;
        nombres: string;
    };
    errors: any[];
    message: string;
    metadata: any[];
    status: boolean;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: { id: string; correo: string; name: string } | null;
    token: string | null;
    permissions: PermissionNode[] | null;
    containerId: string | null;
}

export interface PermissionNode {
    id: string;
    parentId: string | null;
    title: string;
    ruta: string;
    icono: string | null;
    esVisibleMenu: boolean;
    esActivo: boolean;
    orden: number;
    permisos: string[];
    hijos: PermissionNode[];
}

export interface PermissionsResponse {
    data: PermissionNode[];
    errors: any[];
    message: string;
    metadata: any[];
    status: boolean;
}

@Injectable()
export class AuthService {
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);
    private _router = inject(Router);

    /** Signal holding the current authentication state */
    private _authState = signal<AuthState>({
        isAuthenticated: false,
        user: null,
        token: null,
        permissions: null,
        containerId: null,
    });

    /** Computed signals for easy consumption */
    public isAuthenticated = computed(() => this._authState().isAuthenticated);
    public user = computed(() => this._authState().user);
    public token = computed(() => this._authState().token);
    public permissions = computed(() => this._authState().permissions);
    public containerId = computed(() => this._authState().containerId);

    constructor() {
        // Initialise from localStorage on boot
        this._initializeAuthState();

        // Persist any changes to localStorage for later restores
        effect(() => {
            const state = this._authState();
            if (state.token) {
                localStorage.setItem("accessToken", state.token);
                localStorage.setItem("containerId", state.containerId ?? "");
                if (state.user) {
                    localStorage.setItem("user", JSON.stringify(state.user));
                }
                if (state.permissions) {
                    localStorage.setItem("permissions", JSON.stringify(state.permissions));
                }
            }
        });
    }

    /** Load state from localStorage if available and valid */
    private _initializeAuthState(): void {
        const token = localStorage.getItem("accessToken");
        const userData = localStorage.getItem("user");
        const containerId = localStorage.getItem("containerId");

        if (token && !AuthUtils.isTokenExpired(token)) {
            let user = null;
            if (userData) {
                try {
                    user = JSON.parse(userData);
                } catch (e) {
                    console.error(
                        "Error parsing user data from localStorage",
                        e,
                    );
                }
            }

            let permissions = null;
            const permissionsData = localStorage.getItem("permissions");
            if (permissionsData) {
                try {
                    permissions = JSON.parse(permissionsData);
                } catch (e) {
                    console.error("Error parsing permissions data", e);
                }
            }

            this._authState.set({
                isAuthenticated: true,
                user: user,
                token: token,
                permissions: permissions,
                containerId: containerId,
            });

            if (user) {
                // Load persisted avatar URL if available (set during sign‑in)
                const persistedAvatar =
                    localStorage.getItem("userAvatarUrl") ?? "";
                this._userService.user = {
                    id: user.id,
                    correo: user.correo || user.email,
                    name: user.name,
                    avatar: persistedAvatar,
                    status: user.status || "online",
                };
            }
        }
    }

    /** Compatibility getter for existing code */
    get accessToken(): string {
        return this.token() ?? "";
    }

    /** Compatibility setter for existing code */
    set accessToken(token: string) {
        this._authState.update((state) => ({ ...state, token }));
    }

    /**
     * Set permissions
     *
     * @param permissions
     */
    set permissionsValue(permissions: PermissionNode[]) {
        this._authState.update((state) => ({
            ...state,
            permissions: permissions,
        }));
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /** Sign‑in logic, mapping the response to our state */
    signIn(credentials: {
        correo: string;
        password: string;
    }): Observable<LoginResponse> {
        return this._httpClient
            .post<LoginResponse>(
                `${environment.apiUrl}/auth/login`,
                credentials,
            )
            .pipe(
                switchMap((response: LoginResponse) => {
                    if (
                        response.status &&
                        response.data &&
                        response.data.token
                    ) {
                        const userData = {
                            id: response.data.usuarioId.toString(),
                            correo: response.data.correo,
                            name: response.data.nombres,
                            status:
                                response.data.roles &&
                                    response.data.roles.length > 0
                                    ? response.data.roles[0]
                                    : "online",
                        };

                        // Persist both the token and the container id
                        this._authState.set({
                            isAuthenticated: true,
                            user: userData,
                            token: response.data.token,
                            permissions: null, // Será actualizado por el componente
                            containerId: response.data.contenedorArchivo,
                        });

                        // Persist container id outside the effect path for immediate usage
                        localStorage.setItem(
                            "containerId",
                            response.data.contenedorArchivo ?? "",
                        );

                        this._userService.user = {
                            id: userData.id,
                            correo: userData.correo,
                            name: userData.name,
                            avatar: response.data.avatar || "",
                            status: "online",
                        };

                        return of(response);
                    }

                    return throwError({
                        error: { message: response.message || "Login failed" },
                    });
                }),
                catchError((error: HttpErrorResponse) => {
                    const msg = error.error?.message || "Error logging in";
                    return throwError({ error: { message: msg } });
                }),
            );
    }

    /** Sign‑out: clear state and storage */
    signOut(): void {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("containerId");

        this._authState.set({
            isAuthenticated: false,
            user: null,
            token: null,
            permissions: null,
            containerId: null,
        });

        this._userService.user = null;
        // Redirigir al login
        localStorage.removeItem("permissions");
        this._router.navigate(["/sign-in"]);
    }

    /**
     * Get permissions for the current user
     */
    getPermissions(): Observable<PermissionsResponse> {
        return this._httpClient.get<PermissionsResponse>(
            `${environment.apiUrl}/auth/permissions`,
            {},
        );
    }

    // Additional auth helpers – minimal implementations
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post("api/auth/forgot-password", email);
    }

    resetPassword(password: string): Observable<any> {
        return this._httpClient.post("api/auth/reset-password", password);
    }

    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        return this._httpClient.post("api/auth/sign-up", user);
    }

    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post("api/auth/unlock-session", credentials);
    }

    logOut(): Observable<any> {
        return this._httpClient.delete("api/auth/logout").pipe(
            switchMap(() => {
                this.signOut();
                return of(true);
            }),
        );
    }

    confirmationRequired(confirmationRequired: boolean): void {
        // Optional: implement confirmation logic
    }

    passwordReset(password: string): Observable<any> {
        return this._httpClient.post("api/auth/password-reset", { password });
    }

    /** Utility: check if token already present and valid */
    check(): Observable<boolean> {
        if (this.isAuthenticated()) {
            return of(true);
        }
        if (!this.accessToken) {
            return of(false);
        }
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }
        return this.signInUsingToken();
    }

    /** Refresh stored token using the backend refresh endpoint */
    signInUsingToken(): Observable<any> {
        return this._httpClient
            .post("api/auth/refresh-access-token", {
                accessToken: this.accessToken,
            })
            .pipe(
                catchError(() => of(false)),
                switchMap((response: any) => {
                    if (response && response.accessToken) {
                        this._authState.update((state) => ({
                            ...state,
                            token: response.accessToken,
                            containerId:
                                response.data?.contenedorArchivo ??
                                state.containerId,
                        }));

                        // Persist new container id if returned
                        const newCid = response.data?.contenedorArchivo;
                        if (newCid) {
                            localStorage.setItem("containerId", newCid);
                        }

                        this._userService.user = response.user ?? null;
                    }
                    return of(true);
                }),
            );
    }

    /** Simple expiration check */
    checkTokenExpiration(): boolean {
        const token = this.token();
        if (!token) {
            return true;
        }
        return AuthUtils.isTokenExpired(token);
    }
}
