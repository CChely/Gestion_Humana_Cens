import { Injectable, OnDestroy, inject, NgZone } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { distinctUntilChanged, filter } from "rxjs/operators";
import { Client, IFrame, IMessage, StompSubscription } from "@stomp/stompjs";
import * as SockJS from "sockjs-client";

import { AuthService } from "app/core/auth/auth.service";
import { PermissionUpdateEvent } from "app/core/models/permission-update-event.model";
import { environment } from "environments/environment";

/**
 * Servicio encargado de mantener una única conexión WebSocket/STOMP
 * para recibir notificaciones cuando los permisos del usuario cambian.
 *
 * - Se conecta a /ws enviando el JWT como query parameter.
 * - Se suscribe a /user/queue/permissions.
 * - Reconexión automática con backoff exponencial (máx. 5 intentos).
 * - Refresca permisos vía REST y actualiza el menú de navegación.
 *
 * IMPORTANTE: el WebSocket es una funcionalidad "best-effort". Si el broker
 * no está disponible, la red bloquea la conexión o el token no se puede
 * renovar, la aplicación sigue funcionando normalmente; solo dejará de recibir
 * notificaciones en tiempo real hasta la siguiente reconexión exitosa.
 */
@Injectable({
    providedIn: "root",
})
export class PermissionWebSocketService implements OnDestroy {
    private _authService = inject(AuthService);
    private _ngZone = inject(NgZone);

    private _client: Client | null = null;
    private _subscription: StompSubscription | null = null;
    private _reconnectAttempts = 0;
    private _maxReconnectAttempts = 5;
    private _baseReconnectDelayMs = 2000;
    private _maxReconnectDelayMs = 30000;
    private _reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    private _isManualDisconnect = false;
    private _hasTriedTokenRefresh = false;
    private _isRefreshingPermissions = false;
    private _visibilityHandler: (() => void) | null = null;

    private _permissionUpdateSubject =
        new BehaviorSubject<PermissionUpdateEvent | null>(null);

    /**
     * Observable que emite cada vez que llega un evento PERMISSIONS_UPDATED.
     * Se ignoran valores nulos y se descartan duplicados consecutivos
     * (mismo rol y timestamp), útil cuando el backend notifica varios roles.
     */
    public readonly permissionUpdate$: Observable<PermissionUpdateEvent> =
        this._permissionUpdateSubject.asObservable().pipe(
            filter((event): event is PermissionUpdateEvent => !!event),
            distinctUntilChanged(
                (a, b) => a.roleId === b.roleId && a.timestamp === b.timestamp,
            ),
        );

    /**
     * Estado de conexión expuesto como observable.
     */
    private _connectedSubject = new BehaviorSubject<boolean>(false);
    public readonly connected$ = this._connectedSubject.asObservable();

    constructor() {}

    // -----------------------------------------------------------------------------------------------------
    // @ Conexión / desconexión
    // -----------------------------------------------------------------------------------------------------

    /**
     * Inicia la conexión WebSocket/STMP si existe un token válido.
     * Si ya hay una conexión activa no hace nada.
     */
    connect(): void {
        const token = this._authService.token();

        if (!token) {
            this._log(
                "No hay token JWT disponible; se omite la conexión WebSocket.",
            );
            return;
        }

        if (this._client?.active) {
            this._log("La conexión WebSocket ya está activa.");
            return;
        }

        this._isManualDisconnect = false;
        this._disconnectClient();

        const brokerUrl = this._buildBrokerUrl(token);
        const sockJsUrl = this._buildSockJsUrl(token);

        this._client = new Client({
            // Intentamos WebSocket nativo primero; SockJS como fallback.
            webSocketFactory: () => {
                if (typeof WebSocket !== "undefined") {
                    try {
                        return new WebSocket(brokerUrl);
                    } catch (err) {
                        this._log(
                            "WebSocket nativo no disponible, usando SockJS fallback.",
                        );
                    }
                }
                return new SockJS(sockJsUrl);
            },
            reconnectDelay: 0, // Manejamos la reconexión manualmente.
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (message) => this._log(message),
            onConnect: (frame) =>
                this._ngZone.run(() => this._onConnect(frame)),
            onDisconnect: (frame) =>
                this._ngZone.run(() => this._onDisconnect(frame)),
            onStompError: (frame) =>
                this._ngZone.run(() => this._onStompError(frame)),
            onWebSocketError: (event) =>
                this._ngZone.run(() => this._onWebSocketError(event)),
            onWebSocketClose: (event) =>
                this._ngZone.run(() => this._onWebSocketClose(event)),
        });

        this._client.activate();
        this._registerVisibilityListener();
    }

    /**
     * Cierra la conexión de forma controlada y cancela cualquier reconexión pendiente.
     */
    disconnect(): void {
        this._isManualDisconnect = true;
        this._clearReconnectTimer();
        this._disconnectClient();
        this._connectedSubject.next(false);
    }

    ngOnDestroy(): void {
        this.disconnect();
        this._permissionUpdateSubject.complete();
        this._connectedSubject.complete();
    }

    /**
     * Reintenta la conexión cuando la pestaña vuelve a estar visible,
     * siempre que no haya conexión activa y exista un token.
     */
    private _registerVisibilityListener(): void {
        if (
            typeof window === "undefined" ||
            !window.document ||
            this._visibilityHandler
        ) {
            return;
        }

        this._visibilityHandler = () => {
            if (
                document.visibilityState === "visible" &&
                !this._client?.active &&
                this._authService.token()
            ) {
                this._log("Pestaña visible. Reintentando conexión WebSocket.");
                this._reconnectAttempts = 0;
                this._hasTriedTokenRefresh = false;
                this.connect();
            }
        };

        window.document.addEventListener(
            "visibilitychange",
            this._visibilityHandler,
        );
    }

    private _unregisterVisibilityListener(): void {
        if (this._visibilityHandler && typeof window !== "undefined") {
            window.document.removeEventListener(
                "visibilitychange",
                this._visibilityHandler,
            );
            this._visibilityHandler = null;
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Callbacks STOMP
    // -----------------------------------------------------------------------------------------------------

    private _onConnect(frame: IFrame): void {
        this._log("Conectado al broker STOMP.");
        this._reconnectAttempts = 0;
        this._hasTriedTokenRefresh = false;
        this._connectedSubject.next(true);

        if (!this._client) {
            return;
        }

        this._subscription = this._client.subscribe(
            "user/queue/permissions",
            (message: IMessage) => {
                try {
                    const event: PermissionUpdateEvent = JSON.parse(
                        message.body,
                    );
                    this._handlePermissionUpdate(event);
                } catch (err) {
                    this._log("Error al parsear mensaje de permisos:", err);
                }
            },
        );
    }

    private _onDisconnect(frame: IFrame): void {
        this._log("Desconectado del broker STOMP.");
        this._connectedSubject.next(false);
    }

    private _onStompError(frame: IFrame): void {
        const message = frame.headers["message"] || "";
        this._log("Error STOMP:", message);

        // Si el error parece de autenticación, intentamos refrescar el token
        // una sola vez sin afectar el uso de la aplicación.
        if (this._looksLikeAuthError(message)) {
            this._trySilentTokenRefreshAndReconnect();
            return;
        }

        this._scheduleReconnect();
    }

    private _onWebSocketError(event: Event): void {
        this._log("Error en el WebSocket:", event);
    }

    private _onWebSocketClose(event: CloseEvent): void {
        this._log(
            `WebSocket cerrado. Código: ${event.code}, razón: "${event.reason}"`,
        );
        this._connectedSubject.next(false);

        if (this._isManualDisconnect) {
            return;
        }

        // Códigos comunes de cierre relacionados a rechazo de autenticación/handshake.
        if (event.code === 1002 || event.code === 1008) {
            this._trySilentTokenRefreshAndReconnect();
            return;
        }

        this._scheduleReconnect();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Manejo de eventos y refresco de permisos
    // -----------------------------------------------------------------------------------------------------

    private _handlePermissionUpdate(event: PermissionUpdateEvent): void {
        this._log(
            `Permisos actualizados para el rol "${event.roleName}" (ID: ${event.roleId}).`,
        );

        this._permissionUpdateSubject.next(event);
        this._refreshPermissions();
    }

    private _refreshPermissions(): void {
        if (this._isRefreshingPermissions) {
            return;
        }

        this._isRefreshingPermissions = true;

        this._authService.getPermissions().subscribe({
            next: (response) => {
                this._isRefreshingPermissions = false;
                if (response.status && response.data) {
                    this._authService.permissionsValue = response.data;
                    this._log("Permisos refrescados correctamente.");
                } else {
                    this._log(
                        "Respuesta inesperada al refrescar permisos.",
                        response,
                    );
                }
            },
            error: (err) => {
                this._isRefreshingPermissions = false;
                this._log("Error al refrescar permisos:", err);

                // El refresco de permisos falló; no bloqueamos la aplicación.
                // Si el token realmente expiró, el interceptor/AuthGuard se
                // encargará del flujo de logout en las peticiones REST normales.
            },
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Reconexión automática
    // -----------------------------------------------------------------------------------------------------

    private _scheduleReconnect(): boolean {
        if (this._isManualDisconnect) {
            return false;
        }

        if (this._reconnectAttempts >= this._maxReconnectAttempts) {
            this._log(
                "Máximo de intentos de reconexión alcanzado. La aplicación sigue usable; se reintentará cuando la pestaña vuelva a estar visible.",
            );
            return false;
        }

        const delay = Math.min(
            this._baseReconnectDelayMs * Math.pow(2, this._reconnectAttempts),
            this._maxReconnectDelayMs,
        );
        this._reconnectAttempts++;

        this._log(
            `Reintentando conexión en ${delay}ms (intento ${this._reconnectAttempts}/${this._maxReconnectAttempts}).`,
        );

        this._clearReconnectTimer();
        this._reconnectTimer = setTimeout(() => {
            this.connect();
        }, delay);

        return true;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Manejo de fallos de autenticación (modo silencioso)
    // -----------------------------------------------------------------------------------------------------

    /**
     * Intenta renovar el token una sola vez y reconectar. Si no es posible,
     * simplemente detiene los reintentos; nunca cierra la sesión del usuario
     * porque el WebSocket es una funcionalidad opcional de notificación.
     */
    private _trySilentTokenRefreshAndReconnect(): void {
        if (this._hasTriedTokenRefresh || this._isManualDisconnect) {
            return;
        }

        this._hasTriedTokenRefresh = true;
        this._log(
            "Posible token inválido en WebSocket. Intentando refrescar silenciosamente...",
        );

        this._authService.signInUsingToken().subscribe({
            next: (success) => {
                if (success) {
                    this._log("Token refrescado; reconectando WebSocket.");
                    this._reconnectAttempts = 0;
                    this.connect();
                } else {
                    this._log(
                        "No se pudo refrescar el token desde WebSocket; se detienen reintentos. La aplicación sigue operativa.",
                    );
                    this._clearReconnectTimer();
                }
            },
            error: (err) => {
                this._log(
                    "Error al refrescar token desde WebSocket; se detienen reintentos. La aplicación sigue operativa.",
                    err,
                );
                this._clearReconnectTimer();
            },
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Helpers
    // -----------------------------------------------------------------------------------------------------

    private _buildBrokerUrl(token: string): string {
        const base = environment.wsUrl;
        const isSecure = base.startsWith("https://");
        const host = base.replace(/^https?:\/\//, "");
        const protocol = isSecure ? "wss://" : "ws://";

        return `${protocol}${host}/ws?token=${encodeURIComponent(token)}`;
    }

    private _buildSockJsUrl(token: string): string {
        const base = environment.wsUrl;
        return `${base}/ws?token=${encodeURIComponent(token)}`;
    }

    private _disconnectClient(): void {
        this._unregisterVisibilityListener();

        if (this._subscription) {
            this._subscription.unsubscribe();
            this._subscription = null;
        }

        if (this._client) {
            const client = this._client;
            this._client = null;
            client.deactivate();
        }
    }

    private _clearReconnectTimer(): void {
        if (this._reconnectTimer) {
            clearTimeout(this._reconnectTimer);
            this._reconnectTimer = null;
        }
    }

    private _looksLikeAuthError(message: string): boolean {
        const lower = message.toLowerCase();
        return (
            lower.includes("auth") ||
            lower.includes("token") ||
            lower.includes("unauthorized") ||
            lower.includes("forbidden") ||
            lower.includes("access denied")
        );
    }

    private _log(...args: unknown[]): void {
        if (!environment.production) {
            // eslint-disable-next-line no-console
            console.log("[PermissionWebSocket]", ...args);
        }
    }
}
