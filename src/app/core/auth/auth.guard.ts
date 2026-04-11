import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Guard funcional que protege rutas privadas
 * Verifica si el usuario está autenticado basándose en el Signal de autenticación
 */
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Verificar si el usuario está autenticado
    if ( authService.isAuthenticated() )
    {
        // El usuario está autenticado, permitir acceso a la ruta
        return true;
    }

    // El usuario no está autenticado
    // Guardar la URL intentada para redirigir después del login
    const returnUrl = state.url;

    // Redirigir al login con la URL de retorno
    router.navigate(
        ['/sign-in'],
        { queryParams: { returnUrl: returnUrl } }
    );

    return false;
};

/**
 * Guard funcional inverso - redirige al dashboard si ya está autenticado
 * Útil para evitar que usuarios autenticados accedan a páginas de login
 */
export const noAuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Si el usuario NO está autenticado, permitir acceso
    if ( !authService.isAuthenticated() )
    {
        return true;
    }

    // Si ya está autenticado, redirigir al dashboard
    router.navigate(['/dashboard']);
    return false;
};
