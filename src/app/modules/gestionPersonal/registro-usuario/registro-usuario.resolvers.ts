import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { RegistroUsuarioService } from 'app/modules/gestionPersonal/registro-usuario/registro-usuario.service';
import { Usuario, RolCatalogo } from 'app/core/user/user.types';

@Injectable({
    providedIn: 'root'
})
export class RegistroUsuarioUsuariosResolver implements Resolve<any>
{
    constructor(private _registroUsuarioService: RegistroUsuarioService)
    {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Usuario[]>
    {
        return this._registroUsuarioService.getUsuarios();
    }
}

@Injectable({
    providedIn: 'root'
})
export class RegistroUsuarioUsuarioResolver implements Resolve<any>
{
    constructor(
        private _registroUsuarioService: RegistroUsuarioService,
        private _router: Router
    )
    {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Usuario>
    {
        const id = route.paramMap.get('id');

        // Check if this is a new usuario
        if (id === 'new') {
            return this._registroUsuarioService.createUsuario();
        }

        // For existing usuarios, first ensure we have the usuarios list loaded
        return this._registroUsuarioService.getUsuarios().pipe(
            switchMap(() => this._registroUsuarioService.getUsuarioById(id)),
            catchError((error) => {
                console.error(error);
                const parentUrl = state.url.split('/').slice(0, -1).join('/');
                this._router.navigateByUrl(parentUrl);
                return throwError(error);
            })
        );
    }
}

@Injectable({
    providedIn: 'root'
})
export class RegistroUsuarioRolesResolver implements Resolve<any>
{
    constructor(private _registroUsuarioService: RegistroUsuarioService)
    {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RolCatalogo[]>
    {
        return this._registroUsuarioService.getRoles();
    }
}
