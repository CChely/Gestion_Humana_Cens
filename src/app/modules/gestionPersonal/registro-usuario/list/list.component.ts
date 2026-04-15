import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { UntypedFormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { filter, fromEvent, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Usuario } from 'app/core/user/user.types';
import { RegistroUsuarioService } from '../registro-usuario.service';

@Component({
    selector       : 'registro-usuario-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistroUsuarioListComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

    usuarios$: Observable<Usuario[]>;
    usuariosCount: number = 0;
    drawerMode: 'side' | 'over';
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedUsuario: Usuario;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _registroUsuarioService: RegistroUsuarioService,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    )
    {
    }

    ngOnInit(): void
    {
        // Load usuarios initially
        this._registroUsuarioService.getUsuarios().subscribe({
            next: (usuarios) => {
                console.log('Usuarios loaded:', usuarios);
            },
            error: (error) => {
                console.error('Error loading usuarios:', error);
            }
        });

        // Get the usuarios
        this.usuarios$ = this._registroUsuarioService.usuarios$;
        this._registroUsuarioService.usuarios$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((usuarios: Usuario[]) => {
                if (usuarios) {
                    this.usuariosCount = usuarios.length;
                    console.log('Usuarios count updated:', this.usuariosCount);
                } else {
                    this.usuariosCount = 0;
                }
                this._changeDetectorRef.markForCheck();
            });

        // Get the usuario
        this._registroUsuarioService.usuario$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((usuario: Usuario) => {
                this.selectedUsuario = usuario;
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap(query =>
                    this._registroUsuarioService.searchUsuarios(query)
                )
            )
            .subscribe();

        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            if (!opened) {
                this.selectedUsuario = null;
                this._changeDetectorRef.markForCheck();
            }
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                } else {
                    this.drawerMode = 'over';
                }
                this._changeDetectorRef.markForCheck();
            });

        // Listen for shortcuts
        fromEvent(this._document, 'keydown')
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter<KeyboardEvent>(event =>
                    (event.ctrlKey === true || event.metaKey) && (event.key === '/')
                )
            )
            .subscribe(() => {
                this.createUsuario();
            });

        // Listen to route changes to open/close drawer
        this._router.events
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(event => event instanceof NavigationEnd)
            )
            .subscribe((event: NavigationEnd) => {
                // Check if we're on a detail route
                if (event.url.includes('/registro-usuario/') && event.url !== '/registro-usuario') {
                    // We're on a detail route, open the drawer after a short delay
                    setTimeout(() => {
                        if (this.matDrawer && !this.matDrawer.opened) {
                            this.matDrawer.open();
                        }
                    }, 100);
                } else if (event.url === '/registro-usuario') {
                    // We're on the list route, close the drawer
                    if (this.matDrawer && this.matDrawer.opened) {
                        this.matDrawer.close();
                    }
                }
            });
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    onBackdropClicked(): void
    {
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});
        this._changeDetectorRef.markForCheck();
    }

    createUsuario(): void
    {
        // Create the usuario
        this._registroUsuarioService.createUsuario().subscribe((newUsuario) => {
            // Navigate to the new usuario using its temporary ID (like contacts does)
            this._router.navigate(['./', newUsuario.UsuarioId], {relativeTo: this._activatedRoute});
            this._changeDetectorRef.markForCheck();
        });
    }

    trackByFn(index: number, item: any): any
    {
        return item.UsuarioId || index;
    }
}
