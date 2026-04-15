import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RegistroUsuarioDetailsComponent } from 'app/modules/gestionPersonal/registro-usuario/details/details.component';

@Injectable({
    providedIn: 'root'
})
export class CanDeactivateRegistroUsuarioDetails implements CanDeactivate<RegistroUsuarioDetailsComponent>
{
    canDeactivate(
        component: RegistroUsuarioDetailsComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
        // Get the next route
        let nextRoute: ActivatedRouteSnapshot = nextState.root;
        while ( nextRoute.firstChild )
        {
            nextRoute = nextRoute.firstChild;
        }

        // If the next state doesn't contain '/registro-usuario'
        // it means we are navigating away from the
        // registro-usuario app
        if ( !nextState.url.includes('/registro-usuario') )
        {
            // Let it navigate
            return true;
        }

        // If we are navigating to another usuario...
        if ( nextRoute.paramMap.get('id') )
        {
            // Just navigate
            return true;
        }
        // Otherwise, just navigate (the list component will handle drawer closing)
        else
        {
            return true;
        }
    }
}
