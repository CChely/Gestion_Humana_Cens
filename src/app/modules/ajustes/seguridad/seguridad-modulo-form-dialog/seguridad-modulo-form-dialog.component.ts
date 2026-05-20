import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
    MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
    MatLegacyDialogRef as MatDialogRef,
} from "@angular/material/legacy-dialog";
import { SeguridadService } from "../seguridad.service";
import { Modulo } from "../seguridad.types";

@Component({
    selector: "seguridad-modulo-form-dialog",
    templateUrl: "./seguridad-modulo-form-dialog.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class SeguridadModuloFormDialogComponent implements OnInit {
    form: FormGroup;
    parentModulos: Modulo[] = [];
    parentModuloName: string = "";
    isSaving: boolean = false;
    isOpen: boolean = false;
    // Lista de iconos disponibles (puedes ampliarla con los que necesites)
    iconOptions: string[] = [
        "heroicons_outline:shield-check",
        "heroicons_outline:user",
        "heroicons_outline:user-group",
        "heroicons_outline:folder-open",
        "heroicons_outline:document",
        "heroicons_outline:chart-bar",
        "heroicons_outline:chart-pie",
        "heroicons_outline:cog",
        "heroicons_outline:calendar",
        "heroicons_outline:shopping-bag",
        "heroicons_outline:trash",
        "heroicons_outline:bell",
        "heroicons_outline:star",
        "heroicons_outline:exclamation",
        // agrega más según convenga
    ];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _dialogRef: MatDialogRef<SeguridadModuloFormDialogComponent>,
        private _fb: FormBuilder,
        private _seguridadService: SeguridadService,
    ) {
        this.parentModulos = data.parentModulos || [];
        if (data.selectedParentId) {
            const parent = this.parentModulos.find(
                (m) => m.ModuloId === data.selectedParentId,
            );
            this.parentModuloName = parent ? parent.NombreModulo : "";
        }

        // Si viene un módulo para editar, asignar el nombre del padre si lo tiene
        if (data.modulo && data.modulo.ModuloPadreId) {
            const parent = this.parentModulos.find(
                (m) => m.ModuloId === data.modulo.ModuloPadreId,
            );
            this.parentModuloName = parent ? parent.NombreModulo : "";
        }
    }

    ngOnInit(): void {
        const modulo = this.data.modulo;

        this.form = this._fb.group({
            p_IdModulo: [modulo?.ModuloId || null],
            p_IdModuloPadre: [
                modulo?.ModuloPadreId || this.data.selectedParentId || null,
            ],
            p_Codigo: [
                { value: modulo?.CodigoModulo || "", disabled: true },
                [Validators.required, Validators.maxLength(100)],
            ],
            p_Nombre: [
                modulo?.NombreModulo || "",
                [Validators.required, Validators.maxLength(150)],
            ],
            p_Ruta: [modulo?.RutaModulo || "", [Validators.maxLength(300)]],
            p_Icono: [modulo?.IconoModulo || "", [Validators.maxLength(100)]],
            p_Orden: [modulo?.OrdenModulo || 0],
            p_EsVisibleMenu: [modulo ? modulo.EsVisibleMenu === 1 : true],
            p_EsActivo: [modulo ? modulo.EsActivo === 1 : true],
        });

        // Generar código desde el nombre automáticamente (solo si es nuevo)
        if (!modulo) {
            this.form.get("p_Nombre").valueChanges.subscribe((value) => {
                if (value) {
                    const slug = this._slugify(value);
                    this.form.get("p_Codigo").setValue(slug);
                } else {
                    this.form.get("p_Codigo").setValue("");
                }
            });
        }
    }

    /**
     * Convierte texto a un formato de código (slug)
     */
    private _slugify(text: string): string {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .normalize("NFD") // Separar acentos del carácter
            .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
            .replace(/\s+/g, "-") // Reemplazar espacios por -
            .replace(/[^\w\-]+/g, "") // Eliminar caracteres no alfanuméricos (excepto -)
            .replace(/\-\-+/g, "-"); // Reemplazar múltiples - por uno solo
    }

    save(): void {
        if (this.form.invalid) return;

        this.isSaving = true;
        // Usar getRawValue para incluir campos deshabilitados (p_Codigo)
        const formData = {
            ...this.form.getRawValue(),
            p_IdUsuarioActual: 1, // TODO: Obtener del servicio de autenticación
        };

        this._seguridadService.saveModulo(formData).subscribe({
            next: (res) => {
                this.isSaving = false;
                if (res.status) {
                    this._dialogRef.close(true);
                }
            },
            error: () => {
                this.isSaving = false;
            },
        });
    }

    /**
     * Select an icon and update the form
     */
    selectIcon(icon: string): void {
        this.form.get("p_Icono").setValue(icon);
        this.isOpen = false;
    }

    close(): void {
        this._dialogRef.close();
    }
}
