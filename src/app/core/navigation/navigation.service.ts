import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, tap, take, map, filter } from 'rxjs';
import { Navigation } from 'app/core/navigation/navigation.types';
import { AuthService, PermissionParent } from 'app/core/auth/auth.service';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
    providedIn: 'root'
})
export class NavigationService
{
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _authService: AuthService
    )
    {
        // Escuchar cambios en los permisos y actualizar la navegación
        toObservable(this._authService.permissions).subscribe((permissions) => {
            this._updateNavigationFromPermissions(permissions || []);
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation>
    {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation>
    {
        return this.navigation$.pipe(
            filter(nav => !!nav),
            take(1)
        );
    }

    /**
     * Update navigation from permissions
     *
     * @param permissions
     * @private
     */
    private _updateNavigationFromPermissions(permissions: PermissionParent[]): void
    {
        const mappedNavigation: FuseNavigationItem[] = permissions.map((p) => {
            return {
                id: p.padre.toLowerCase().replace(/ /g, '-'),
                title: p.padre,
                type: p.ruta ? 'basic' : 'group',
                icon: p.icono,
                link: p.ruta ? (p.ruta.startsWith('/') ? p.ruta : '/' + p.ruta) : undefined,
                children: p.hijos?.map((h) => {
                    return {
                        id: h.nombre.toLowerCase().replace(/ /g, '-'),
                        title: h.nombre,
                        type: h.ruta ? 'basic' : 'collapsable',
                        icon: h.icono,
                        link: h.ruta ? (h.ruta.startsWith('/') ? h.ruta : '/' + h.ruta) : undefined
                    };
                })
            };
        });

        // Actualizar todos los tipos de navegación con el mismo menú dinámico
        this._navigation.next({
            compact: mappedNavigation,
            default: mappedNavigation,
            futuristic: mappedNavigation,
            horizontal: mappedNavigation
        });
    }
}
