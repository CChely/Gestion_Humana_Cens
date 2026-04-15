import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { RegistroUsuarioService } from '../registro-usuario.service';
import { Usuario, RolCatalogo } from 'app/core/user/user.types';

@Component({
    selector       : 'registro-usuario-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistroUsuarioDetailsComponent implements OnInit, OnDestroy
{
    editMode: boolean = false;
    usuario: Usuario;
    usuarioForm: FormGroup;
    roles: RolCatalogo[];
    showPassword: boolean = false;
    generatedPassword: string = '';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _registroUsuarioService: RegistroUsuarioService,
        private _router: Router
    )
    {
    }

    ngOnInit(): void
    {
        // Create the usuario form
        this.usuarioForm = this._formBuilder.group({
            UsuarioId     : [''],
            Correo        : ['', [Validators.required, Validators.email]],
            password      : ['', [Validators.required]],
            roles         : [[], [Validators.required]],
            Estado        : [true],
            FechaCreacion : ['']
        });

        // Get the ID from route params
        const id = this._activatedRoute.snapshot.paramMap.get('id');

        // Load roles first
        this._registroUsuarioService.getRoles().subscribe({
            next: (roles) => {
                this.roles = roles;
                this._changeDetectorRef.markForCheck();
            },
            error: (error) => {
                console.error('Error loading roles:', error);
            }
        });

        // Handle usuario loading based on ID
        if (id) {
            // Load existing usuario (could be temporary or real)
            this._registroUsuarioService.getUsuarios().subscribe({
                next: (usuarios) => {
                    const usuario = usuarios.find(u => u.UsuarioId === parseInt(id));
                    if (usuario) {
                        this.usuario = usuario;
                        this.usuarioForm.patchValue(usuario);
                        // Check if this is a new usuario (no email means it's temporary)
                        if (!usuario.Correo) {
                            this.editMode = true;
                            this.generateNewPassword();
                        }
                        this._registroUsuarioService.setUsuario(usuario);
                    } else {
                        console.error('Usuario not found');
                        this._router.navigate(['../'], {relativeTo: this._activatedRoute});
                    }
                    this._changeDetectorRef.markForCheck();
                },
                error: (error) => {
                    console.error('Error loading usuarios:', error);
                    this._router.navigate(['../'], {relativeTo: this._activatedRoute});
                }
            });
        }
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    toggleEditMode(editMode: boolean | null = null): void
    {
        if (editMode === null) {
            this.editMode = !this.editMode;
        } else {
            this.editMode = editMode;
        }
        this._changeDetectorRef.markForCheck();
    }

    generateNewPassword(): void
    {
        this.generatedPassword = this._registroUsuarioService.generatePassword(12);
        this.usuarioForm.patchValue({ password: this.generatedPassword });
        this._changeDetectorRef.markForCheck();
    }

    copyPassword(): void
    {
        const password = this.usuarioForm.get('password').value || this.generatedPassword;
        navigator.clipboard.writeText(password);
    }

    togglePasswordVisibility(): void
    {
        this.showPassword = !this.showPassword;
    }

    updateUsuario(): void
    {
        const formValue = this.usuarioForm.getRawValue();

        // Check if this is a new usuario (no UsuarioId)
        if (!formValue.UsuarioId) {
            // Register new usuario
            const registroData = {
                correo: formValue.Correo,
                password: formValue.password,
                roles: formValue.roles
            };

            this._registroUsuarioService.registrarUsuario(registroData).subscribe({
                next: (response) => {
                    // Navigate back to list
                    this._router.navigate(['../'], {relativeTo: this._activatedRoute});
                },
                error: (error) => {
                    console.error('Error al registrar usuario:', error);
                }
            });
        } else {
            // Update existing usuario
            this._registroUsuarioService.updateUsuario(formValue.UsuarioId, formValue).subscribe(() => {
                this.toggleEditMode(false);
            });
        }
    }

    deleteUsuario(): void
    {
        this._registroUsuarioService.deleteUsuario(this.usuario.UsuarioId).subscribe((isDeleted) => {
            if (isDeleted) {
                this._router.navigate(['../'], {relativeTo: this._activatedRoute});
            }
        });
    }

    isRolSelected(rolId: number): boolean
    {
        const selectedRoles = this.usuarioForm.get('roles').value || [];
        return selectedRoles.includes(rolId);
    }

    toggleRol(rolId: number): void
    {
        const selectedRoles = this.usuarioForm.get('roles').value || [];
        const index = selectedRoles.indexOf(rolId);

        if (index > -1) {
            selectedRoles.splice(index, 1);
        } else {
            selectedRoles.push(rolId);
        }

        this.usuarioForm.patchValue({ roles: selectedRoles });
        this.usuarioForm.get('roles').markAsTouched();
    }

    trackByFn(index: number, item: any): any
    {
        return item.RolId || index;
    }

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        // Navigate back to list
        this._router.navigate(['../'], {relativeTo: this._activatedRoute});
        return Promise.resolve(null);
    }
}
