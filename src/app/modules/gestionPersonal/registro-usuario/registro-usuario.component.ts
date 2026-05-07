import {
    Component, OnInit, OnDestroy,
    ChangeDetectionStrategy, ChangeDetectorRef,
    ViewChild, ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDrawer, MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RegistroUsuarioService } from './registro-usuario.service';
import { RolCatalogo, Rol, Usuario } from './registro-usuario.types';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector       : 'registro-usuario',
    templateUrl    : './registro-usuario.component.html',
    styleUrls      : ['./registro-usuario.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default
})
export class RegistroUsuarioComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

    // List state
    filteredUsuarios: Usuario[] = [];
    searchInputControl: FormControl = new FormControl('');
    isLoading: boolean = false;
    drawerMode: 'side' | 'over';

    // Saving state
    isSaving: boolean = false;
    successMessage: string | null = null;
    errorMessage: string | null = null;

    // Drawer state
    selectedUsuario: Usuario | null = null;
    drawerAction: 'new' | 'view' = 'new';
    isEditing: boolean = false;

    // Edit form
    editForm: FormGroup;

    // New user form
    newForm: FormGroup;
    newRolIds: Set<number> = new Set();
    isLoadingNewRoles: boolean = false;
    showNewPassword: boolean = false;

    // Avatar handling
    selectedAvatarFile: File | null = null;
    avatarPreviewUrl: string | null = null;
    avatarReference: string | null = null; // Reference returned from upload endpoint
    newAvatarFile: File | null = null;
    newAvatarPreviewUrl: string | null = null;
    newAvatarReference: string | null = null; // Reference returned from upload endpoint
    isUploadingAvatar: boolean = false;

    // Roles catalogue
    availableRoles: RolCatalogo[] = [];
    isLoadingRoles: boolean = false;

    // Edit role selection
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
        this.editForm = this._fb.group({
            correo : ['', [Validators.required, Validators.email]],
            nombres: ['', [Validators.required]]
        });

        this.newForm = this._fb.group({
            correo  : ['', [Validators.required, Validators.email]],
            nombres : ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });

        // Drawer mode based on screen size
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
                this.drawerMode = matchingAliases.includes('md') ? 'side' : 'over';
                this._changeDetectorRef.markForCheck();
            });

        // Load users from API
        this.isLoading = true;
        this._registroUsuarioService.getUsuarios()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: () => {
                    this.isLoading = false;
                    this._applyFilter();
                    this._changeDetectorRef.markForCheck();
                },
                error: () => {
                    this.isLoading = false;
                    this._changeDetectorRef.markForCheck();
                }
            });

        // Re-apply filter when the service list changes (after create/delete)
        this._registroUsuarioService.usuarios$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._applyFilter();
                this._changeDetectorRef.markForCheck();
            });

        // Re-apply filter on every keystroke
        this.searchInputControl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._applyFilter();
            });
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private _applyFilter(): void
    {
        const all   = this._registroUsuarioService.getUsuariosSnapshot();
        const query = (this.searchInputControl.value ?? '').toLowerCase().trim();

        if (!all) {
            this.filteredUsuarios = [];
            return;
        }

        if (!query) {
            this.filteredUsuarios = [...all];
            return;
        }

        this.filteredUsuarios = all.filter(u =>
            u.Correo.toLowerCase().includes(query) ||
            (u.Nombres && u.Nombres.toLowerCase().includes(query)) ||
            u.roles.some(r => (r.NombreRol ?? r.Nombre ?? '').toLowerCase().includes(query))
        );
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
        this.newAvatarFile = null;
        this.newAvatarPreviewUrl = null;
        this.newAvatarReference = null;
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

    enterEditMode(): void
    {
        if (!this.selectedUsuario) { return; }

        this.isEditing = true;
        this.isLoadingRoles = true;
        this.successMessage = null;
        this.errorMessage = null;
        this.selectedAvatarFile = null;
        this.avatarPreviewUrl = this.selectedUsuario.avatar || null;
        this.avatarReference = null;
        this._changeDetectorRef.markForCheck();

        this.editForm.patchValue({
            correo : this.selectedUsuario.Correo,
            nombres: this.selectedUsuario.Nombres || ''
        });
        this.selectedRolIds = new Set(this.selectedUsuario.roles.map(r => r.RolId));

        this._registroUsuarioService.getRolesCatalogo()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (roles) => {
                    this.availableRoles = roles;
                    this.isLoadingRoles = false;
                    this._changeDetectorRef.markForCheck();
                },
                error: () => {
                    this.availableRoles = this.selectedUsuario!.roles.map(r => ({
                        RolId      : r.RolId,
                        Nombre     : r.NombreRol,
                        Descripcion: r.DescripcionRol
                    }));
                    this.isLoadingRoles = false;
                    this._changeDetectorRef.markForCheck();
                }
            });
    }

    toggleRol(rolId: number): void
    {
        this.selectedRolIds.has(rolId)
            ? this.selectedRolIds.delete(rolId)
            : this.selectedRolIds.add(rolId);
        this._changeDetectorRef.markForCheck();
    }

    isRolChecked(rolId: number): boolean
    {
        return this.selectedRolIds.has(rolId);
    }

    cancelEdit(): void
    {
        this.isEditing = false;
        this.editForm.reset();
        this.selectedRolIds = new Set();
        this.selectedAvatarFile = null;
        this.avatarPreviewUrl = null;
        this.avatarReference = null;
        this.successMessage = null;
        this.errorMessage = null;
        this._changeDetectorRef.markForCheck();
    }

    toggleNewRol(rolId: number): void
    {
        this.newRolIds.has(rolId)
            ? this.newRolIds.delete(rolId)
            : this.newRolIds.add(rolId);
        this._changeDetectorRef.markForCheck();
    }

    isNewRolChecked(rolId: number): boolean
    {
        return this.newRolIds.has(rolId);
    }

    createUsuario(): void
    {
        if (this.newForm.invalid || this.newRolIds.size === 0) { return; }

        this.isSaving = true;
        this.newForm.disable();
        this._changeDetectorRef.markForCheck();

        const correo   = this.newForm.get('correo')!.value as string;
        const nombres  = this.newForm.get('nombres')!.value as string;
        const password = this.newForm.get('password')!.value as string;
        const roles    = Array.from(this.newRolIds);

        // Always send avatar reference, empty string if not uploaded
        this._registroUsuarioService.crearUsuario(correo, password, roles, nombres, this.newAvatarReference || '')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: () => {
                    this.isSaving = false;
                    this.newForm.enable();
                    this.newForm.reset();
                    this.newRolIds = new Set();
                    this.newAvatarFile = null;
                    this.newAvatarPreviewUrl = null;
                    this.newAvatarReference = null;
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
        this.newAvatarFile = null;
        this.newAvatarPreviewUrl = null;
        this.newAvatarReference = null;
        this.closeDrawer();
    }

    generatePassword(): void
    {
        const upper   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lower   = 'abcdefghijklmnopqrstuvwxyz';
        const digits  = '0123456789';
        const symbols = '!@#$%&*?';
        const all     = upper + lower + digits + symbols;

        const required = [
            upper  [Math.floor(Math.random() * upper.length)],
            lower  [Math.floor(Math.random() * lower.length)],
            digits [Math.floor(Math.random() * digits.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
        ];

        const rest = Array.from({ length: 8 }, () =>
            all[Math.floor(Math.random() * all.length)]
        );

        const pwd = [...required, ...rest].sort(() => Math.random() - 0.5).join('');

        this.newForm.get('password')!.setValue(pwd);
        this.showNewPassword = true;
        this._changeDetectorRef.markForCheck();
    }

    saveChanges(): void
    {
        if (this.editForm.invalid || !this.selectedUsuario) { return; }
        if (this.selectedRolIds.size === 0) { return; }

        this.isSaving = true;
        this.successMessage = null;
        this.errorMessage = null;
        this.editForm.disable();
        this._changeDetectorRef.markForCheck();

        const correo  = this.editForm.get('correo')!.value as string;
        const nombres = this.editForm.get('nombres')!.value as string;
        const rolIds  = Array.from(this.selectedRolIds);

        // Determine if we're removing the avatar
        const removeAvatar = !this.avatarPreviewUrl && !this.avatarReference && !!this.selectedUsuario.avatar;

        // Always send avatar reference, empty string if not uploaded or being removed
        const avatarToSend = removeAvatar ? '' : (this.avatarReference || this.selectedUsuario.avatar || '');

        this._registroUsuarioService.updateUsuario(
            this.selectedUsuario.UsuarioId,
            correo,
            rolIds,
            nombres,
            avatarToSend,
            removeAvatar
        )
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response) => {
                    this.isSaving = false;
                    this.editForm.enable();

                    if (response?.status) {
                        this.successMessage = 'Usuario actualizado correctamente';

                        const updatedRoles: Rol[] = rolIds.map(id => {
                            const cat      = this.availableRoles.find(r => r.RolId === id);
                            const existing = this.selectedUsuario!.roles.find(r => r.RolId === id);
                            return {
                                RolId          : id,
                                NombreRol      : cat?.Nombre ?? existing?.NombreRol ?? '',
                                DescripcionRol : cat?.Descripcion ?? existing?.DescripcionRol ?? '',
                                FechaAsignacion: existing?.FechaAsignacion ?? new Date().toISOString(),
                                Nombre         : cat?.Nombre ?? existing?.NombreRol ?? '',
                                Descripcion    : cat?.Descripcion ?? existing?.DescripcionRol ?? ''
                            };
                        });

                        this.selectedUsuario = {
                            ...this.selectedUsuario!,
                            Correo : correo,
                            Nombres: nombres,
                            roles  : updatedRoles
                        };

                        this.isEditing = false;
                        this.selectedRolIds = new Set();
                        this.selectedAvatarFile = null;
                        this.avatarPreviewUrl = null;
                        this.avatarReference = null;

                        // Reload the full list from API
                        this._registroUsuarioService.getUsuarios()
                            .pipe(takeUntil(this._unsubscribeAll))
                            .subscribe();
                    } else {
                        this.errorMessage = response?.message ?? 'Error al actualizar usuario';
                    }
                    this._changeDetectorRef.markForCheck();
                },
                error: (err) => {
                    this.isSaving = false;
                    this.editForm.enable();
                    this.errorMessage = err?.error?.message ?? 'Ocurrió un error inesperado';
                    this._changeDetectorRef.markForCheck();
                }
            });
    }

    deleteUsuario(): void
    {
        if (!this.selectedUsuario) { return; }

        const confirmation = this._fuseConfirmationService.open({
            title  : 'Eliminar usuario',
            message: '¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.',
            actions: {
                confirm: { label: 'Eliminar', color: 'warn' },
                cancel : { label: 'Cancelar' }
            }
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result !== 'confirmed') { return; }

            this.isSaving = true;
            this.successMessage = null;
            this.errorMessage = null;
            this._changeDetectorRef.markForCheck();

            this._registroUsuarioService.deleteUsuario(this.selectedUsuario!.UsuarioId)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe({
                    next: (response) => {
                        this.isSaving = false;
                        if (response?.status) {
                            this.closeDrawer();
                        } else {
                            this.errorMessage = response?.message ?? 'Error al eliminar usuario';
                        }
                        this._changeDetectorRef.markForCheck();
                    },
                    error: (err) => {
                        this.isSaving = false;
                        this.errorMessage = err?.error?.message ?? 'Ocurrió un error inesperado al eliminar';
                        this._changeDetectorRef.markForCheck();
                    }
                });
        });
    }

    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        this.selectedUsuario = null;
        this.isEditing = false;
        this.editForm.reset();
        this.selectedRolIds = new Set();
        this.selectedAvatarFile = null;
        this.avatarPreviewUrl = null;
        this.avatarReference = null;
        this.newAvatarFile = null;
        this.newAvatarPreviewUrl = null;
        this.newAvatarReference = null;
        this.successMessage = null;
        this.errorMessage = null;
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

    // -----------------------------------------------------------------------------------------------------
    // @ Avatar handling methods
    // -----------------------------------------------------------------------------------------------------

    onAvatarSelected(event: Event): void
    {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) { return; }

        const file = input.files[0];

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.errorMessage = 'Por favor seleccione un archivo de imagen válido';
            this._changeDetectorRef.markForCheck();
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.errorMessage = 'La imagen no debe superar los 5MB';
            this._changeDetectorRef.markForCheck();
            return;
        }

        this.selectedAvatarFile = file;
        this.errorMessage = null;

        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            this.avatarPreviewUrl = e.target?.result as string;
            this._changeDetectorRef.markForCheck();
        };
        reader.readAsDataURL(file);

        // Upload image to get reference
        this.isUploadingAvatar = true;
        this._changeDetectorRef.markForCheck();

        this._registroUsuarioService.uploadAvatar(file)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response) => {
                    this.isUploadingAvatar = false;
                    if (response.status && response.data) {
                        this.avatarReference = response.data;
                        this.successMessage = 'Imagen cargada correctamente';
                    } else {
                        this.errorMessage = response.message || 'Error al cargar la imagen';
                        this.selectedAvatarFile = null;
                        this.avatarPreviewUrl = null;
                        this.avatarReference = null;
                    }
                    this._changeDetectorRef.markForCheck();
                },
                error: (err) => {
                    this.isUploadingAvatar = false;
                    this.errorMessage = err?.error?.message || 'Error al cargar la imagen';
                    this.selectedAvatarFile = null;
                    this.avatarPreviewUrl = null;
                    this.avatarReference = null;
                    this._changeDetectorRef.markForCheck();
                }
            });
    }

    onNewAvatarSelected(event: Event): void
    {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) { return; }

        const file = input.files[0];

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.errorMessage = 'Por favor seleccione un archivo de imagen válido';
            this._changeDetectorRef.markForCheck();
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.errorMessage = 'La imagen no debe superar los 5MB';
            this._changeDetectorRef.markForCheck();
            return;
        }

        this.newAvatarFile = file;
        this.errorMessage = null;

        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            this.newAvatarPreviewUrl = e.target?.result as string;
            this._changeDetectorRef.markForCheck();
        };
        reader.readAsDataURL(file);

        // Upload image to get reference
        this.isUploadingAvatar = true;
        this._changeDetectorRef.markForCheck();

        this._registroUsuarioService.uploadAvatar(file)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response) => {
                    this.isUploadingAvatar = false;
                    if (response.status && response.data) {
                        this.newAvatarReference = response.data;
                    } else {
                        this.errorMessage = response.message || 'Error al cargar la imagen';
                        this.newAvatarFile = null;
                        this.newAvatarPreviewUrl = null;
                        this.newAvatarReference = null;
                    }
                    this._changeDetectorRef.markForCheck();
                },
                error: (err) => {
                    this.isUploadingAvatar = false;
                    this.errorMessage = err?.error?.message || 'Error al cargar la imagen';
                    this.newAvatarFile = null;
                    this.newAvatarPreviewUrl = null;
                    this.newAvatarReference = null;
                    this._changeDetectorRef.markForCheck();
                }
            });
    }

    removeAvatar(): void
    {
        this.selectedAvatarFile = null;
        this.avatarPreviewUrl = null;
        this.avatarReference = null;

        // If the user had an avatar, mark it for removal
        if (this.selectedUsuario && this.selectedUsuario.avatar) {
            this.selectedUsuario = {
                ...this.selectedUsuario,
                avatar: undefined
            };
        }

        this._changeDetectorRef.markForCheck();
    }

    removeNewAvatar(): void
    {
        this.newAvatarFile = null;
        this.newAvatarPreviewUrl = null;
        this.newAvatarReference = null;
        this._changeDetectorRef.markForCheck();
    }

    getAvatarDisplay(usuario: Usuario): string
    {
        if (usuario.avatar) {
            return usuario.avatar;
        }
        return '';
    }
}
