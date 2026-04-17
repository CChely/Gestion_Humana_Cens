import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

// Extend CredentialRequestOptions to include password property
interface PasswordCredentialRequestOptions extends CredentialRequestOptions {
    password?: boolean;
}

// Declare PasswordCredential for browsers that support it
declare global {
    interface Window {
        PasswordCredential: any;
    }
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

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email     : ['', [Validators.required, Validators.email]],
            password  : ['', Validators.required],
            rememberMe: ['']
        });

        // Try to retrieve stored credentials using Credential Management API
        this.retrieveStoredCredentials();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Retrieve stored credentials from browser
     */
    private retrieveStoredCredentials(): void
    {
        // Check if Credential Management API is available
        if ('credentials' in navigator && 'PasswordCredential' in window) {
            const options: PasswordCredentialRequestOptions = {
                password: true,
                mediation: 'optional' // 'optional' allows silent retrieval, 'required' shows account chooser
            };

            navigator.credentials.get(options).then((credential: any) => {
                if (credential && credential.type === 'password') {
                    // Populate the form with stored credentials
                    this.signInForm.patchValue({
                        email: credential.id,
                        password: credential.password,
                        rememberMe: true
                    });
                }
            }).catch((error) => {
                // Silently fail - user will need to enter credentials manually
                console.debug('No stored credentials found or user declined:', error);
            });
        }
    }

    /**
     * Sign in
     */
    signIn(): void
    {
        // Return if the form is invalid
        if ( this.signInForm.invalid )
        {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Get form values
        const email = this.signInForm.get('email').value;
        const password = this.signInForm.get('password').value;
        const rememberMe = this.signInForm.get('rememberMe').value;

        // Prepare the request payload - mapear email a correo para el endpoint
        const loginData = {
            correo: email,
            password: password
        };

        // Sign in
        this._authService.signIn(loginData)
            .subscribe(
                () => {
                    // If rememberMe is checked, store credentials using Credential Management API
                    if (rememberMe && 'credentials' in navigator && 'PasswordCredential' in window) {
                        try {
                            const credential = new PasswordCredential({
                                id: email,
                                password: password,
                                name: email
                            });

                            // Store the credential
                            navigator.credentials.store(credential).catch((error) => {
                                console.warn('Failed to store credentials:', error);
                            });
                        } catch (error) {
                            console.warn('Credential Management API not fully supported:', error);
                        }
                    }

                    // Set the redirect url.
                    // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                    // to the correct page after a successful sign in. This way, that url can be set via
                    // routing file and we don't have to touch here.
                    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

                    // Navigate to the redirect url
                    this._router.navigateByUrl(redirectURL);

                },
                (error: any) => {

                    // Re-enable the form
                    this.signInForm.enable();

                    // Reset the form
                    this.signInNgForm.resetForm();

                    // Set the alert with the error message from the API
                    this.alert = {
                        type   : 'error',
                        message: error?.error?.message || 'An error occurred during sign in'
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            );
    }
}
