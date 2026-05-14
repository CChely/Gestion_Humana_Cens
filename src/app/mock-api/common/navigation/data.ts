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
                link: '/gestion-personal/maestro-empleado-list'
            },
            {
                id: 'gestion-personal.maestro-areas',
                title: 'Estructura Organizacional',
                type: 'basic',
                icon: 'heroicons_outline:folder',
                link: '/gestion-personal/maestro-areas'
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
                id: 'mantenimiento.datos-personales',
                title: 'Datos Personales',
                type: 'collapsable',
                icon: 'heroicons_outline:identification',
                children: [
                    {
                        id: 'mantenimiento.datos-personales.identidad',
                        title: 'Identidad y Perfil',
                        type: 'collapsable',
                        children: [
                            {
                                id: 'mantenimiento.tipo-documento',
                                title: 'Tipo de Documento',
                                type: 'basic',
                                link: '/mantenimiento/main/tipo-documento',
                                group: 'main'
                            },
                            {
                                id: 'mantenimiento.estado-civil',
                                title: 'Estado Civil',
                                type: 'basic',
                                link: '/mantenimiento/main/estado-civil',
                                group: 'main'
                            },
                            {
                                id: 'mantenimiento.sexo',
                                title: 'Sexo',
                                type: 'basic',
                                link: '/mantenimiento/main/sexo',
                                group: 'main'
                            },
                            {
                                id: 'mantenimiento.grupo-sanguineo',
                                title: 'Grupo Sanguíneo',
                                type: 'basic',
                                link: '/mantenimiento/main/grupo-sanguineo',
                                group: 'main'
                            }
                        ]
                    },
                    {
                        id: 'mantenimiento.datos-personales.domicilio',
                        title: 'Domicilio',
                        type: 'collapsable',
                        children: [
                            {
                                id: 'mantenimiento.indicador-domiciliado',
                                title: 'Indicador Domiciliado',
                                type: 'basic',
                                link: '/mantenimiento/main/indicador-domiciliado',
                                group: 'main'
                            },
                            {
                                id: 'mantenimiento.tipo-via',
                                title: 'Tipo de Vía',
                                type: 'basic',
                                link: '/mantenimiento/main/tipo-via',
                                group: 'main'
                            },
                            {
                                id: 'mantenimiento.tipo-zona',
                                title: 'Tipo de Zona',
                                type: 'basic',
                                link: '/mantenimiento/main/tipo-zona',
                                group: 'main'
                            }
                        ]
                    },
                    {
                        id: 'mantenimiento.datos-personales.familia-educacion',
                        title: 'Familiar y Académico',
                        type: 'collapsable',
                        children: [
                            {
                                id: 'mantenimiento.vinculos-familiares',
                                title: 'Vínculos Familiares',
                                type: 'basic',
                                link: '/mantenimiento/main/vinculos-familiares',
                                group: 'main'
                            },
                            {
                                id: 'mantenimiento.formacion-superior-completa',
                                title: 'Formación Superior Completa',
                                type: 'basic',
                                link: '/mantenimiento/main/formacion-superior-completa',
                                group: 'main'
                            }
                        ]
                    },
                    {
                        id: 'mantenimiento.datos-personales.bancarios',
                        title: 'Datos Bancarios y Pago',
                        type: 'collapsable',
                        children: [
                            {
                                id: 'mantenimiento.tipo-moneda',
                                title: 'Tipo de Moneda',
                                type: 'basic',
                                link: '/mantenimiento/main/tipo-moneda',
                                group: 'main'
                            },
                            {
                                id: 'mantenimiento.unidad-salarial',
                                title: 'Unidad Salarial',
                                type: 'basic',
                                link: '/mantenimiento/main/unidad-salarial',
                                group: 'main'
                            },
                            {
                                id: 'mantenimiento.forma-pago-haberes',
                                title: 'Forma de Pago de Haberes',
                                type: 'basic',
                                link: '/mantenimiento/main/forma-pago-haberes',
                                group: 'main'
                            },
                            {
                                id: 'mantenimiento.periodicidad-remuneracion',
                                title: 'Periodicidad de Remuneración',
                                type: 'basic',
                                link: '/mantenimiento/main/periodicidad-remuneracion',
                                group: 'main'
                            },
                            {
                                id: 'mantenimiento.tipo-cuenta',
                                title: 'Tipo de Cuenta',
                                type: 'basic',
                                link: '/mantenimiento/main/tipo-cuenta',
                                group: 'main'
                            }
                        ]
                    },
                    {
                        id: 'mantenimiento.datos-personales.laborales',
                        title: 'Datos Laborales',
                        type: 'collapsable',
                        children: [
                            {
                                id: 'mantenimiento.modalidad-trabajo',
                                title: 'Modalidad de Trabajo',
                                type: 'basic',
                                link: '/mantenimiento/main/modalidad-trabajo',
                                group: 'main'
                            },
                            {
                                id: 'mantenimiento.tipo-comision',
                                title: 'Tipo de Comisión',
                                type: 'basic',
                                link: '/mantenimiento/main/tipo-comision',
                                group: 'main'
                            },
                            {
                                id: 'mantenimiento.categoria-ctc',
                                title: 'Categoría CTC',
                                type: 'basic',
                                link: '/mantenimiento/main/categoria-ctc',
                                group: 'main'
                            }
                        ]
                    }
                ]
            },
            {
                id: 'mantenimiento.contratacion',
                title: 'Contratación',
                type: 'collapsable',
                icon: 'heroicons_outline:document-text',
                children: [
                    {
                        id: 'mantenimiento.tipo-trabajador',
                        title: 'Tipo de trabajador',
                        type: 'basic',
                        link: '/mantenimiento/main/tipo-trabajador',
                        group: 'main'
                    },
                    {
                        id: 'mantenimiento.regimen-laboral',
                        title: 'Régimen Laboral',
                        type: 'basic',
                        link: '/mantenimiento/main/regimen-laboral',
                        group: 'main'
                    },
                    {
                        id: 'mantenimiento.tipo-contrato',
                        title: 'Tipo de Contrato',
                        type: 'basic',
                        link: '/mantenimiento/main/tipo-contrato',
                        group: 'main'
                    },
                    {
                        id: 'mantenimiento.motivo-contratacion',
                        title: 'Motivo de Contratación',
                        type: 'basic',
                        link: '/mantenimiento/main/motivo-contratacion',
                        group: 'main'
                    }
                ]
            },
            {
                id: 'mantenimiento.modalidad-trabajo',
                title: 'Modalidad de trabajo',
                type: 'collapsable',
                icon: 'heroicons_outline:briefcase',
                children: [
                    {
                        id: 'mantenimiento.situacion-trabajador',
                        title: 'Situacion Trabajador',
                        type: 'basic',
                        link: '/mantenimiento/main/situacion-trabajador',
                        group: 'main'
                    },
                    {
                        id: 'mantenimiento.tipo-jornada',
                        title: 'Tipo de Jornada',
                        type: 'basic',
                        link: '/mantenimiento/main/tipo-jornada',
                        group: 'main'
                    },
                    {
                        id: 'mantenimiento.situacion-especial',
                        title: 'Situación Especial',
                        type: 'basic',
                        link: '/mantenimiento/main/situacion-especial',
                        group: 'main'
                    }
                ]
            },
            {
                id: 'mantenimiento.afiliacion',
                title: 'Afiliación',
                type: 'collapsable',
                icon: 'heroicons_outline:shield-check',
                children: [
                    {
                        id: 'mantenimiento.regimen-essalud',
                        title: 'Regimen Essalud',
                        type: 'basic',
                        link: '/mantenimiento/main/regimen-essalud',
                        group: 'main'
                    },
                    {
                        id: 'mantenimiento.salud-eps',
                        title: 'Salud Eps',
                        type: 'basic',
                        link: '/mantenimiento/main/salud-eps',
                        group: 'main'
                    },
                    {
                        id: 'mantenimiento.regimen-pensionario',
                        title: 'Regimen Pensionario',
                        type: 'basic',
                        link: '/mantenimiento/main/regimen-pensionario',
                        group: 'main'
                    },
                    {
                        id: 'mantenimiento.sctr-salud',
                        title: 'Sctr Salud',
                        type: 'basic',
                        link: '/mantenimiento/main/sctr-salud',
                        group: 'main'
                    },
                    {
                        id: 'mantenimiento.aporte-sctr-salud',
                        title: 'Aporte Sctr Salud',
                        type: 'basic',
                        link: '/mantenimiento/main/aporte-sctr-salud',
                        group: 'main'
                    },
                    {
                        id: 'mantenimiento.sctr-pension',
                        title: 'Sctr Pension',
                        type: 'basic',
                        link: '/mantenimiento/main/sctr-pension',
                        group: 'main'
                    },
                    {
                        id: 'mantenimiento.aporte-sctr-pension',
                        title: 'Aporte Sctr Pension',
                        type: 'basic',
                        link: '/mantenimiento/main/aporte-sctr-pension',
                        group: 'main'
                    }
                ]
            },
            {
                id: 'mantenimiento.remuneracion',
                title: 'Remuneración',
                type: 'collapsable',
                icon: 'heroicons_outline:currency-dollar',
                children: [
                    {
                        id: 'mantenimiento.doble-tributacion',
                        title: 'Doble Tributación',
                        type: 'basic',
                        link: '/mantenimiento/main/doble-tributacion',
                        group: 'main'
                    },
                    {
                        id: 'mantenimiento.tipo-nomina-ria',
                        title: 'Tipo Nomina Ria',
                        type: 'basic',
                        link: '/mantenimiento/main/tipo-nomina-ria',
                        group: 'main'
                    },
                    {
                        id: 'mantenimiento.entidad-financiera',
                        title: 'Entidad Financiera',
                        type: 'basic',
                        link: '/mantenimiento/main/entidad-financiera',
                        group: 'main'
                    }
                ]
            },
            {
                id: 'mantenimiento.rol-organizativo',
                title: 'Rol Organizativo',
                type: 'collapsable',
                icon: 'heroicons_outline:user-group',
                children: [
                    {
                        id: 'mantenimiento.grupo-nomina',
                        title: 'Grupo Nomina',
                        type: 'basic',
                        link: '/mantenimiento/main/grupo-nomina',
                        group: 'main'
                    },
                    {
                        id: 'mantenimiento.categoria-plame',
                        title: 'Categoria Plame',
                        type: 'basic',
                        link: '/mantenimiento/main/categoria-plame',
                        group: 'main'
                    },
                    {
                        id: 'mantenimiento.categoria-ocupacional',
                        title: 'Categoria Ocupacional',
                        type: 'basic',
                        link: '/mantenimiento/main/categoria-ocupacional',
                        group: 'main'
                    },
                    {
                        id: 'mantenimiento.cargo',
                        title: 'Cargo',
                        type: 'basic',
                        link: '/mantenimiento/main/cargo',
                        group: 'main'
                    },
                    {
                        id: 'mantenimiento.ocupacion',
                        title: 'Ocupacion',
                        type: 'basic',
                        link: '/mantenimiento/main/ocupacion',
                        group: 'main'
                    },
                    {
                        id: 'mantenimiento.proyecto-obra',
                        title: 'Proyecto',
                        type: 'basic',
                        link: '/mantenimiento/main/proyecto-obra',
                        group: 'main'
                    },
                    {
                        id: 'mantenimiento.lugar-trabajo',
                        title: 'Lugar de Trabajo',
                        type: 'basic',
                        link: '/mantenimiento/main/lugar-trabajo',
                        group: 'main'
                    }
                ]
            },
            {
                id: 'mantenimiento.educacion',
                title: 'Educación',
                type: 'collapsable',
                icon: 'heroicons_outline:academic-cap',
                children: [
                    {
                        id: 'mantenimiento.situacion-educativa',
                        title: 'Situacion Educativa',
                        type: 'basic',
                        link: '/mantenimiento/main/situacion-educativa',
                        group: 'main'
                    },
                    {
                        id: 'mantenimiento.especialidad-ctc',
                        title: 'Especialidad Ctc',
                        type: 'basic',
                        link: '/mantenimiento/main/especialidad-ctc',
                        group: 'main'
                    }
                ]
            },
            {
                id: 'mantenimiento.datos-complementarios',
                title: 'Datos Complementarios',
                type: 'collapsable',
                icon: 'heroicons_outline:collection',
                children: [
                    {
                        id: 'mantenimiento.empresas-externas',
                        title: 'Empresas Externas',
                        type: 'basic',
                        link: '/mantenimiento/main/empresas-externas',
                        group: 'main'
                    }
                ]
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
