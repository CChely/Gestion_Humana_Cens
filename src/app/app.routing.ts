import { Route } from '@angular/router';
import { authGuard, noAuthGuard } from 'app/core/auth/auth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { MainModule } from './modules/parametrizacion/main/main.module';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/dashboards/project'
    {path: '', pathMatch : 'full', redirectTo: 'dashboards/analytics'},

    // Redirect signed in user to the '/dashboards/project'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'dashboards/analytics'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [noAuthGuard],
        canActivateChild: [noAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [authGuard],
        canActivateChild: [authGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)}
        ]
    },

    // Landing routes
    {
        path: '',
        component  : LayoutComponent,
        data: {
            layout: 'empty'
        },
        children   : [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
        ]
    },

    // Admin routes
    {
        path       : '',
        canActivate: [authGuard],
        canActivateChild: [authGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [

            // Dashboards
            {path: 'dashboards', children: [
                  {path: 'analytics', loadChildren: () => import('app/modules/admin/dashboards/analytics/analytics.module').then(m => m.AnalyticsModule)},
            ]},

            // Apps
            {path: 'apps', children: [
                 {path: 'contacts', loadChildren: () => import('app/modules/admin/apps/contacts/contacts.module').then(m => m.ContactsModule)},
                 {path: 'file-manager', loadChildren: () => import('app/modules/admin/apps/file-manager/file-manager.module').then(m => m.FileManagerModule)},
            ]},

            // Ajustes
            {path: 'ajustes', children: [
                {path: 'diccionario-variables', loadChildren: () => import('app/modules/ajustes/diccionario-variables/diccionario-variables.module').then(m => m.DiccionarioVariablesModule)},
                {path: 'documento-impresion', loadChildren: () => import('app/modules/ajustes/documento-impresion/documento-impresion.module').then(m => m.DocumentoImpresionModule)},
                {path: 'configuracion-perfil', loadChildren: () => import('app/modules/ajustes/configuracion-perfil/configuracion-perfil.module').then(m => m.ConfiguracionPerfilModule)},
                {path: 'configuracion-seguridad', loadChildren: () => import('app/modules/ajustes/seguridad/seguridad.module').then(m => m.SeguridadModule)},
                {path: 'configuracion-almacenamiento', loadChildren: () => import('app/modules/ajustes/configuracion-almacenamiento/configuracion-almacenamiento.module').then(m => m.ConfiguracionAlmacenamientoModule)},
                {path: 'empresa', loadChildren: () => import('app/modules/ajustes/empresa/empresa.module').then(m => m.EmpresaModule)},
                {path: 'organigrama', loadChildren: () => import('app/modules/ajustes/organigrama/organigrama.module').then(m => m.OrganigramaModule)},
            ]},

            // Alertas
            {path: 'alertas', loadChildren: () => import('app/modules/alertas/alertas.module').then(m => m.AlertasModule)},

            // Carga Masiva
            {path: 'carga-masiva', loadChildren: () => import('app/modules/carga-masiva/carga-masiva.module').then(m => m.CargaMasivaModule)},

            // Gestion Personal
            {path: 'gestion-personal', children: [
                {path: 'maestro-empleado-list', loadChildren: () => import('app/modules/gestionPersonal/maestro-empleado-list/maestro-empleado-list.module').then(m => m.MaestroEmpleadoListModule)},
                {path: 'maestro-empleado', loadChildren: () => import('app/modules/gestionPersonal/maestro-empleado/maestro-empleado.module').then(m => m.MaestroEmpleadoModule)},
                {path: 'maestro-areas', loadChildren: () => import('app/modules/gestionPersonal/maestro-areas/maestro-areas.module').then(m => m.MaestroAreasModule)},
                {path: 'contrato', loadChildren: () => import('app/modules/gestionPersonal/contrato/contrato.module').then(m => m.ContratoModule)},
                {path: 'registro-usuario', loadChildren: () => import('app/modules/gestionPersonal/registro-usuario/registro-usuario.module').then(m => m.RegistroUsuarioModule)},
            ]},

            // Parametrizacion
            {path: 'parametrizacion', loadChildren: () => import('app/modules/parametrizacion/main/main.module').then(m => m.MainModule)},

            // Mantenimiento
            {path: 'mantenimiento', children: [
                {path: 'puesto-jerarquia', loadChildren: () => import('app/modules/mantenimiento/puesto-jerarquia/puesto-jerarquia.module').then(m => m.PuestoJerarquiaModule)},
                {path: 'area', loadChildren: () => import('app/modules/mantenimiento/area/area.module').then(m => m.AreaModule)},
                {path: 'main', loadChildren: () => import('app/modules/mantenimiento/main/main.module').then(m => m.MainModule)},
                {path: 'ubigeo', loadChildren: () => import('app/modules/mantenimiento/ubigeo/ubigeo.module').then(m => m.UbigeoModule)},
            ]},

            // Reportes
            {path: 'reportes', children: [
                {path: 'analisis5ta-categoria', loadChildren: () => import('app/modules/reportes/analisis5ta-categoria/analisis5ta-categoria.module').then(m => m.Analisis5taCategoriaModule)},
                {path: 'vencimiento-contrato', loadChildren: () => import('app/modules/reportes/vencimiento-contrato/vencimiento-contrato.module').then(m => m.VencimientoContratoModule)},
            ]},

            // Pages
            {path: 'pages', children: [

                // Error
                {path: 'error', children: [
                    {path: '404', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.module').then(m => m.Error404Module)},
                    {path: '500', loadChildren: () => import('app/modules/admin/pages/error/error-500/error-500.module').then(m => m.Error500Module)}
                ]},



            ]},


            // 404 & Catch all
            {path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.module').then(m => m.Error404Module)},
            {path: '**', redirectTo: '404-not-found'}
        ]
    }
];
