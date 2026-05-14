import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';

@Injectable()
export class InterceptorData implements HttpInterceptor {

    private authService = inject(AuthService);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Obtener el token del servicio de autenticación
        const token = this.authService.token();
        let authReq = req;

        // Agregamos el Token a las peticiones.
        // Opcionalmente puedes validar: if (req.url.includes('v1/collection/doit/')) para que solo actúe ahí
        if (token) {
            authReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            });
        }

        // Pasar la request al siguiente interceptor o al servidor
        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {

                // Detectar error 401 (No autorizado) en los llamados a DataService
                if (error.status === 401) {
                    this.authService.signOut();
                    console.warn('Acceso no autorizado o token expirado en DataService.');
                }
                if (error.status === 403) {
                    console.warn('Acceso denegado en DataService');
                }

                return throwError(() => error);
            })
        );
    }
}
