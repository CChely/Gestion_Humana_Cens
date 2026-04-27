import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor
{
    private authService = inject(AuthService);

    /**
     * Intercept
     *
     * @param req
     * @param next
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        // Obtener el token del servicio
        const token = this.authService.token();

        // Clonar la request y agregar el header de autorización si existe token
        let authReq = req;
        if ( token )
        {
            authReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            });
        }

        // Pasar la request al siguiente interceptor o al servidor
        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {

                // Detectar error 401 (No autorizado)
                if ( error.status === 401 )
                {
                    // Limpiar la autenticación
                    this.authService.signOut();

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
    }
}
