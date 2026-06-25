import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
} from "@angular/core";

export type PermissionToastType = "info" | "success" | "warning";

/**
 * Toast simple para notificar al usuario que sus permisos han cambiado.
 * Se cierra automáticamente después de 5 segundos o al hacer clic en la X.
 */
@Component({
    selector: "permission-toast",
    templateUrl: "./permission-toast.component.html",
    styleUrls: ["./permission-toast.component.scss"],
})
export class PermissionToastComponent implements OnChanges, OnDestroy {
    @Input() message: string | null = null;
    @Input() type: PermissionToastType = "info";
    @Output() closed = new EventEmitter<void>();

    isVisible = false;

    private _hideTimer: ReturnType<typeof setTimeout> | null = null;
    private readonly _displayDurationMs = 5000;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["message"]) {
            if (this.message) {
                this.show();
            } else {
                this.hide();
            }
        }
    }

    ngOnDestroy(): void {
        this._clearTimer();
    }

    show(): void {
        this.isVisible = true;
        this._clearTimer();
        this._hideTimer = setTimeout(() => {
            this.hide();
        }, this._displayDurationMs);
    }

    hide(): void {
        this.isVisible = false;
        this._clearTimer();
        this.closed.emit();
    }

    private _clearTimer(): void {
        if (this._hideTimer) {
            clearTimeout(this._hideTimer);
            this._hideTimer = null;
        }
    }
}
