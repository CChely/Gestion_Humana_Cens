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
    filteredIconOptions: string[] = [];
    // Lista de todos los iconos disponibles en el set de heroicons-outline
    iconOptions: string[] = [
        "heroicons_outline:academic-cap",
        "heroicons_outline:adjustments",
        "heroicons_outline:arrow-circle-down",
        "heroicons_outline:annotation",
        "heroicons_outline:arrow-circle-left",
        "heroicons_outline:archive",
        "heroicons_outline:arrow-circle-right",
        "heroicons_outline:arrow-circle-up",
        "heroicons_outline:arrow-down",
        "heroicons_outline:arrow-left",
        "heroicons_outline:arrow-narrow-down",
        "heroicons_outline:arrow-narrow-left",
        "heroicons_outline:arrow-narrow-right",
        "heroicons_outline:arrow-narrow-up",
        "heroicons_outline:arrow-right",
        "heroicons_outline:arrow-sm-down",
        "heroicons_outline:arrow-sm-right",
        "heroicons_outline:arrow-sm-left",
        "heroicons_outline:arrow-sm-up",
        "heroicons_outline:arrow-up",
        "heroicons_outline:arrows-expand",
        "heroicons_outline:at-symbol",
        "heroicons_outline:backspace",
        "heroicons_outline:badge-check",
        "heroicons_outline:ban",
        "heroicons_outline:beaker",
        "heroicons_outline:bell",
        "heroicons_outline:book-open",
        "heroicons_outline:bookmark-alt",
        "heroicons_outline:bookmark",
        "heroicons_outline:briefcase",
        "heroicons_outline:cake",
        "heroicons_outline:calculator",
        "heroicons_outline:calendar",
        "heroicons_outline:camera",
        "heroicons_outline:cash",
        "heroicons_outline:chart-bar",
        "heroicons_outline:chart-pie",
        "heroicons_outline:chart-square-bar",
        "heroicons_outline:chat-alt-2",
        "heroicons_outline:chat-alt",
        "heroicons_outline:chat",
        "heroicons_outline:check-circle",
        "heroicons_outline:check",
        "heroicons_outline:chevron-double-down",
        "heroicons_outline:chevron-double-right",
        "heroicons_outline:chevron-down",
        "heroicons_outline:chevron-double-up",
        "heroicons_outline:chevron-left",
        "heroicons_outline:chevron-right",
        "heroicons_outline:chip",
        "heroicons_outline:chevron-up",
        "heroicons_outline:clipboard-check",
        "heroicons_outline:clipboard-copy",
        "heroicons_outline:clipboard-list",
        "heroicons_outline:clipboard",
        "heroicons_outline:chevron-double-left",
        "heroicons_outline:clock",
        "heroicons_outline:cloud-upload",
        "heroicons_outline:cloud-download",
        "heroicons_outline:cloud",
        "heroicons_outline:code",
        "heroicons_outline:cog",
        "heroicons_outline:collection",
        "heroicons_outline:color-swatch",
        "heroicons_outline:credit-card",
        "heroicons_outline:cube-transparent",
        "heroicons_outline:cube",
        "heroicons_outline:currency-bangladeshi",
        "heroicons_outline:currency-dollar",
        "heroicons_outline:currency-euro",
        "heroicons_outline:currency-pound",
        "heroicons_outline:currency-rupee",
        "heroicons_outline:currency-yen",
        "heroicons_outline:cursor-click",
        "heroicons_outline:database",
        "heroicons_outline:desktop-computer",
        "heroicons_outline:device-mobile",
        "heroicons_outline:device-tablet",
        "heroicons_outline:document-add",
        "heroicons_outline:document-download",
        "heroicons_outline:document-duplicate",
        "heroicons_outline:document-remove",
        "heroicons_outline:document-report",
        "heroicons_outline:document-search",
        "heroicons_outline:document-text",
        "heroicons_outline:document",
        "heroicons_outline:dots-circle-horizontal",
        "heroicons_outline:dots-horizontal",
        "heroicons_outline:dots-vertical",
        "heroicons_outline:download",
        "heroicons_outline:duplicate",
        "heroicons_outline:emoji-happy",
        "heroicons_outline:exclamation-circle",
        "heroicons_outline:emoji-sad",
        "heroicons_outline:exclamation",
        "heroicons_outline:external-link",
        "heroicons_outline:eye-off",
        "heroicons_outline:fast-forward",
        "heroicons_outline:eye",
        "heroicons_outline:film",
        "heroicons_outline:filter",
        "heroicons_outline:finger-print",
        "heroicons_outline:flag",
        "heroicons_outline:folder-add",
        "heroicons_outline:fire",
        "heroicons_outline:folder-download",
        "heroicons_outline:folder-open",
        "heroicons_outline:folder-remove",
        "heroicons_outline:folder",
        "heroicons_outline:gift",
        "heroicons_outline:globe-alt",
        "heroicons_outline:globe",
        "heroicons_outline:hand",
        "heroicons_outline:hashtag",
        "heroicons_outline:heart",
        "heroicons_outline:home",
        "heroicons_outline:identification",
        "heroicons_outline:inbox-in",
        "heroicons_outline:inbox",
        "heroicons_outline:key",
        "heroicons_outline:information-circle",
        "heroicons_outline:library",
        "heroicons_outline:light-bulb",
        "heroicons_outline:link",
        "heroicons_outline:location-marker",
        "heroicons_outline:lightning-bolt",
        "heroicons_outline:lock-closed",
        "heroicons_outline:login",
        "heroicons_outline:lock-open",
        "heroicons_outline:logout",
        "heroicons_outline:mail",
        "heroicons_outline:map",
        "heroicons_outline:menu-alt-1",
        "heroicons_outline:mail-open",
        "heroicons_outline:menu-alt-2",
        "heroicons_outline:menu-alt-3",
        "heroicons_outline:menu-alt-4",
        "heroicons_outline:menu",
        "heroicons_outline:microphone",
        "heroicons_outline:minus-circle",
        "heroicons_outline:minus-sm",
        "heroicons_outline:minus",
        "heroicons_outline:moon",
        "heroicons_outline:music-note",
        "heroicons_outline:newspaper",
        "heroicons_outline:office-building",
        "heroicons_outline:paper-airplane",
        "heroicons_outline:paper-clip",
        "heroicons_outline:pause",
        "heroicons_outline:pencil-alt",
        "heroicons_outline:phone-incoming",
        "heroicons_outline:phone-missed-call",
        "heroicons_outline:phone-outgoing",
        "heroicons_outline:pencil",
        "heroicons_outline:photograph",
        "heroicons_outline:phone",
        "heroicons_outline:plus-circle",
        "heroicons_outline:play",
        "heroicons_outline:plus-sm",
        "heroicons_outline:plus",
        "heroicons_outline:presentation-chart-bar",
        "heroicons_outline:presentation-chart-line",
        "heroicons_outline:printer",
        "heroicons_outline:puzzle",
        "heroicons_outline:qrcode",
        "heroicons_outline:question-mark-circle",
        "heroicons_outline:receipt-refund",
        "heroicons_outline:receipt-tax",
        "heroicons_outline:refresh",
        "heroicons_outline:reply",
        "heroicons_outline:rewind",
        "heroicons_outline:rss",
        "heroicons_outline:save",
        "heroicons_outline:save-as",
        "heroicons_outline:scale",
        "heroicons_outline:scissors",
        "heroicons_outline:search-circle",
        "heroicons_outline:search",
        "heroicons_outline:selector",
        "heroicons_outline:server",
        "heroicons_outline:share",
        "heroicons_outline:shield-check",
        "heroicons_outline:shield-exclamation",
        "heroicons_outline:shopping-bag",
        "heroicons_outline:shopping-cart",
        "heroicons_outline:sort-ascending",
        "heroicons_outline:sort-descending",
        "heroicons_outline:sparkles",
        "heroicons_outline:speakerphone",
        "heroicons_outline:star",
        "heroicons_outline:status-offline",
        "heroicons_outline:status-online",
        "heroicons_outline:stop",
        "heroicons_outline:sun",
        "heroicons_outline:support",
        "heroicons_outline:switch-horizontal",
        "heroicons_outline:switch-vertical",
        "heroicons_outline:table",
        "heroicons_outline:tag",
        "heroicons_outline:template",
        "heroicons_outline:terminal",
        "heroicons_outline:thumb-down",
        "heroicons_outline:thumb-up",
        "heroicons_outline:ticket",
        "heroicons_outline:translate",
        "heroicons_outline:trash",
        "heroicons_outline:trending-down",
        "heroicons_outline:trending-up",
        "heroicons_outline:truck",
        "heroicons_outline:upload",
        "heroicons_outline:user-add",
        "heroicons_outline:user-circle",
        "heroicons_outline:user-group",
        "heroicons_outline:user-remove",
        "heroicons_outline:user",
        "heroicons_outline:users",
        "heroicons_outline:variable",
        "heroicons_outline:video-camera",
        "heroicons_outline:view-boards",
        "heroicons_outline:view-grid-add",
        "heroicons_outline:view-grid",
        "heroicons_outline:view-list",
        "heroicons_outline:volume-off",
        "heroicons_outline:volume-up",
        "heroicons_outline:wifi",
        "heroicons_outline:x-circle",
        "heroicons_outline:x",
        "heroicons_outline:zoom-in",
        "heroicons_outline:zoom-out"
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

        // Inicializar la lista filtrada con todos los iconos
        this.filteredIconOptions = [...this.iconOptions];

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
     * Filtra los iconos por nombre
     */
    filterIcons(query: string): void {
        if (!query || query.trim() === '') {
            this.filteredIconOptions = [...this.iconOptions];
            return;
        }
        const q = query.toLowerCase().trim();
        this.filteredIconOptions = this.iconOptions.filter(icon => {
            const cleanName = icon.split(':')[1] || icon;
            return cleanName.toLowerCase().includes(q);
        });
    }

    /**
     * Maneja el evento de apertura/cierre del select de iconos
     */
    onIconSelectOpened(opened: boolean): void {
        if (!opened) {
            // Resetear filtro al cerrar
            this.filteredIconOptions = [...this.iconOptions];
        } else {
            // Auto-enfocar el input de búsqueda al abrir
            setTimeout(() => {
                const input = document.querySelector('.icon-search-input') as HTMLInputElement;
                if (input) {
                    input.value = '';
                    input.focus();
                }
            }, 150);
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
