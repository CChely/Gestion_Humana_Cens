import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor funcional para adjuntar el token Bearer a las peticiones
 * y manejar errores de autenticación (401)
 */
export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Obtener el token del servicio
    const token = authService.token();

    // Clonar la request y agregar el header de autorización si existe token
    let authReq = req;
    if ( token )
    {
        authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
    }

    // Pasar la request al siguiente interceptor o al servidor
    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {

            // Detectar error 401 (No autorizado)
            if ( error.status === 401 )
            {
                // Limpiar la autenticación
                authService.signOut();

                // Opcional: mostrar un mensaje al usuario
                console.warn('Token expirado o inválido. Redirigiendo al login...');
            }

            // Detectar error 403 (Prohibido)
            if ( error.status === 403 )
            {
                // El usuario no tiene permisos para acceder a este recurso
                console.warn('Acceso denegado');
            }

            // Propagar el error
            return throwError(() => error);
        })
    );
};
