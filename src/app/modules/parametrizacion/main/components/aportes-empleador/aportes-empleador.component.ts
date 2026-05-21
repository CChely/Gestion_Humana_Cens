import { Component, OnInit } from '@angular/core';
import { 
  APORTES_EMPLEADOR_PAGINADO_DATA, 
  ParametroGeneral, 
  Periodo 
} from './aportes-empleador.data';

@Component({
  selector: 'app-aportes-empleador',
  templateUrl: './aportes-empleador.component.html',
  styleUrls: ['./aportes-empleador.component.scss']
})
export class AportesEmpleadorComponent implements OnInit {
  // Master lists in memory
  aportesList: ParametroGeneral[] = [];

  // Search and Pagination
  searchPeriodo: string = '';
  currentPage: number = 1;
  pageSize: number = 10;

  // Selected action key for popover menu toggles
  activeActionKey: string | null = null;

  // Obsidian JSON View Controls
  showJsonView: boolean = false;
  isJsonCollapsed: boolean = false;
  collapsedItemsState: { [key: number]: boolean } = {};
  collapsedSubObjectsState: { [key: number]: boolean } = {};

  // Modals Visibility Controls
  isAddEditOpen: boolean = false;
  isDeleteConfirmOpen: boolean = false;

  // Selected active items
  selectedAporte: ParametroGeneral | null = null;
  aporteKeyToDelete: string | null = null;
  isEditing: boolean = false;

  // Form Fields
  formPeriodoDesdeStr: string = '';
  formPeriodoHastaStr: string = '';
  
  formAportesis: number | null = null;
  formAsigFamiliar: number | null = null;
  formAporteEssalud: number | null = null;
  formAporteEps: number | null = null;
  formAporteEssaludVida: number | null = null;
  formSenati: number | null = null;
  formEpsIndividual: number | null = null;
  formPorcentajeVidaLey: number | null = null;
  formTopeAporteVidaLey: number | null = null;
  formTasaNoDomiciliado: number | null = null;
  formEstado: string = 'A';

  // Toast Notification Controls
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | 'info' = 'success';

  ngOnInit(): void {
    // Deep clone data to avoid modifying reference data directly
    this.aportesList = JSON.parse(JSON.stringify(APORTES_EMPLEADOR_PAGINADO_DATA));
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      if (this.toastMessage === message) {
        this.toastMessage = null;
      }
    }, 4000);
  }

  // Action Menu Helpers
  toggleActions(key: string, event: Event): void {
    event.stopPropagation();
    if (this.activeActionKey === key) {
      this.activeActionKey = null;
    } else {
      this.activeActionKey = key;
    }
  }

  closeActions(): void {
    this.activeActionKey = null;
  }

  // Sorting and Pagination Logic
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  setSort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  getNestedValue(obj: any, path: string): any {
    if (!obj) return null;
    return path.split('.').reduce((o, p) => (o ? o[p] : null), obj);
  }

  getFilteredList(): ParametroGeneral[] {
    if (!this.searchPeriodo.trim()) {
      return this.aportesList;
    }
    const query = this.searchPeriodo.trim().toLowerCase();
    return this.aportesList.filter(item => 
      (item.PERIODO?.DESCRIPCION || '').toLowerCase().includes(query)
    );
  }

  getSortedList(): ParametroGeneral[] {
    const filtered = this.getFilteredList();
    if (!this.sortField) return filtered;

    return [...filtered].sort((a, b) => {
      let aVal = this.getNestedValue(a, this.sortField);
      let bVal = this.getNestedValue(b, this.sortField);

      // Special Period Sorting Chronologically (MM/YYYY)
      if (this.sortField === 'PERIODO.DESCRIPCION') {
        const parsePeriod = (val: string) => {
          if (!val) return 0;
          const parts = val.split('/');
          if (parts.length === 2) {
            // YYYYMM as integer (e.g. 05/2026 -> 202605)
            return parseInt(parts[1] + parts[0], 10);
          }
          return 0;
        };
        aVal = parsePeriod(aVal);
        bVal = parsePeriod(bVal);
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return this.sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else {
        aVal = aVal === null || aVal === undefined ? 0 : aVal;
        bVal = bVal === null || bVal === undefined ? 0 : bVal;
        return this.sortDirection === 'asc'
          ? (aVal > bVal ? 1 : -1)
          : (bVal > aVal ? 1 : -1);
      }
    });
  }

  getPaginatedList(): ParametroGeneral[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.getSortedList().slice(startIndex, startIndex + this.pageSize);
  }

  getTotalPages(): number {
    return Math.ceil(this.getFilteredList().length / this.pageSize) || 1;
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.closeActions();
    }
  }

  // Date Parsing Helpers
  parseJsonDate(jsonDateStr: string | undefined | null): string {
    if (!jsonDateStr) return '';
    const match = jsonDateStr.match(/\/Date\((\d+)\)\//);
    if (match) {
      const date = new Date(parseInt(match[1]));
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return '';
  }

  // Formatter helpers for UI Table view
  formatMoney(val: number | null): string {
    if (val === null || val === undefined) return 'S/ 0.00';
    return `S/ ${val.toFixed(2)}`;
  }

  formatPercent(val: number | null): string {
    if (val === null || val === undefined) return '0.00 %';
    return `${val.toFixed(2)} %`;
  }

  // Obsidian JSON View collapsing handlers
  toggleJsonCollapse(): void {
    this.isJsonCollapsed = !this.isJsonCollapsed;
    if (this.isJsonCollapsed) {
      this.collapsedItemsState = {};
      this.collapsedSubObjectsState = {};
      this.getPaginatedList().forEach((_, i) => {
        this.collapsedItemsState[i] = true;
        this.collapsedSubObjectsState[i] = true;
      });
    } else {
      this.collapsedItemsState = {};
      this.collapsedSubObjectsState = {};
    }
  }

  toggleItemCollapse(index: number): void {
    this.collapsedItemsState[index] = !this.collapsedItemsState[index];
  }

  isItemCollapsed(index: number): boolean {
    return !!this.collapsedItemsState[index];
  }

  toggleSubObjectCollapse(index: number): void {
    this.collapsedSubObjectsState[index] = !this.collapsedSubObjectsState[index];
  }

  isSubObjectCollapsed(index: number): boolean {
    return !!this.collapsedSubObjectsState[index];
  }

  copyJsonToClipboard(): void {
    const responsePayload = {
      lista: this.aportesList,
      pageSize: this.aportesList.length,
      error: false,
      msj: null
    };
    const jsonStr = JSON.stringify(responsePayload, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
      this.showToast('JSON copiado al portapapeles exitosamente.', 'success');
    }).catch(() => {
      this.showToast('No se pudo copiar el JSON.', 'error');
    });
  }

  // CRUD Actions
  openAddModal(): void {
    this.isEditing = false;
    this.selectedAporte = null;
    
    // Clear Fields
    this.formPeriodoDesdeStr = '';
    this.formPeriodoHastaStr = '';
    this.formAportesis = null;
    this.formAsigFamiliar = null;
    this.formAporteEssalud = null;
    this.formAporteEps = null;
    this.formAporteEssaludVida = null;
    this.formSenati = null;
    this.formEpsIndividual = null;
    this.formPorcentajeVidaLey = null;
    this.formTopeAporteVidaLey = null;
    this.formTasaNoDomiciliado = null;
    this.formEstado = 'A';

    this.isAddEditOpen = true;
  }

  openEditModal(aporte: ParametroGeneral): void {
    this.isEditing = true;
    this.selectedAporte = aporte;

    // Populate Fields
    this.formPeriodoDesdeStr = this.parseJsonDate(aporte.PERIODO?.PERIODO_DESDE);
    this.formPeriodoHastaStr = this.parseJsonDate(aporte.PERIODO?.PERIODO_HASTA);
    this.formAportesis = aporte.APORTESIS;
    this.formAsigFamiliar = aporte.ASIGFAMILIAR;
    this.formAporteEssalud = aporte.APORTEESSALUD;
    this.formAporteEps = aporte.APORTEEPS;
    this.formAporteEssaludVida = aporte.APORTEESSALUDVIDA;
    this.formSenati = aporte.SENATI;
    this.formEpsIndividual = aporte.EPSINDIVIDUAL;
    this.formPorcentajeVidaLey = aporte.PORCENTAJE_VIDALEY;
    this.formTopeAporteVidaLey = aporte.TOPEAPORTEVIDALEY;
    this.formTasaNoDomiciliado = aporte.TASANODOMICILIADO;
    this.formEstado = aporte.ESTADO || 'A';

    this.isAddEditOpen = true;
    this.closeActions();
  }

  closeAddEditModal(): void {
    this.isAddEditOpen = false;
  }

  saveAporte(): void {
    // Basic validation
    if (this.isEditing) {
      if (!this.selectedAporte) return;
      
      // Update values
      const target = this.aportesList.find(a => a.SerialKey === this.selectedAporte!.SerialKey);
      if (target) {
        target.APORTESIS = this.formAportesis;
        target.ASIGFAMILIAR = this.formAsigFamiliar;
        target.APORTEESSALUD = this.formAporteEssalud;
        target.APORTEEPS = this.formAporteEps;
        target.APORTEESSALUDVIDA = this.formAporteEssaludVida;
        target.SENATI = this.formSenati;
        target.EPSINDIVIDUAL = this.formEpsIndividual;
        target.PORCENTAJE_VIDALEY = this.formPorcentajeVidaLey;
        target.TOPEAPORTEVIDALEY = this.formTopeAporteVidaLey;
        target.TASANODOMICILIADO = this.formTasaNoDomiciliado;
        target.ESTADO = this.formEstado;
        
        this.showToast(`Parámetros del período ${target.PERIODO.DESCRIPCION} actualizados con éxito.`, 'success');
      }
    } else {
      if (!this.formPeriodoDesdeStr || !this.formPeriodoHastaStr) {
        this.showToast('Debe ingresar las fechas de inicio y fin del período.', 'error');
        return;
      }
      if (this.formAsigFamiliar === null || this.formAporteEssalud === null || this.formAporteEps === null || this.formTasaNoDomiciliado === null) {
        this.showToast('Debe completar todos los aportes obligatorios marked con asterisco (*).', 'error');
        return;
      }

      // Calculate period description (e.g. 2026-05-19 -> 05/2026)
      const parts = this.formPeriodoDesdeStr.split('-');
      const desc = parts.length >= 2 ? `${parts[1]}/${parts[0]}` : 'Periodo';

      // Check duplicate period
      const duplicate = this.aportesList.find(a => a.PERIODO.DESCRIPCION === desc);
      if (duplicate) {
        this.showToast(`El período ${desc} ya se encuentra registrado.`, 'error');
        return;
      }

      const randomKey = Math.random().toString(36).substring(2, 8) + '_' + Math.random().toString(36).substring(2, 8) + '_..';
      const serialKey = Math.random().toString(36).substring(2, 8) + '-' + Math.random().toString(36).substring(2, 8) + '..';

      const newAporte: ParametroGeneral = {
        PARAMETROSGENERALES_ID: 0,
        PARAMETROSGENERALESID: null,
        PARAMETROSGENERALESKey: null,
        PERIODO_ID: null,
        APORTESIS: this.formAportesis,
        ASIGFAMILIAR: this.formAsigFamiliar,
        APORTEESSALUD: this.formAporteEssalud,
        APORTEEPS: this.formAporteEps,
        APORTEESSALUDVIDA: this.formAporteEssaludVida,
        APORTESCTRSALUD: null,
        APORTESCTRPENSION: null,
        SENATI: this.formSenati,
        EPSINDIVIDUAL: this.formEpsIndividual,
        TASANODOMICILIADO: this.formTasaNoDomiciliado,
        PERIODO_DESDE: null,
        PERIODO_HASTA: null,
        PERIODORECIENTE: false,
        PERIODOKey: randomKey,
        PERIODO: {
          PERIODO_ID: 0,
          DESCRIPCION: desc,
          PERIODO_DESDE: `/Date(${new Date(this.formPeriodoDesdeStr + 'T00:00:00').getTime()})/`,
          PERIODO_HASTA: `/Date(${new Date(this.formPeriodoHastaStr + 'T00:00:00').getTime()})/`,
          PERIODOS_ID: null,
          ListaPeriodos: null,
          ListaPeriodosAnios: null,
          AGRUPADOR: null,
          ANOS: null,
          PERIODODETALLE_IDS: null,
          SerialKey: null,
          ESTADO: null,
          USUARIO_REG: null,
          FECHA_REG: null,
          USUARIO_ACT: null,
          FECHA_ACT: null,
          FILTRO: null,
          FLG_MASIVO: false,
          FLG_MEMORIA: false,
          FLG_MODIFICADO: false,
          PageSize: 0,
          PageNumber: 0,
          TotalPage: 0
        },
        ListaPeriodos: null,
        PORCENTAJE_VIDALEY: this.formPorcentajeVidaLey,
        TOPEAPORTEVIDALEY: this.formTopeAporteVidaLey,
        SerialKey: serialKey,
        ESTADO: this.formEstado,
        USUARIO_REG: 'jmendoza',
        FECHA_REG: `/Date(${Date.now()})/`,
        USUARIO_ACT: 'jmendoza',
        FECHA_ACT: null,
        FILTRO: null,
        FLG_MASIVO: false,
        FLG_MEMORIA: false,
        FLG_MODIFICADO: false,
        PageSize: 0,
        PageNumber: 0,
        TotalPage: 1
      };

      this.aportesList = [newAporte, ...this.aportesList];
      this.showToast(`Los parámetros para el período ${desc} fueron creados con éxito.`, 'success');
    }

    this.closeAddEditModal();
  }

  openDeleteConfirm(aporte: ParametroGeneral): void {
    this.aporteKeyToDelete = aporte.SerialKey;
    this.isDeleteConfirmOpen = true;
    this.closeActions();
  }

  closeDeleteConfirm(): void {
    this.isDeleteConfirmOpen = false;
    this.aporteKeyToDelete = null;
  }

  executeDelete(): void {
    if (this.aporteKeyToDelete) {
      const target = this.aportesList.find(a => a.SerialKey === this.aporteKeyToDelete);
      const desc = target ? target.PERIODO.DESCRIPCION : '';
      
      this.aportesList = this.aportesList.filter(a => a.SerialKey !== this.aporteKeyToDelete);
      
      if (this.currentPage > this.getTotalPages() && this.currentPage > 1) {
        this.currentPage--;
      }

      this.showToast(`El registro del período ${desc} ha sido eliminado correctamente del sistema.`, 'success');
    }
    this.closeDeleteConfirm();
  }
}
