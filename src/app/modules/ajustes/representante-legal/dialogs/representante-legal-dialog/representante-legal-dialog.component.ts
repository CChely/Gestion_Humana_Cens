import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { RepresentanteLegal } from '../../representante-legal.component';
import { EmpresaService } from 'app/modules/ajustes/empresa/empresa.service';
import { Empresa } from 'app/modules/ajustes/empresa/empresa.types';
import { RepresentanteLegalService } from '../../representante-legal.service';
import { AuthService } from 'app/core/auth/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-representante-legal-dialog',
    templateUrl: './representante-legal-dialog.component.html',
    styleUrls: ['./representante-legal-dialog.component.scss']
})
export class RepresentanteLegalDialogComponent implements OnInit {
    form: UntypedFormGroup;
    isEditMode: boolean = false;

    // ── Firma Upload States ────────────────────────────
    previewFirmaUrl: string | null = null;
    uploadedFirmaCode: string | null = null;
    isUploadingFirma: boolean = false;
    uploadFirmaError: string | null = null;

    // ── Empresa Select States ──────────────────────────
    empresas: Empresa[] = [];
    empresasFiltradas: Empresa[] = [];
    empresaSearch = new FormControl('');
    isLoadingEmpresas: boolean = false;

    // ── Save State ─────────────────────────────────────
    isSaving: boolean = false;

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _empresaService: EmpresaService,
        private _representanteLegalService: RepresentanteLegalService,
        private _authService: AuthService,
        public dialogRef: MatDialogRef<RepresentanteLegalDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { representante: RepresentanteLegal }
    ) {
        this.isEditMode = !!data?.representante;
    }

    ngOnInit(): void {
        this.form = this._formBuilder.group({
            empresaId:  [this.data?.representante?.empresaId  || null, Validators.required],
            nombre:     [this.data?.representante?.nombre     || '', Validators.required],
            dni:        [this.data?.representante?.dni        || '', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
            direccion:  [this.data?.representante?.direccion  || ''],
            correo:     [this.data?.representante?.correo     || '', [Validators.email]],
            celular:    [this.data?.representante?.celular    || ''],
        });

        if (this.isEditMode && this.data.representante) {
            this.uploadedFirmaCode = this.data.representante.firma || null;
            if (this.uploadedFirmaCode) {
                if (this.uploadedFirmaCode.startsWith('assets/') || this.uploadedFirmaCode.startsWith('data:')) {
                    this.previewFirmaUrl = this.uploadedFirmaCode;
                } else {
                    this._empresaService.downloadImagen(this.uploadedFirmaCode).subscribe({
                        next: (res) => {
                            if (res.status && res.data?.bytesFile) {
                                this.previewFirmaUrl = `data:${res.data.contentType};base64,${res.data.bytesFile}`;
                            }
                        },
                        error: (err) => console.error('Error downloading signature image:', err)
                    });
                }
            }
        }

        this.loadEmpresas();

        this.empresaSearch.valueChanges.subscribe(search => {
            const term = (search || '').toLowerCase();
            this.empresasFiltradas = this.empresas.filter(e =>
                e.NombreEmpresa.toLowerCase().includes(term)
            );
        });
    }

    // ── Load Empresas ──────────────────────────────────

    loadEmpresas(): void {
        this.isLoadingEmpresas = true;
        this._empresaService.listarEmpresas()
            .pipe(finalize(() => this.isLoadingEmpresas = false))
            .subscribe({
                next: (response) => {
                    if (response.status) {
                        this.empresas = response.data;
                        this.empresasFiltradas = response.data;
                    }
                },
                error: (err) => console.error('Error loading empresas:', err)
            });
    }

    // ── File Handling (Firma) ──────────────────────────

    onFirmaSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files?.length) {
            this._handleFirmaFile(input.files[0]);
        }
    }

    onFirmaDrop(event: DragEvent): void {
        event.preventDefault();
        const file = event.dataTransfer?.files?.[0];
        if (file && file.type.startsWith('image/')) {
            this._handleFirmaFile(file);
        }
    }

    private _handleFirmaFile(file: File): void {
        this.uploadFirmaError  = null;
        this.uploadedFirmaCode = null;

        if (!file.type.startsWith('image/')) {
            this.uploadFirmaError = 'El archivo debe ser una imagen.';
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            this.uploadFirmaError = 'La imagen no debe superar los 2MB.';
            return;
        }

        // Preview inmediata en base64
        const reader = new FileReader();
        reader.onload = (e) => (this.previewFirmaUrl = e.target?.result as string);
        reader.readAsDataURL(file);

        // Subir al servidor para obtener el baseCodeFile
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

    // ── Save ───────────────────────────────────────────

    closeDialog(): void {
        this.dialogRef.close();
    }

    get isFormReady(): boolean {
        return this.form.valid && !this.isUploadingFirma && !this.isSaving && !this.isLoadingEmpresas;
    }

    save(): void {
        if (!this.isFormReady) { return; }

        const { empresaId, nombre, dni, direccion, correo, celular } = this.form.value;

        this.isSaving = true;

        if (this.isEditMode) {
            const request = {
                data: {
                    p_IdRepresentanteLegal: this.data.representante.id,
                    p_IdEmpresa:           empresaId,
                    p_NombreRepresentante: nombre       ?? '',
                    p_Dni:                 dni          ?? '',
                    p_Firma:               this.uploadedFirmaCode ?? '',
                    p_Direccion:           direccion    ?? '',
                    p_Movil:               celular      ?? '',
                    p_CorreoElectronico:   correo       ?? '',
                    p_SitioWeb:            '',
                    p_IdUsuarioActual:     Number(this._authService.user()?.id ?? 0),
                },
                params: null,
            };

            this._representanteLegalService
                .actualizarRepresentante(request)
                .pipe(finalize(() => (this.isSaving = false)))
                .subscribe({
                    next: (response) => {
                        if (response.status) {
                            this.dialogRef.close(true);
                        } else {
                            console.error('Error al actualizar representante:', response.message);
                        }
                    },
                    error: (err) => console.error('Error al actualizar representante:', err),
                });
        } else {
            const request = {
                data: {
                    p_IdEmpresa:           empresaId,
                    p_NombreRepresentante: nombre       ?? '',
                    p_Dni:                 dni          ?? '',
                    p_Firma:               this.uploadedFirmaCode ?? '',
                    p_Direccion:           direccion    ?? '',
                    p_Movil:               celular      ?? '',
                    p_CorreoElectronico:   correo       ?? '',
                    p_SitioWeb:            '',
                    p_IdUsuarioActual:     Number(this._authService.user()?.id ?? 0),
                },
                params: null,
            };

            this._representanteLegalService
                .crearRepresentante(request)
                .pipe(finalize(() => (this.isSaving = false)))
                .subscribe({
                    next: (response) => {
                        if (response.status) {
                            this.dialogRef.close(true);
                        } else {
                            console.error('Error al crear representante:', response.message);
                        }
                    },
                    error: (err) => console.error('Error al crear representante:', err),
                });
        }
    }
}
