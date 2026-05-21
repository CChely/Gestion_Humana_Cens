import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, tap, take, map, filter } from 'rxjs';
import { Navigation } from 'app/core/navigation/navigation.types';
import { AuthService, PermissionNode } from 'app/core/auth/auth.service';
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
     * Map PermissionNode to FuseNavigationItem recursively
     */
    private _mapNodeToNavItem(node: PermissionNode): FuseNavigationItem {
        const hasChildren = node.hijos && node.hijos.length > 0;
        const isRoot = node.parentId === null;

        let type: 'basic' | 'collapsable' | 'group' = 'basic';
        if (isRoot) {
            type = hasChildren ? 'group' : 'basic';
        } else {
            type = hasChildren ? 'collapsable' : 'basic';
        }

        const navItem: FuseNavigationItem = {
            id: node.id || (node.title || 'menu-item-' + Math.random()).toLowerCase().replace(/ /g, '-'),
            title: node.title || '',
            type: type,
            icon: node.icono || undefined,
            link: node.ruta ? (node.ruta.startsWith('/') ? node.ruta : '/' + node.ruta) : undefined,
        };

        if (hasChildren) {
            navItem.children = node.hijos.map(h => this._mapNodeToNavItem(h));
        }

        return navItem;
    }

    /**
     * Update navigation from permissions
     *
     * @param permissions
     * @private
     */
    private _updateNavigationFromPermissions(permissions: PermissionNode[]): void
    {
        const mappedNavigation: FuseNavigationItem[] = permissions.map(p => this._mapNodeToNavItem(p));

        // Actualizar todos los tipos de navegación con el mismo menú dinámico
        this._navigation.next({
            compact: mappedNavigation,
            default: mappedNavigation,
            futuristic: mappedNavigation,
            horizontal: mappedNavigation
        });
    }
}
