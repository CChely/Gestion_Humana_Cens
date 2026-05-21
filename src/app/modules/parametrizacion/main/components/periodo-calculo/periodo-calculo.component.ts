import { Component } from '@angular/core';
import { PERIODS_DATA, PeriodoCalculo, Periodo } from './periodo-calculo.data';

@Component({
  selector: 'app-periodo-calculo',
  templateUrl: './periodo-calculo.component.html',
  styleUrls: ['./periodo-calculo.component.scss']
})
export class PeriodoCalculoComponent {
  periods: PeriodoCalculo[] = [...PERIODS_DATA];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  selectedPeriodKeys: Set<string> = new Set();

  // Control de vista JSON
  showJsonView: boolean = false;
  isPeriodsCollapsed: boolean = false;
  collapsedItemsState: { [key: number]: boolean } = {};
  collapsedSubObjectsState: { [key: number]: boolean } = {};

  // Modales
  isPeriodModalOpen: boolean = false;
  isEditingPeriod: boolean = false;
  isDeleteModalOpen: boolean = false;
  periodKeyToDelete: string | null = null;

  // Variables del formulario
  periodoDesdeStr: string = '';
  periodoHastaStr: string = '';
  currentPeriodForm: Partial<PeriodoCalculo> = {
    PERIODODESC: '',
    UIT: 5500,
    RMV: 1130,
    TC: 3.8,
    ESTADO: 'A'
  };

  // Variables de alertas y notificaciones (Toast)
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | 'info' = 'success';

  showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      if (this.toastMessage === message) {
        this.toastMessage = null;
      }
    }, 4000);
  }

  parseJsonDate(jsonDateStr: string | undefined): string {
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

  get filteredPeriods(): PeriodoCalculo[] {
    let result = this.periods;
    
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(p => 
        p.PERIODODESC.toLowerCase().includes(term) ||
        p.UIT.toString().includes(term) ||
        p.RMV.toString().includes(term) ||
        p.TC.toString().includes(term)
      );
    }
    
    return result;
  }

  get sortedPeriods(): PeriodoCalculo[] {
    const result = [...this.filteredPeriods];
    if (!this.sortField) return result;
    
    return result.sort((a, b) => {
      let aVal = this.getNestedValue(a, this.sortField);
      let bVal = this.getNestedValue(b, this.sortField);

      if (this.sortField.includes('DESDE') || this.sortField.includes('HASTA')) {
        const matchA = aVal?.match(/\/Date\((\d+)\)\//);
        const matchB = bVal?.match(/\/Date\((\d+)\)\//);
        aVal = matchA ? parseInt(matchA[1]) : 0;
        bVal = matchB ? parseInt(matchB[1]) : 0;
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
  
  get paginatedPeriods(): PeriodoCalculo[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.sortedPeriods.slice(startIndex, startIndex + this.pageSize);
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredPeriods.length / this.pageSize);
  }
  
  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  isAllSelected(): boolean {
    const paginated = this.paginatedPeriods;
    if (paginated.length === 0) return false;
    return paginated.every(p => this.selectedPeriodKeys.has(p.PERIODOKey));
  }
  
  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const paginated = this.paginatedPeriods;
    if (checked) {
      paginated.forEach(p => this.selectedPeriodKeys.add(p.PERIODOKey));
    } else {
      paginated.forEach(p => this.selectedPeriodKeys.delete(p.PERIODOKey));
    }
  }
  
  toggleSelectPeriod(key: string): void {
    if (this.selectedPeriodKeys.has(key)) {
      this.selectedPeriodKeys.delete(key);
    } else {
      this.selectedPeriodKeys.add(key);
    }
  }

  isSelected(key: string): boolean {
    return this.selectedPeriodKeys.has(key);
  }

  openAddPeriodModal(): void {
    this.isEditingPeriod = false;
    this.currentPeriodForm = {
      PERIODOCALCULO_ID: 0,
      UIT: 5500,
      RMV: 1130,
      TC: 3.8,
      ESTADO: 'A'
    };
    this.periodoDesdeStr = '';
    this.periodoHastaStr = '';
    this.isPeriodModalOpen = true;
  }
  
  openEditPeriodModal(period: PeriodoCalculo): void {
    this.isEditingPeriod = true;
    this.currentPeriodForm = { 
      ...period,
      PERIODO: period.PERIODO ? { ...period.PERIODO } : undefined
    };
    this.periodoDesdeStr = this.parseJsonDate(period.PERIODO_DESDE);
    this.periodoHastaStr = this.parseJsonDate(period.PERIODO_HASTA);
    this.isPeriodModalOpen = true;
  }
  
  closePeriodModal(): void {
    this.isPeriodModalOpen = false;
  }
  
  savePeriod(): void {
    if (!this.periodoDesdeStr || !this.periodoHastaStr) {
      this.showToast('Por favor ingrese las fechas del periodo (Desde y Hasta).', 'error');
      return;
    }
    
    // Derive PERIODODESC from periodoDesdeStr
    const parts = this.periodoDesdeStr.split('-');
    const desc = parts.length >= 2 ? `${parts[1]}/${parts[0]}` : '';
    
    this.currentPeriodForm.PERIODODESC = desc;
    this.currentPeriodForm.PERIODO_DESDE = `/Date(${new Date(this.periodoDesdeStr + 'T00:00:00').getTime()})/`;
    this.currentPeriodForm.PERIODO_HASTA = `/Date(${new Date(this.periodoHastaStr + 'T00:00:00').getTime()})/`;
    
    if (this.isEditingPeriod) {
      const updatedPeriod = {
        ...this.currentPeriodForm,
        PERIODODESC: desc,
        PERIODO_DESDE: this.currentPeriodForm.PERIODO_DESDE,
        PERIODO_HASTA: this.currentPeriodForm.PERIODO_HASTA,
        PERIODO: {
          PERIODO_ID: this.currentPeriodForm.PERIODO?.PERIODO_ID || 0,
          DESCRIPCION: desc,
          PERIODO_DESDE: this.currentPeriodForm.PERIODO_DESDE,
          PERIODO_HASTA: this.currentPeriodForm.PERIODO_HASTA,
          FLG_MASIVO: false,
          FLG_MEMORIA: false,
          FLG_MODIFICADO: false,
          PageSize: 0,
          PageNumber: 0,
          TotalPage: 0
        }
      } as PeriodoCalculo;

      this.periods = this.periods.map(p => 
        p.PERIODOKey === this.currentPeriodForm.PERIODOKey ? updatedPeriod : p
      );
      this.showToast(`El periodo ${desc} ha sido actualizado correctamente.`, 'success');
    } else {
      const randomKey = Math.random().toString(36).substring(2, 8) + '_' + Math.random().toString(36).substring(2, 8) + '_..';
      const serialKey = Math.random().toString(36).substring(2, 8) + '-' + Math.random().toString(36).substring(2, 8) + '..';
      
      const newPeriodObj: Periodo = {
        PERIODO_ID: 0,
        DESCRIPCION: desc,
        PERIODO_DESDE: this.currentPeriodForm.PERIODO_DESDE,
        PERIODO_HASTA: this.currentPeriodForm.PERIODO_HASTA,
        FLG_MASIVO: false,
        FLG_MEMORIA: false,
        FLG_MODIFICADO: false,
        PageSize: 0,
        PageNumber: 0,
        TotalPage: 0
      };

      const newPeriod: PeriodoCalculo = {
        PERIODOCALCULO_ID: 0,
        UIT: this.currentPeriodForm.UIT || 0,
        RMV: this.currentPeriodForm.RMV || 0,
        TC: this.currentPeriodForm.TC || 0,
        RMV_RMINERO: 0,
        FLG_EDITABLE: true,
        PERIODOKey: randomKey,
        PERIODODESC: desc,
        PERIODO_DESDE: this.currentPeriodForm.PERIODO_DESDE,
        PERIODO_HASTA: this.currentPeriodForm.PERIODO_HASTA,
        PERIODO: newPeriodObj,
        mostrarInputMinero: false,
        SerialKey: serialKey,
        ESTADO: this.currentPeriodForm.ESTADO || 'A',
        FLG_MASIVO: false,
        FLG_MEMORIA: false,
        FLG_MODIFICADO: false,
        PageSize: 0,
        PageNumber: 0,
        TotalPage: 42
      };
      this.periods = [newPeriod, ...this.periods];
      this.showToast(`El periodo ${newPeriod.PERIODODESC} ha sido creado correctamente.`, 'success');
    }
    
    this.closePeriodModal();
  }
  
  confirmDeletePeriod(key: string): void {
    this.periodKeyToDelete = key;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.periodKeyToDelete = null;
  }

  executeDeletePeriod(): void {
    if (this.periodKeyToDelete) {
      const targetPeriod = this.periods.find(p => p.PERIODOKey === this.periodKeyToDelete);
      const desc = targetPeriod ? targetPeriod.PERIODODESC : '';
      
      this.periods = this.periods.filter(p => p.PERIODOKey !== this.periodKeyToDelete);
      this.selectedPeriodKeys.delete(this.periodKeyToDelete);
      
      if (this.currentPage > this.totalPages && this.currentPage > 1) {
        this.currentPage--;
      }
      
      this.showToast(`El periodo ${desc} ha sido eliminado correctamente.`, 'success');
    }
    this.closeDeleteModal();
  }

  // Métodos de visualización de árbol JSON
  togglePeriodsCollapse(): void {
    this.isPeriodsCollapsed = !this.isPeriodsCollapsed;
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

  expandAllJson(): void {
    this.isPeriodsCollapsed = false;
    this.collapsedItemsState = {};
    this.collapsedSubObjectsState = {};
  }

  collapseAllJson(): void {
    this.isPeriodsCollapsed = false;
    this.periods.forEach((_, i) => {
      this.collapsedItemsState[i] = true;
      this.collapsedSubObjectsState[i] = true;
    });
  }

  copyJsonToClipboard(): void {
    const wrapped = {
      lista: this.periods,
      pageSize: this.periods.length,
      error: false,
      msj: null
    };
    const jsonStr = JSON.stringify(wrapped, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
      this.showToast('JSON copiado al portapapeles.', 'success');
    }).catch(err => {
      this.showToast('No se pudo copiar el JSON.', 'error');
    });
  }
}
