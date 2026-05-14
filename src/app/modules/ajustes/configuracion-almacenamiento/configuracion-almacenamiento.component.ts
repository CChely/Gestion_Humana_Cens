import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
    selector     : 'configuracion-almacenamiento',
    templateUrl  : './configuracion-almacenamiento.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ConfiguracionAlmacenamientoComponent implements OnInit
{
    storageForm: UntypedFormGroup;
    providers: any[] = [
        { id: 's3', name: 'Amazon S3', icon: 'heroicons_outline:cloud' },
        { id: 'google-drive', name: 'Google Drive', icon: 'heroicons_outline:cloud' },
        { id: 'onedrive', name: 'OneDrive', icon: 'heroicons_outline:cloud' },
        { id: 'azure', name: 'Azure Blob Storage', icon: 'heroicons_outline:cloud' },
        { id: 'gcp', name: 'Google Cloud Storage', icon: 'heroicons_outline:cloud' },
        { id: 'cens-drive', name: 'Cens Drive', icon: 'heroicons_outline:database' }
    ];

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder
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
        this.storageForm = this._formBuilder.group({
            provider: ['s3', Validators.required],
            bucketName: [''],
            accessKey: [''],
            secretKey: [''],
            region: [''],
            endpoint: [''],
            apiUrl: [''],
            apiKey: [''],
            clientId: [''],
            clientSecret: ['']
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Test connection
     */
    testConnection(): void
    {
        console.log('Testing connection with:', this.storageForm.value);
    }

    /**
     * Save configuration
     */
    save(): void
    {
        console.log('Saving configuration:', this.storageForm.value);
    }
}
