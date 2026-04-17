import {
    Component, OnInit, OnDestroy,
    ChangeDetectionStrategy, ChangeDetectorRef,
    ViewChild, ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDrawer, MatDrawerToggleResult } from '@angular/material/sidenav';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { RegistroUsuarioService } from './registro-usuario.service';
import { RolCatalogo, Rol, Usuario } from './registro-usuario.types';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector       : 'registro-usuario',
    templateUrl    : './registro-usuario.component.html',
    styleUrls      : ['./registro-usuario.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistroUsuarioComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

    usuarios$: Observable<Usuario[]>;
    searchInputControl: FormControl = new FormControl('');
    isLoading: boolean = false;
    isSaving: boolean = false;
    successMessage: string | null = null;
    errorMessage: string | null = null;
    drawerMode: 'side' | 'over';

    // Drawer state
    selectedUsuario: Usuario | null = null;
    drawerAction: 'new' | 'view' = 'new';
    isEditing: boolean = false;

    // Edit form (only correo — roles handled separately)
    editForm: FormGroup;

    // New user form
    newForm: FormGroup;
    newRolIds: Set<number> = new Set();
    isLoadingNewRoles: boolean = false;
    showNewPassword: boolean = false;

    // Roles catalogue from API
    availableRoles: RolCatalogo[] = [];
    isLoadingRoles: boolean = false;

    // Set of checked rolIds (edit mode)
    selectedRolIds: Set<number> = new Set();

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _fb: FormBuilder,
        private _registroUsuarioService: RegistroUsuarioService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseConfirmationService: FuseConfirmationService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void
    {
        // Build the edit form (roles managed via selectedRolIds)
        this.editForm = this._fb.group({
            correo: ['', [Validators.required, Validators.email]]
        });

        // Build the new user form
        this.newForm = this._fb.group({
            correo  : ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
                this.drawerMode = matchingAliases.includes('md') ? 'side' : 'over';
                this._changeDetectorRef.markForCheck();
            });

        // Load users
        this.isLoading = true;
        this._registroUsuarioService.getUsuarios()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: () => {
                    this.isLoading = false;
                    this._changeDetectorRef.markForCheck();
                },
                error: () => {
                    this.isLoading = false;
                    this._changeDetectorRef.markForCheck();
                }
            });

        // Filtered list
        this.usuarios$ = combineLatest([
            this._registroUsuarioService.usuarios$,
            this.searchInputControl.valueChanges.pipe(
                startWith(''),
                debounceTime(300),
                distinctUntilChanged()
            )
        ]).pipe(
            map(([usuarios, query]) => {
                if (!usuarios) { return []; }
                if (!query?.trim()) { return usuarios; }
                const q = query.toLowerCase().trim();
                return usuarios.filter(u =>
                    u.Correo.toLowerCase().includes(q) ||
                    u.roles.some(r => r.NombreRol.toLowerCase().includes(q))
                );
            }),
            takeUntil(this._unsubscribeAll)
        );
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    openNewUsuario(): void
    {
        this.selectedUsuario = null;
        this.drawerAction = 'new';
        this.isEditing = false;
        this.newForm.reset();
        this.newRolIds = new Set();

        // Load roles catalogue for the new form
        this.isLoadingNewRoles = true;
        this._changeDetectorRef.markForCheck();

        this._registroUsuarioService.getRolesCatalogo()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (roles) => {
                    this.availableRoles = roles;
                    this.isLoadingNewRoles = false;
                    this._changeDetectorRef.markForCheck();
                },
                error: () => {
                    this.isLoadingNewRoles = false;
                    this._changeDetectorRef.markForCheck();
                }
            });

        this.matDrawer.open();
        this._changeDetectorRef.markForCheck();
    }

    selectUsuario(usuario: Usuario): void
    {
        this.selectedUsuario = usuario;
        this.drawerAction = 'view';
        this.isEditing = false;
        this.matDrawer.open();
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Enter edit mode: populate form + load roles catalogue
     */
    enterEditMode(): void
    {
        if (!this.selectedUsuario) { return; }

        this.isEditing = true;
        this.isLoadingRoles = true;
        this._changeDetectorRef.markForCheck();

        // Pre-fill correo
        this.editForm.patchValue({ correo: this.selectedUsuario.Correo });

        // Pre-check current user roles
        this.selectedRolIds = new Set(
            this.selectedUsuario.roles.map(r => r.RolId)
        );

        // Load roles catalogue (cached after first call)
        this._registroUsuarioService.getRolesCatalogo()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (roles) => {
                    this.availableRoles = roles;
                    this.isLoadingRoles = false;
                    this._changeDetectorRef.markForCheck();
                },
                error: () => {
                    // Fallback: map current user roles to catalogue shape
                    this.availableRoles = this.selectedUsuario.roles.map(r => ({
                        RolId      : r.RolId,
                        Nombre     : r.NombreRol,
                        Descripcion: r.DescripcionRol
                    }));
                    this.isLoadingRoles = false;
                    this._changeDetectorRef.markForCheck();
                }
            });
    }

    /**
     * Toggle a role checkbox
     */
    toggleRol(rolId: number): void
    {
        if (this.selectedRolIds.has(rolId)) {
            this.selectedRolIds.delete(rolId);
        } else {
            this.selectedRolIds.add(rolId);
        }
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Whether a role checkbox is checked
     */
    isRolChecked(rolId: number): boolean
    {
        return this.selectedRolIds.has(rolId);
    }

    cancelEdit(): void
    {
        this.isEditing = false;
        this.editForm.reset();
        this.selectedRolIds = new Set();
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle a role checkbox for the NEW form
     */
    toggleNewRol(rolId: number): void
    {
        if (this.newRolIds.has(rolId)) {
            this.newRolIds.delete(rolId);
        } else {
            this.newRolIds.add(rolId);
        }
        this._changeDetectorRef.markForCheck();
    }

    isNewRolChecked(rolId: number): boolean
    {
        return this.newRolIds.has(rolId);
    }

    /**
     * Submit new user creation
     */
    createUsuario(): void
    {
        if (this.newForm.invalid || this.newRolIds.size === 0) { return; }

        this.isSaving = true;
        this.newForm.disable();
        this._changeDetectorRef.markForCheck();

        const { correo, password } = this.newForm.value;
        const roles = Array.from(this.newRolIds);

        this._registroUsuarioService.crearUsuario(correo, password, roles)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: () => {
                    this.isSaving = false;
                    this.newForm.enable();
                    this.newForm.reset();
                    this.newRolIds = new Set();
                    this.closeDrawer();
                    this._changeDetectorRef.markForCheck();
                },
                error: () => {
                    this.isSaving = false;
                    this.newForm.enable();
                    this._changeDetectorRef.markForCheck();
                }
            });
    }

    cancelNew(): void
    {
        this.newForm.reset();
        this.newRolIds = new Set();
        this.closeDrawer();
    }

    /**
     * Generate a secure random 12-character password and fill the field.
     * Uses uppercase, lowercase, digits and symbols.
     */
    generatePassword(): void
    {
        const upper   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lower   = 'abcdefghijklmnopqrstuvwxyz';
        const digits  = '0123456789';
        const symbols = '!@#$%&*?';
        const all     = upper + lower + digits + symbols;

        // Guarantee at least one character from each group
        const required = [
            upper  [Math.floor(Math.random() * upper.length)],
            lower  [Math.floor(Math.random() * lower.length)],
            digits [Math.floor(Math.random() * digits.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
        ];

        // Fill remaining 8 characters from the full set
        const rest = Array.from({ length: 8 }, () =>
            all[Math.floor(Math.random() * all.length)]
        );

        // Shuffle all 12 characters
        const password = [...required, ...rest]
            .sort(() => Math.random() - 0.5)
            .join('');

        this.newForm.get('password').setValue(password);
        // Show the password so the user can see what was generated
        this.showNewPassword = true;
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Save changes for the existing user
     */
    saveChanges(): void
    {
        if (this.editForm.invalid || !this.selectedUsuario) { return; }
        if (this.selectedRolIds.size === 0) { return; }

        this.isSaving = true;
        this.successMessage = null;
        this.errorMessage = null;
        this.editForm.disable();
        this._changeDetectorRef.markForCheck();

        const correo  = this.editForm.get('correo').value;
        const rolIds  = Array.from(this.selectedRolIds);

        // API call to PUT /api/v1/usuarios/{id}
        // Note: The token is automatically sent by the AuthInterceptor
        this._registroUsuarioService.updateUsuario(this.selectedUsuario.UsuarioId, correo, rolIds)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response) => {
                    this.isSaving = false;
                    this.editForm.enable();

                    if (response.status) {
                        this.successMessage = 'Usuario actualizado correctamente';
                        
                        // Update local selectedUsuario with new values
                        const updatedRoles: Rol[] = rolIds.map(id => {
                            const cat = this.availableRoles.find(r => r.RolId === id);
                            const existing = this.selectedUsuario.roles.find(r => r.RolId === id);
                            return {
                                RolId          : id,
                                NombreRol      : cat?.Nombre ?? existing?.NombreRol ?? '',
                                DescripcionRol : cat?.Descripcion ?? existing?.DescripcionRol ?? '',
                                FechaAsignacion: existing?.FechaAsignacion ?? new Date().toISOString()
                            };
                        });

                        this.selectedUsuario = {
                            ...this.selectedUsuario,
                            Correo: correo,
                            roles : updatedRoles
                        };

                        this.isEditing = false;
                        this.selectedRolIds = new Set();
                    } else {
                        this.errorMessage = response.message || 'Error al actualizar usuario';
                    }
                    this._changeDetectorRef.markForCheck();
                },
                error: (error) => {
                    this.isSaving = false;
                    this.editForm.enable();
                    this.errorMessage = error.error?.message || 'Ocurrió un error inesperado';
                    this._changeDetectorRef.markForCheck();
                }
            });
    }

    /**
     * Delete the selected user
     */
    deleteUsuario(): void
    {
        if (!this.selectedUsuario) { return; }

        // Open confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Eliminar usuario',
            message: '¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.',
            actions: {
                confirm: {
                    label: 'Eliminar',
                    color: 'warn'
                },
                cancel: {
                    label: 'Cancelar'
                }
            }
        });

        // Subscribe to the confirmation closed event
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {
                this.isSaving = true;
                this.successMessage = null;
                this.errorMessage = null;
                this._changeDetectorRef.markForCheck();

                this._registroUsuarioService.deleteUsuario(this.selectedUsuario.UsuarioId)
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe({
                        next: (response) => {
                            this.isSaving = false;
                            
                            if (response.status) {
                                this.closeDrawer();
                            } else {
                                this.errorMessage = response.message || 'Error al eliminar usuario';
                            }
                            this._changeDetectorRef.markForCheck();
                        },
                        error: (error) => {
                            this.isSaving = false;
                            this.errorMessage = error.error?.message || 'Ocurrió un error inesperado al eliminar';
                            this._changeDetectorRef.markForCheck();
                        }
                    });
            }
        });
    }

    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        this.selectedUsuario = null;
        this.isEditing = false;
        this.editForm.reset();
        this.selectedRolIds = new Set();
        this._changeDetectorRef.markForCheck();
        return this.matDrawer.close();
    }

    getInitial(correo: string): string
    {
        return correo ? correo.charAt(0).toUpperCase() : '?';
    }

    getPrimaryRole(usuario: Usuario): string
    {
        return usuario.roles?.length > 0 ? usuario.roles[0].NombreRol : 'Sin rol';
    }

    formatDate(dateStr: string): string
    {
        if (!dateStr) { return '-'; }
        return new Date(dateStr).toLocaleDateString('es-PE', {
            day  : '2-digit',
            month: 'long',
            year : 'numeric'
        });
    }

    trackByFn(_index: number, item: Usuario): number
    {
        return item.UsuarioId;
    }
}
