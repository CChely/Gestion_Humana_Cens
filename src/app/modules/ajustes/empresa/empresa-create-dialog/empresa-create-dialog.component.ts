import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Inject, OnInit } from '@angular/core';
import { EmpresaService } from '../empresa.service';
import { AuthService } from 'app/core/auth/auth.service';
import { Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-empresa-create-dialog',
    templateUrl: './empresa-create-dialog.component.html',
})
export class EmpresaCreateDialogComponent implements OnInit {

    form: FormGroup;
    isEdit = false;
    empresaId: number | null = null;

    // ── Initial loading state ─────────────────────────
    isLoadingData = false;

    // ── Upload state (Logo) ───────────────────────────
    isUploading      = false;
    uploadedFileCode : string | null = null;
    selectedFileName : string | null = null;
    previewUrl       : string | null = null;
    uploadError      : string | null = null;

    // ── Upload state (Firma) ──────────────────────────
    isUploadingFirma  = false;
    uploadedFirmaCode : string | null = null;
    selectedFirmaName : string | null = null;
    previewFirmaUrl   : string | null = null;
    uploadFirmaError  : string | null = null;

    // ── Save state ────────────────────────────────────
    isSaving = false;

    constructor(
        private _fb: FormBuilder,
        private _dialogRef: MatDialogRef<EmpresaCreateDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public _data: any,
        private _empresaService: EmpresaService,
        private _authService: AuthService,
    ) {
        this.form = this._fb.group({
            nombre:    ['', [Validators.required]],
            ruc:       ['', [Validators.required]],
            direccion: [''],
            correo:    ['', [Validators.email]],
            movil:     ['', [Validators.pattern(/^9\d{8}$/)]],
            sitioWeb:  [''],
        });
    }

    ngOnInit(): void {
        if (this._data && this._data.empresa) {
            const empresa = this._data.empresa;
            this.isEdit = true;
            this.empresaId = empresa.EmpresaId;

            this.form.patchValue({
                nombre:    empresa.NombreEmpresa,
                ruc:       empresa.RucEmpresa,
                direccion: empresa.DireccionEmpresa,
                correo:    empresa.CorreoEmpresa,
                movil:     empresa.MovilEmpresa,
                sitioWeb:  empresa.SitioWebEmpresa,
            });
            this.uploadedFileCode  = empresa.ImagenEmpresa;
            this.uploadedFirmaCode = empresa.FirmaEmpresa;

            // Contador para saber cuántas imágenes se están cargando
            let pendingLoads = 0;
            const hasLogo = !!this.uploadedFileCode;
            const hasFirma = !!this.uploadedFirmaCode;

            if (hasLogo) pendingLoads++;
            if (hasFirma) pendingLoads++;

            // Si hay imágenes por cargar, activar el estado de carga
            if (pendingLoads > 0) {
                this.isLoadingData = true;
            }

            const checkLoadingComplete = () => {
                pendingLoads--;
                if (pendingLoads === 0) {
                    this.isLoadingData = false;
                }
            };

            // Cargar preview del Logo
            if (hasLogo) {
                this._empresaService.downloadImagen(this.uploadedFileCode).subscribe({
                    next: (res) => {
                        if (res.status && res.data.bytesFile) {
                            this.previewUrl = `data:${res.data.contentType};base64,${res.data.bytesFile}`;
                        }
                        checkLoadingComplete();
                    },
                    error: () => {
                        checkLoadingComplete();
                    }
                });
            }

            // Cargar preview de la Firma
            if (hasFirma) {
                this._empresaService.downloadImagen(this.uploadedFirmaCode).subscribe({
                    next: (res) => {
                        if (res.status && res.data.bytesFile) {
                            this.previewFirmaUrl = `data:${res.data.contentType};base64,${res.data.bytesFile}`;
                        }
                        checkLoadingComplete();
                    },
                    error: () => {
                        checkLoadingComplete();
                    }
                });
            }
        }
    }

    // ── File handling (Logo) ─────────────────────────

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files?.length) {
            this._handleFile(input.files[0]);
        }
    }

    onFileDrop(event: DragEvent): void {
        event.preventDefault();
        const file = event.dataTransfer?.files?.[0];
        if (file && file.type.startsWith('image/')) {
            this._handleFile(file);
        }
    }

    private _handleFile(file: File): void {
        this.uploadError       = null;
        this.uploadedFileCode  = null;
        this.selectedFileName  = file.name;

        const reader = new FileReader();
        reader.onload = (e) => (this.previewUrl = e.target?.result as string);
        reader.readAsDataURL(file);

        this.isUploading = true;
        this._empresaService
            .uploadImagen(file)
            .pipe(finalize(() => (this.isUploading = false)))
            .subscribe({
                next: (response) => {
                    this.uploadedFileCode = response?.data?.baseCodeFile ?? null;
                    if (!this.uploadedFileCode) {
                        this.uploadError = 'No se pudo obtener el código del archivo.';
                    }
                },
                error: () => {
                    this.uploadError = 'Error al subir la imagen. Intente nuevamente.';
                    this.previewUrl  = null;
                },
            });
    }

    // ── File handling (Firma) ────────────────────────

    onFirmaSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files?.length) {
            this._handleFirma(input.files[0]);
        }
    }

    onFirmaDrop(event: DragEvent): void {
        event.preventDefault();
        const file = event.dataTransfer?.files?.[0];
        if (file && file.type.startsWith('image/')) {
            this._handleFirma(file);
        }
    }

    private _handleFirma(file: File): void {
        this.uploadFirmaError  = null;
        this.uploadedFirmaCode = null;
        this.selectedFirmaName = file.name;

        const reader = new FileReader();
        reader.onload = (e) => (this.previewFirmaUrl = e.target?.result as string);
        reader.readAsDataURL(file);

        this.isUploadingFirma = true;
        this._empresaService
            .uploadImagen(file)
            .pipe(finalize(() => (this.isUploadingFirma = false)))
            .subscribe({
                next: (response) => {
                    this.uploadedFirmaCode = response?.data?.baseCodeFile ?? null;
                    if (!this.uploadedFirmaCode) {
                        this.uploadFirmaError = 'No se pudo obtener el código del archivo.';
                    }
                },
                error: () => {
                    this.uploadFirmaError = 'Error al subir la firma. Intente nuevamente.';
                    this.previewFirmaUrl  = null;
                },
            });
    }

    // ── Save ──────────────────────────────────────────

    save(): void {
        if (this.form.invalid) {
            return;
        }

        const { nombre, ruc, direccion, correo, movil, sitioWeb } = this.form.value;

        this.isSaving = true;

        if (this.isEdit) {
            // Actualizar empresa existente
            const updateRequest: any = {
                data: {
                    p_IdEmpresa:         this.empresaId,
                    p_Nombre:            nombre ?? '',
                    p_Ruc:               ruc ?? '',
                    p_Imagen:            this.uploadedFileCode ?? '',
                    p_Firma:             this.uploadedFirmaCode ?? '',
                    p_Direccion:         direccion ?? '',
                    p_Movil:             movil ?? '',
                    p_CorreoElectronico: correo ?? '',
                    p_SitioWeb:          sitioWeb ?? '',
                    p_IdUsuarioActual:   this._authService.user()?.id ?? '',
                },
                params: null,
            };

            this._empresaService.actualizarEmpresa(updateRequest)
                .pipe(finalize(() => (this.isSaving = false)))
                .subscribe({
                    next: (response) => {
                        if (response.status) {
                            this._dialogRef.close(true);
                        }
                    },
                    error: (err) => console.error('Error al actualizar empresa:', err),
                });
        } else {
            // Insertar nueva empresa
            const insertRequest: any = {
                data: {
                    p_Nombre:            nombre ?? '',
                    p_Ruc:               ruc ?? '',
                    p_Imagen:            this.uploadedFileCode ?? '',
                    p_Firma:             this.uploadedFirmaCode ?? '',
                    p_Direccion:         direccion ?? '',
                    p_CorreoElectronico: correo ?? '',
                    p_Movil:             movil ?? '',
                    p_SitioWeb:          sitioWeb ?? '',
                    p_IdUsuarioActual:   this._authService.user()?.id ?? '',
                },
                params: null,
            };

            this._empresaService.insertarEmpresa(insertRequest)
                .pipe(finalize(() => (this.isSaving = false)))
                .subscribe({
                    next: (response) => {
                        if (response.status) {
                            this._dialogRef.close(true);
                        }
                    },
                    error: (err) => console.error('Error al insertar empresa:', err),
                });
        }
    }
}
