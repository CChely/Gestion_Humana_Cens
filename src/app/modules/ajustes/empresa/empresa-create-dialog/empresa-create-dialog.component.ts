import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Inject, OnInit } from '@angular/core';
import { EmpresaService } from '../empresa.service';
import { AuthService } from 'app/core/auth/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-empresa-create-dialog',
    templateUrl: './empresa-create-dialog.component.html',
})
export class EmpresaCreateDialogComponent implements OnInit {

    form: FormGroup;
    isEdit = false;
    empresaId: number | null = null;

    // ── Upload state ──────────────────────────────────
    isUploading   = false;
    uploadedFileCode: string | null = null;
    selectedFileName: string | null = null;
    previewUrl: string | null = null;
    uploadError: string | null = null;

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
            nombre: [''],
            ruc:    [''],
        });
    }

    ngOnInit(): void {
        // Si hay datos, es modo edición
        if (this._data && this._data.empresa) {
            const empresa = this._data.empresa;
            this.isEdit = true;
            this.empresaId = empresa.EmpresaId;
            
            this.form.patchValue({
                nombre: empresa.NombreEmpresa,
                ruc:    empresa.RucEmpresa,
            });
            this.uploadedFileCode = empresa.ImagenEmpresa;

            // Si hay imagen guardada, cargarla en el preview
            if (this.uploadedFileCode) {
                this._empresaService.downloadImagen(this.uploadedFileCode).subscribe(res => {
                    if (res.status && res.data.bytesFile) {
                        this.previewUrl = `data:${res.data.contentType};base64,${res.data.bytesFile}`;
                    }
                });
            }
        }
    }

    // ── File handling ─────────────────────────────────

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
        // Reset previous state
        this.uploadError       = null;
        this.uploadedFileCode  = null;
        this.selectedFileName  = file.name;

        // Local preview
        const reader = new FileReader();
        reader.onload = (e) => (this.previewUrl = e.target?.result as string);
        reader.readAsDataURL(file);

        // Upload to server
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

    // ── Save ──────────────────────────────────────────

    save(): void {
        const { nombre, ruc } = this.form.value;

        this.isSaving = true;

        const request: any = {
            data: {
                p_Nombre: nombre ?? '',
                p_Ruc:    ruc    ?? '',
                p_Imagen: this.uploadedFileCode ?? '',
                p_IdUsuarioActual: this._authService.user()?.id ?? '',
            },
            params: null,
        };

        if (this.isEdit) {
            request.data.p_IdEmpresa = this.empresaId;
            this._empresaService.actualizarEmpresa(request)
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
            this._empresaService.insertarEmpresa(request)
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
