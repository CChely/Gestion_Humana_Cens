import { Route } from '@angular/router';
import { RegistroUsuarioComponent } from './registro-usuario.component';
import { RegistroUsuarioListComponent } from './list/list.component';
import { RegistroUsuarioDetailsComponent } from './details/details.component';

export const registroUsuarioSimpleRoutes: Route[] = [
    {
        path: '',
        component: RegistroUsuarioComponent,
        children: [
            {
                path: '',
                component: RegistroUsuarioListComponent,
                children: [
                    {
                        path: ':id',
                        component: RegistroUsuarioDetailsComponent,
                    }
                ]
            }
        ]
    }
];
