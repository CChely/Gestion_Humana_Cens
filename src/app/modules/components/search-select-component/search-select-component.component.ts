import { Component, Input, forwardRef, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="w-full" [ngClass]="abierto && !disabled ? 'relative z-[100]' : 'relative'">
      <div class="flex items-center justify-between border border-slate-300 dark:border-slate-600 rounded-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all cursor-text overflow-hidden"
           [ngClass]="disabled ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800' : customClass || 'bg-white dark:bg-slate-900'"
           (click)="abrir()">
        <input type="text"
               class="w-full bg-transparent outline-none px-3 py-2 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 truncate"
               [class.cursor-not-allowed]="disabled"
               [placeholder]="placeholder"
               [(ngModel)]="busqueda"
               [disabled]="disabled"
               (focus)="abrir()"
               (input)="onSearch()" />
        <svg class="w-4 h-4 text-slate-400 shrink-0 mr-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>

      <div *ngIf="abierto && !disabled" class="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden">
        <ul class="max-h-48 overflow-y-auto py-1 custom-scrollbar relative z-50">
          <li *ngIf="opcionesFiltradas.length === 0" class="px-3 py-3 text-sm text-slate-500 text-center">No se encontraron resultados</li>
          <li *ngFor="let opt of opcionesFiltradas"
              class="px-3 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-slate-700 cursor-pointer text-slate-700 dark:text-slate-200 transition-colors"
              (click)="seleccionar(opt)">
            {{ opt[campoDesc] }}
          </li>
        </ul>
      </div>

      <div *ngIf="abierto && !disabled" class="fixed inset-0 z-40" (click)="cerrar()"></div>
    </div>
  `,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SearchSelectComponent), multi: true }]
})
export class SearchSelectComponent implements ControlValueAccessor, OnChanges {
  @Input() opciones: any[] = [];
  @Input() campoValor: string = 'codigo';
  @Input() campoDesc: string = 'descripcion';
  @Input() placeholder: string = '[SELECCIONE]';
  @Input() customClass: string = '';
  @Input() disabled: boolean = false;

  abierto = false;
  busqueda = '';
  valorSeleccionado: any = null;

  onChange: any = () => {};
  onTouch: any = () => {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['opciones'] && this.valorSeleccionado !== null) {
      this.restaurarBusqueda();
    }
  }

  get opcionesFiltradas() {
    if (!this.busqueda) return this.opciones || [];
    const term = this.busqueda.toLowerCase();
    return (this.opciones || []).filter(o => o[this.campoDesc]?.toLowerCase().includes(term));
  }

  abrir() { if (!this.disabled) { this.abierto = true; this.busqueda = ''; } }
  cerrar() { this.abierto = false; this.restaurarBusqueda(); }
  onSearch() { if (!this.abierto) this.abierto = true; }

  seleccionar(opt: any) {
    this.valorSeleccionado = opt[this.campoValor];
    this.busqueda = opt[this.campoDesc];
    this.abierto = false;
    this.onChange(this.valorSeleccionado);
  }

  restaurarBusqueda() {
    const item = (this.opciones || []).find(o => o[this.campoValor] === this.valorSeleccionado);
    this.busqueda = item ? item[this.campoDesc] : '';
  }

  writeValue(obj: any): void { this.valorSeleccionado = obj; this.restaurarBusqueda(); }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouch = fn; }
  setDisabledState?(isDisabled: boolean): void { this.disabled = isDisabled; }
}
