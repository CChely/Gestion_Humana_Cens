import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { RepresentanteLegalDialogComponent } from './dialogs/representante-legal-dialog/representante-legal-dialog.component';
import { EmpresaService } from 'app/modules/ajustes/empresa/empresa.service';
import { RepresentanteLegalService } from './representante-legal.service';
import { AuthService } from 'app/core/auth/auth.service';

export interface RepresentanteLegal {
    id: number;
    empresaId?: number;
    empresaNombre?: string;
    nombre: string;
    dni: string;
    direccion: string;
    correo: string;
    celular: string;
    firma: string;
    estado: string; // Ej: 'Activo'
}

@Component({
    selector: 'app-representante-legal',
    templateUrl: './representante-legal.component.html',
    styleUrls: ['./representante-legal.component.scss']
})
export class RepresentanteLegalComponent implements OnInit {
    
    representantes: RepresentanteLegal[] = [];
    imageUrls: { [key: string]: string } = {};

    constructor(
        private _matDialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService,
        private _empresaService: EmpresaService,
        private _representanteLegalService: RepresentanteLegalService,
        private _authService: AuthService
    ) {}

    ngOnInit(): void {
        this.loadRepresentantes();
    }

    /**
     * Carga todos los representantes legales desde el backend
     */
    loadRepresentantes(): void {
        this._representanteLegalService.listarRepresentantes().subscribe({
            next: (response) => {
                if (response.status && response.data) {
                    this.representantes = response.data.map((item: any) => ({
                        id: item.RepresentanteLegalId,
                        empresaId: item.EmpresaId,
                        empresaNombre: item.NombreEmpresa,
                        nombre: item.NombreRepresentante,
                        dni: item.Dni,
                        direccion: item.Direccion,
                        correo: item.CorreoElectronico,
                        celular: item.Movil,
                        firma: item.Firma,
                        estado: 'Activo'
                    }));
                    this.loadAllImages();
                }
            },
            error: (err) => console.error('Error loading representantes:', err)
        });
    }

    /**
     * Carga las imágenes de firma de todos los representantes en la lista
     */
    private loadAllImages(): void {
        this.representantes.forEach(rep => {
            if (rep.firma && !this.imageUrls[rep.firma]) {
                if (rep.firma.startsWith('assets/') || rep.firma.startsWith('data:')) {
                    this.imageUrls[rep.firma] = rep.firma;
                } else {
                    this._empresaService.downloadImagen(rep.firma).subscribe({
                        next: (res) => {
                            if (res.status && res.data?.bytesFile) {
                                const dataUrl = `data:${res.data.contentType};base64,${res.data.bytesFile}`;
                                this.imageUrls[rep.firma] = dataUrl;
                            }
                        }
                    });
                }
            }
        });
    }

    crearRepresentante(): void {
        const dialogRef = this._matDialog.open(RepresentanteLegalDialogComponent, {
            autoFocus: false,
            width: '560px',
            maxWidth: '95vw',
            disableClose: true,
            data: { representante: null }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === true) {
                this.loadRepresentantes();
                console.log('Representante creado exitosamente');
            }
        });
    }

    editarRepresentante(id: number): void {
        const representante = this.representantes.find(r => r.id === id);
        if (!representante) return;

        const dialogRef = this._matDialog.open(RepresentanteLegalDialogComponent, {
            autoFocus: false,
            width: '560px',
            maxWidth: '95vw',
            disableClose: true,
            data: {
                representante: { ...representante }
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === true) {
                this.loadRepresentantes();
                console.log('Representante actualizado exitosamente');
            }
        });
    }

    eliminarRepresentante(id: number): void {
        const representante = this.representantes.find(r => r.id === id);
        if (!representante) return;

        const confirmation = this._fuseConfirmationService.open({
            title: 'Eliminar Representante',
            message: `¿Estás seguro de que deseas eliminar a <b>${representante.nombre}</b>? Esta acción no se puede deshacer.`,
            actions: {
                confirm: {
                    label: 'Eliminar'
                }
            }
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                const request = {
                    data: {
                        p_IdRepresentanteLegal: id,
                        p_IdUsuarioActual: Number(this._authService.user()?.id ?? 0)
                    },
                    params: null
                };

                this._representanteLegalService.eliminarRepresentante(request).subscribe({
                    next: (response) => {
                        if (response.status) {
                            this.representantes = this.representantes.filter(r => r.id !== id);
                            console.log('Representante eliminado exitosamente');
                        } else {
                            console.error('Error al eliminar representante:', response.message);
                        }
                    },
                    error: (err) => console.error('Error al eliminar representante:', err)
                });
            }
        });
    }
}
