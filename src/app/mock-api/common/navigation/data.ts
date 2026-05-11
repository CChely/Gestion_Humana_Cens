/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'pages',
        title: 'Pages',
        subtitle: 'Custom made page designs',
        type: 'group',
        icon: 'heroicons_outline:document',
        children: [

            {
                id: 'pages.error',
                title: 'Error',
                type: 'collapsable',
                icon: 'heroicons_outline:exclamation-circle',
                children: [
                    {
                        id: 'pages.error.404',
                        title: '404',
                        type: 'basic',
                        link: '/pages/error/404'
                    },
                    {
                        id: 'pages.error.500',
                        title: '500',
                        type: 'basic',
                        link: '/pages/error/500'
                    }
                ]
            },

            {
                id: 'pages.maintenance',
                title: 'Maintenance',
                type: 'basic',
                icon: 'heroicons_outline:exclamation',
                link: '/pages/maintenance'
            },


        ]
    },
    {
        id: 'gestion-personal',
        title: 'Gestión Personal',
        subtitle: 'Administración de personal',
        type: 'group',
        icon: 'heroicons_outline:user-group',
        children: [
            {
                id: 'gestion-personal.maestro-empleado',
                title: 'Maestro Empleado',
                type: 'basic',
                icon: 'heroicons_outline:user',
                link: '/gestion-personal/maestro-empleado'
            },
            {
                id: 'gestion-personal.contrato',
                title: 'Contrato',
                type: 'basic',
                icon: 'heroicons_outline:document-text',
                link: '/gestion-personal/contrato'
            },
            {
                id: 'gestion-personal.registro-usuario',
                title: 'Registro de usuario',
                type: 'basic',
                icon: 'heroicons_outline:user-add',
                link: '/gestion-personal/registro-usuario'
            }
        ]
    },
    {
        id: 'carga-masiva',
        title: 'Carga-masiva',
        subtitle: 'Carga masiva',
        type: 'basic',
        icon: 'heroicons_outline:cloud-upload',
        link: '/carga-masiva',
        children: []
    },
    {
        id: 'alertas',
        title: 'Alertas',
        subtitle: 'Alertas',
        type: 'basic',
        icon: 'heroicons_outline:bell',
        link: '/alertas',
        children: []
    },
    {
        id: 'reportes',
        title: 'Reportes',
        subtitle: 'Informes del sistema',
        type: 'group',
        icon: 'heroicons_outline:chart-bar',
        children: [
            {
                id: 'reportes.analisis5ta-categoria',
                title: 'Análisis 5ta Categoría',
                type: 'basic',
                icon: 'heroicons_outline:calculator',
                link: '/reportes/analisis5ta-categoria'
            },
            {
                id: 'reportes.vencimiento-contrato',
                title: 'Vencimiento Contrato',
                type: 'basic',
                icon: 'heroicons_outline:calendar',
                link: '/reportes/vencimiento-contrato'
            }
        ]
    },

    {
        id: 'ajustes',
        title: 'Ajustes',
        subtitle: 'Configuraciones del sistema',
        type: 'group',
        icon: 'heroicons_outline:adjustments',
        children: [
            {
                id: 'ajustes.diccionario-variables',
                title: 'Diccionario de Variables',
                type: 'basic',
                icon: 'heroicons_outline:book-open',
                link: '/ajustes/diccionario-variables'
            },
            {
                id: 'ajustes.documento-impresion',
                title: 'Documentos de Impresión',
                type: 'basic',
                icon: 'heroicons_outline:printer',
                link: '/ajustes/documento-impresion'
            },
            {
                id: 'ajustes.configuracion-perfil',
                title: 'Configuración de Perfil',
                type: 'basic',
                icon: 'heroicons_outline:user-circle',
                link: '/ajustes/configuracion-perfil'
            },
            {
                id: 'ajustes.configuracion-seguridad',
                title: 'Configuración de seguridad',
                type: 'basic',
                icon: 'heroicons_outline:shield-check',
                link: '/ajustes/configuracion-seguridad'
            },
            {
                id: 'ajustes.empresa',
                title: 'Empresa',
                type: 'basic',
                icon: 'heroicons_outline:office-building',
                link: '/ajustes/empresa'
            },
            {
                id: 'ajustes.organigrama',
                title: 'Organigrama',
                type: 'basic',
                icon: 'heroicons_outline:share',
                link: '/ajustes/organigrama'
            }
        ]
    },


    {
        id: 'mantenimiento',
        title: 'Mantenimiento',
        subtitle: 'Tablas maestras',
        type: 'group',
        icon: 'heroicons_outline:database',
        children: [
            {
                id: 'mantenimiento.puesto-jerarquia',
                title: 'Puesto Jerarquía',
                type: 'basic',
                icon: 'heroicons_outline:briefcase',
                link: '/mantenimiento/puesto-jerarquia'
            },
            {
                id: 'mantenimiento.area',
                title: 'Área',
                type: 'basic',
                icon: 'heroicons_outline:collection',
                link: '/mantenimiento/area'
            },
            {
                id: 'mantenimiento.proyecto',
                title: 'Proyecto',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-list',
                link: '/mantenimiento/proyecto'
            },
            {
                id: 'mantenimiento.ubigeo',
                title: 'Ubigeo',
                type: 'basic',
                icon: 'heroicons_outline:location-marker',
                link: '/mantenimiento/ubigeo'
            }
        ]
    },

    {
        id: 'apps',
        title: 'Applications',
        subtitle: 'Custom made application designs',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [


            {
                id: 'apps.contacts',
                title: 'Contacts',
                type: 'basic',
                icon: 'heroicons_outline:user-group',
                link: '/apps/contacts'
            },

            {
                id: 'apps.file-manager',
                title: 'File Manager',
                type: 'basic',
                icon: 'heroicons_outline:cloud',
                link: '/apps/file-manager'
            },



        ]
    },

    {
        id: 'divider-1',
        type: 'divider'
    },

    {
        id: 'divider-2',
        type: 'divider'
    },
    // {
    //     id: 'navigation-features',
    //     title: 'Navigation features',
    //     subtitle: 'Collapsable levels & badge styles',
    //     type: 'group',
    //     icon: 'heroicons_outline:menu',
    //     children: [
    //         {
    //             id: 'navigation-features.level.0',
    //             title: 'Level 0',
    //             icon: 'heroicons_outline:check-circle',
    //             type: 'collapsable',
    //             children: [
    //                 {
    //                     id: 'navigation-features.level.0.1',
    //                     title: 'Level 1',
    //                     type: 'collapsable',
    //                     children: [
    //                         {
    //                             id: 'navigation-features.level.0.1.2',
    //                             title: 'Level 2',
    //                             type: 'collapsable',
    //                             children: [
    //                                 {
    //                                     id: 'navigation-features.level.0.1.2.3',
    //                                     title: 'Level 3',
    //                                     type: 'collapsable',
    //                                     children: [
    //                                         {
    //                                             id: 'navigation-features.level.0.1.2.3.4',
    //                                             title: 'Level 4',
    //                                             type: 'collapsable',
    //                                             children: [
    //                                                 {
    //                                                     id: 'navigation-features.level.0.1.2.3.4.5',
    //                                                     title: 'Level 5',
    //                                                     type: 'collapsable',
    //                                                     children: [
    //                                                         {
    //                                                             id: 'navigation-features.level.0.1.2.3.4.5.6',
    //                                                             title: 'Level 6',
    //                                                             type: 'basic'
    //                                                         }
    //                                                     ]
    //                                                 }
    //                                             ]
    //                                         }
    //                                     ]
    //                                 }
    //                             ]
    //                         }
    //                     ]
    //                 }
    //             ]
    //         },
    //         {
    //             id: 'navigation-features.level.0',
    //             title: 'Level 0',
    //             subtitle: 'With subtitle',
    //             icon: 'heroicons_outline:check-circle',
    //             type: 'collapsable',
    //             children: [
    //                 {
    //                     id: 'navigation-features.level.0.1-1',
    //                     title: 'Level 1.1',
    //                     type: 'basic'
    //                 },
    //                 {
    //                     id: 'navigation-features.level.0.1-2',
    //                     title: 'Level 1.2',
    //                     type: 'basic'
    //                 }
    //             ]
    //         },
    //         {
    //             id: 'navigation-features.active',
    //             title: 'Active item',
    //             subtitle: 'Manually marked as active',
    //             icon: 'heroicons_outline:check-circle',
    //             type: 'basic',
    //             active: true
    //         },
    //         {
    //             id: 'navigation-features.disabled-collapsable',
    //             title: 'Disabled collapsable',
    //             subtitle: 'Some subtitle',
    //             icon: 'heroicons_outline:check-circle',
    //             type: 'collapsable',
    //             disabled: true,
    //             children: [
    //                 {
    //                     id: 'navigation-features.disabled-collapsable.child',
    //                     title: 'You shouldn\'t be able to see this child',
    //                     type: 'basic'
    //                 }
    //             ]
    //         },
    //         {
    //             id: 'navigation-features.disabled-basic',
    //             title: 'Disabled basic',
    //             subtitle: 'Some subtitle',
    //             icon: 'heroicons_outline:check-circle',
    //             type: 'basic',
    //             disabled: true
    //         },
    //         {
    //             id: 'navigation-features.badge-style-oval',
    //             title: 'Oval badge',
    //             icon: 'heroicons_outline:tag',
    //             type: 'basic',
    //             badge: {
    //                 title: '8',
    //                 classes: 'w-5 h-5 bg-teal-400 text-black rounded-full'
    //             }
    //         },
    //         {
    //             id: 'navigation-features.badge-style-rectangle',
    //             title: 'Rectangle badge',
    //             icon: 'heroicons_outline:tag',
    //             type: 'basic',
    //             badge: {
    //                 title: 'Updated!',
    //                 classes: 'px-2 bg-teal-400 text-black rounded'
    //             }
    //         },
    //         {
    //             id: 'navigation-features.badge-style-rounded',
    //             title: 'Rounded badge',
    //             icon: 'heroicons_outline:tag',
    //             type: 'basic',
    //             badge: {
    //                 title: 'NEW',
    //                 classes: 'px-2.5 bg-teal-400 text-black rounded-full'
    //             }
    //         },
    //         {
    //             id: 'navigation-features.badge-style-simple',
    //             title: 'Simple badge',
    //             icon: 'heroicons_outline:tag',
    //             type: 'basic',
    //             badge: {
    //                 title: '87 Unread',
    //                 classes: 'text-teal-500'
    //             }
    //         },
    //         {
    //             id: 'navigation-features.multi-line',
    //             title: 'A multi line navigation item title example which works just fine',
    //             icon: 'heroicons_outline:check-circle',
    //             type: 'basic'
    //         }
    //     ]
    // }
];
export const compactNavigation: FuseNavigationItem[] = [

    {
        id: 'apps',
        title: 'Apps',
        tooltip: 'Apps',
        type: 'aside',
        icon: 'heroicons_outline:qrcode',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    // {
    //     id: 'navigation-features',
    //     title: 'Navigation',
    //     tooltip: 'Navigation',
    //     type: 'aside',
    //     icon: 'heroicons_outline:menu',
    //     children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    // }
];
export const futuristicNavigation: FuseNavigationItem[] = [

    {
        id: 'apps',
        title: 'APPS',
        type: 'group',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'others',
        title: 'OTHERS',
        type: 'group'
    },
    {
        id: 'user-interface',
        title: 'User Interface',
        type: 'aside',
        icon: 'heroicons_outline:collection',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    // {
    //     id: 'navigation-features',
    //     title: 'Navigation Features',
    //     type: 'aside',
    //     icon: 'heroicons_outline:menu',
    //     children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    // }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'gestion-personal',
        title: 'Gestión Personal',
        type: 'group',
        icon: 'heroicons_outline:user-group',
        children: []
    },
    {
        id: 'carga-masiva',
        title: 'Carga-masiva',
        type: 'basic',
        icon: 'heroicons_outline:lightning-bolt',
        link: '/carga-masiva',
        children: []
    },
    {
        id: 'alertas',
        title: 'Alertas',
        type: 'basic',
        icon: 'heroicons_outline:bell',
        link: '/alertas',
        children: []
    },
    {
        id: 'reportes',
        title: 'Reportes',
        type: 'group',
        icon: 'heroicons_outline:chart-bar',
        children: []
    },
    {
        id: 'mantenimiento',
        title: 'Mantenimiento',
        type: 'group',
        icon: 'heroicons_outline:database',
        children: []
    },
    {
        id: 'ajustes',
        title: 'Ajustes',
        type: 'group',
        icon: 'heroicons_outline:adjustments',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'Apps',
        type: 'group',
        icon: 'heroicons_outline:qrcode',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'pages',
        title: 'Pages',
        type: 'group',
        icon: 'heroicons_outline:document-duplicate',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    // {
    //     id: 'navigation-features',
    //     title: 'Misc',
    //     type: 'group',
    //     icon: 'heroicons_outline:menu',
    //     children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    // }
];
