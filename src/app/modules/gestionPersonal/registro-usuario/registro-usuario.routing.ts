import { Route } from '@angular/router';
import { RegistroUsuarioUsuariosResolver, RegistroUsuarioUsuarioResolver, RegistroUsuarioRolesResolver } from 'app/modules/gestionPersonal/registro-usuario/registro-usuario.resolvers';
import { CanDeactivateRegistroUsuarioDetails } from 'app/modules/gestionPersonal/registro-usuario/registro-usuario.guards';
import { RegistroUsuarioComponent } from 'app/modules/gestionPersonal/registro-usuario/registro-usuario.component';
import { RegistroUsuarioListComponent } from 'app/modules/gestionPersonal/registro-usuario/list/list.component';
import { RegistroUsuarioDetailsComponent } from 'app/modules/gestionPersonal/registro-usuario/details/details.component';

export const registroUsuarioRoutes: Route[] = [
    {
        path     : '',
        component: RegistroUsuarioComponent,
        children : [
            {
                path     : '',
                component: RegistroUsuarioListComponent,
                resolve  : {
                    usuarios: RegistroUsuarioUsuariosResolver
                },
                children : [
                    {
                        path     : ':id',
                        component: RegistroUsuarioDetailsComponent,
                        canDeactivate: [CanDeactivateRegistroUsuarioDetails]
                    }
                ]
            }
        ]
    }
];
