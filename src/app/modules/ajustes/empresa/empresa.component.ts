import { Component, OnInit } from "@angular/core";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { EmpresaService } from "./empresa.service";
import { Empresa } from "./empresa.types";
import { finalize } from "rxjs/operators";
import { EmpresaCreateDialogComponent } from "./empresa-create-dialog/empresa-create-dialog.component";
import { environment } from "environments/environment";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { AuthService } from "app/core/auth/auth.service";

@Component({
    selector: "app-empresa",
    templateUrl: "./empresa.component.html",
    styleUrls: ["./empresa.component.scss"],
})
export class EmpresaComponent implements OnInit {
    // ── List state ──────────────────────────────────────────
    empresas: Empresa[] = [];
    isLoading  = false;
    lastUpdated: Date | null = null;

    // ── Selection state ─────────────────────────────────────
    selectedEmpresaId: number | null = null;

    // ── Image cache ─────────────────────────────────────────
    imageUrls: { [key: string]: string } = {};

    constructor(
        private _empresaService: EmpresaService,
        private _dialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService,
        private _authService: AuthService,
    ) {}

    ngOnInit(): void {
        this.loadEmpresas();
    }

    // ── Helpers ──────────────────────────────────────────────

    trackByEmpresaId(_index: number, empresa: Empresa): number {
        return empresa.EmpresaId;
    }

    getInitials(nombre: string): string {
        return nombre?.charAt(0)?.toUpperCase() ?? '?';
    }

    getFileUrl(code: string): string {
        return this.imageUrls[code] || '';
    }

    selectEmpresa(empresa: Empresa): void {
        this.selectedEmpresaId =
            this.selectedEmpresaId === empresa.EmpresaId ? null : empresa.EmpresaId;
    }

    // ── CRUD ─────────────────────────────────────────────────

    loadEmpresas(): void {
        this.isLoading = true;
        this._empresaService
            .listarEmpresas()
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe({
                next: (response) => {
                    if (response.status) {
                        this.empresas    = response.data;
                        this.lastUpdated = new Date();
                        // Cargar imágenes de forma asíncrona
                        this.loadAllImages();
                    }
                },
                error: (err) => console.error('Error loading companies:', err),
            });
    }

    /**
     * Carga las imágenes de todas las empresas en la lista
     */
    private loadAllImages(): void {
        this.empresas.forEach(empresa => {
            if (empresa.ImagenEmpresa && !this.imageUrls[empresa.ImagenEmpresa]) {
                this._empresaService.downloadImagen(empresa.ImagenEmpresa).subscribe({
                    next: (res) => {
                        if (res.status && res.data.bytesFile) {
                            // Construir el data URL: data:{contentType};base64,{bytesFile}
                            const dataUrl = `data:${res.data.contentType};base64,${res.data.bytesFile}`;
                            this.imageUrls[empresa.ImagenEmpresa] = dataUrl;
                        }
                    }
                });
            }
        });
    }

    openCreateDialog(): void {
        const dialogRef = this._dialog.open(EmpresaCreateDialogComponent, {
            width: '560px',
            maxWidth: '95vw',
            disableClose: true,
            panelClass: 'empresa-dialog-panel',
        });

        dialogRef.afterClosed().subscribe((created: boolean) => {
            if (created) {
                this.loadEmpresas();
            }
        });
    }

    openEditDialog(empresa: Empresa): void {
        const dialogRef = this._dialog.open(EmpresaCreateDialogComponent, {
            width: '560px',
            maxWidth: '95vw',
            disableClose: true,
            panelClass: 'empresa-dialog-panel',
            data: { empresa, readOnly: false }
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.loadEmpresas();
            }
        });
    }

    openViewDialog(empresa: Empresa): void {
        this.openEditDialog(empresa);
    }

    deleteEmpresa(empresa: Empresa): void {
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Eliminar Empresa',
            message: `¿Estás seguro de que deseas eliminar la empresa "${empresa.NombreEmpresa}"? Esta acción no se puede deshacer.`,
            icon   : {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'warn'
            },
            actions: {
                confirm: {
                    label: 'Eliminar',
                    color: 'warn'
                },
                cancel : {
                    label: 'Cancelar'
                }
            }
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.isLoading = true;
                
                const request = {
                    data: {
                        p_IdEmpresa: empresa.EmpresaId,
                        p_IdUsuarioActual: this._authService.user()?.id ?? 0
                    }
                };

                this._empresaService.eliminarEmpresa(request)
                    .pipe(finalize(() => (this.isLoading = false)))
                    .subscribe({
                        next: (response) => {
                            if (response.status) {
                                this.loadEmpresas();
                            }
                        },
                        error: (err) => console.error('Error deleting company:', err),
                    });
            }
        });
    }
}
