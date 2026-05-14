import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { switchMap, of } from 'rxjs';

// Storage key constants — never store plain passwords; we store only email
// and a flag. The password is stored encrypted via the browser's own
// Credential Management API when available.
const REMEMBER_ME_KEY  = 'auth.rememberMe';
const REMEMBERED_EMAIL = 'auth.rememberedEmail';

// Extend CredentialRequestOptions to include password property (Chrome/Edge)
interface PasswordCredentialRequestOptions extends CredentialRequestOptions {
    password?: boolean;
}

declare global {
    interface Window { PasswordCredential: any; }
    const PasswordCredential: any;
}

@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignInComponent implements OnInit
{
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _httpClient: HttpClient,
        private _userService: UserService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void
    {
        // Build form
        this.signInForm = this._formBuilder.group({
            email     : ['', [Validators.required, Validators.email]],
            password  : ['', Validators.required],
            rememberMe: [false]
        });

        // Restore remembered email from localStorage (safe — no password stored)
        this._restoreRememberedEmail();

        // Additionally try Credential Management API (Chrome/Edge HTTPS only)
        this._tryCredentialManagementAPI();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    signIn(): void
    {
        if (this.signInForm.invalid) { return; }

        this.signInForm.disable();
        this.showAlert = false;

        const email      = this.signInForm.get('email').value as string;
        const password   = this.signInForm.get('password').value as string;
        const rememberMe = this.signInForm.get('rememberMe').value as boolean;

        const loginData = { correo: email, password };

        this._authService.signIn(loginData).pipe(
            switchMap((response) => {
                // If user has an avatar, download it and store the data URL
                if (response.data?.avatar) {
                    console.log('📷 User has avatar, downloading:', response.data.avatar);
                    return this._downloadAndStoreAvatar(response.data.avatar).pipe(
                        switchMap((avatarUrl) => {
                            console.log('✅ Avatar downloaded and stored');

                            // Update user service with avatar URL
                            const currentUser = this._authService.user();
                            if (currentUser && avatarUrl) {
                                this._userService.user = {
                                    id: currentUser.id,
                                    correo: currentUser.correo,
                                    name: currentUser.name,
                                    avatar: avatarUrl as string,
                                    status: 'online'
                                };
                            }

                            return of(response);
                        })
                    );
                }
                return of(response);
            })
        ).subscribe(
            () => {
                // ── Remember Me logic ──────────────────────────────────────
                if (rememberMe) {
                    // 1. Store email in localStorage (no password — safe)
                    localStorage.setItem(REMEMBER_ME_KEY,  'true');
                    localStorage.setItem(REMEMBERED_EMAIL, email);

                    // 2. Also try Credential Management API for full autofill
                    this._storeCredential(email, password);
                } else {
                    // Clear any previously stored data
                    localStorage.removeItem(REMEMBER_ME_KEY);
                    localStorage.removeItem(REMEMBERED_EMAIL);
                }
                // ──────────────────────────────────────────────────────────

                const redirectURL =
                    this._activatedRoute.snapshot.queryParamMap.get('redirectURL')
                    || '/signed-in-redirect';

                this._router.navigateByUrl(redirectURL);
            },
            (error: any) => {
                this.signInForm.enable();
                this.signInNgForm.resetForm();

                // Restore email after reset so the user doesn't have to retype it
                if (rememberMe) {
                    this.signInForm.get('email').setValue(email);
                    this.signInForm.get('rememberMe').setValue(true);
                }

                this.alert = {
                    type   : 'error',
                    message: error?.error?.message || 'An error occurred during sign in'
                };
                this.showAlert = true;
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Download avatar and store it in localStorage as a data URL
     */
    private _downloadAndStoreAvatar(avatarCode: string): any {
        if (!avatarCode) {
            return of(null);
        }

        return this._httpClient.get<{
            status: boolean;
            data: {
                extension: string;
                fileName: string;
                bytesFile: string;
                contentType: string;
            };
            message?: string;
        }>(`${environment.apiUrl}/file/download/${avatarCode}`).pipe(
            switchMap((response) => {
                if (response.status && response.data.bytesFile) {
                    // Create data URL from base64
                    const avatarUrl = `data:${response.data.contentType};base64,${response.data.bytesFile}`;

                    // Store in localStorage for later use
                    localStorage.setItem('userAvatarUrl', avatarUrl);
                    localStorage.setItem('userAvatarCode', avatarCode);

                    return of(avatarUrl);
                }
                return of(null);
            })
        );
    }

    /**
     * Restore email from localStorage when rememberMe was previously checked.
     * Password is intentionally NOT stored in localStorage.
     */
    private _restoreRememberedEmail(): void
    {
        const remembered = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
        const email      = localStorage.getItem(REMEMBERED_EMAIL);

        if (remembered && email) {
            this.signInForm.patchValue({
                email,
                rememberMe: true
            });
        }
    }

    /**
     * Try to retrieve full credentials (email + password) via the
     * Credential Management API. Only works in Chrome/Edge over HTTPS.
     * Falls back gracefully — localStorage email is already restored above.
     */
    private _tryCredentialManagementAPI(): void
    {
        if (!('credentials' in navigator) || !('PasswordCredential' in window)) {
            return;
        }

        const options: PasswordCredentialRequestOptions = {
            password : true,
            mediation: 'optional'
        };

        navigator.credentials.get(options)
            .then((credential: any) => {
                if (credential?.type === 'password') {
                    // Only patch if the form is still empty (don't overwrite localStorage restore)
                    const currentEmail = this.signInForm.get('email').value;
                    if (!currentEmail) {
                        this.signInForm.patchValue({
                            email     : credential.id,
                            password  : credential.password,
                            rememberMe: true
                        });
                    } else {
                        // Email already restored — just fill the password
                        this.signInForm.patchValue({ password: credential.password });
                    }
                }
            })
            .catch(() => {
                // Silently ignore — localStorage fallback already handled
            });
    }

    /**
     * Store credentials in the browser's Credential Management API.
     * Only available in Chrome/Edge over HTTPS.
     */
    private _storeCredential(email: string, password: string): void
    {
        if (!('credentials' in navigator) || !('PasswordCredential' in window)) {
            return;
        }

        try {
            const credential = new PasswordCredential({
                id      : email,
                password: password,
                name    : email
            });

            navigator.credentials.store(credential).catch(() => {
                // Silently ignore — localStorage is the primary mechanism
            });
        } catch {
            // PasswordCredential constructor not supported
        }
    }
}
