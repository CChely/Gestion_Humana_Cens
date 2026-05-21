import { Component } from '@angular/core';
import { PERIODOS_MOCK, PeriodoRecord } from './periodo.data';

@Component({
  selector: 'app-periodo',
  templateUrl: './periodo.component.html',
  styleUrls: ['./periodo.component.scss']
})
export class PeriodoComponent {
  periods: PeriodoRecord[] = [...PERIODOS_MOCK];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  
  // Active filters and views
  showJsonView: boolean = false;
  isListCollapsed: boolean = false;
  collapsedItems: { [key: number]: boolean } = {};
  expandedRows: { [key: string]: boolean } = {};
  
  // Modals state
  isAddModalOpen: boolean = false;
  isEditModalOpen: boolean = false;
  selectedPeriodKey: string | null = null;

  // Form Fields
  formDescripcion: string = '';
  formPeriodoDesde: string = '';
  formPeriodoHasta: string = '';
  formEstado: string = 'A';

  // Toast System
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | 'info' = 'success';

  // Sorting
  sortField: string = 'DESCRIPCION';
  sortDirection: 'asc' | 'desc' = 'desc';

  showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      if (this.toastMessage === message) {
        this.toastMessage = null;
      }
    }, 4000);
  }

  // Date converters
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

  formatJsonDateToDisplay(jsonDateStr: string | undefined): string {
    const yyyymmdd = this.parseJsonDate(jsonDateStr);
    if (!yyyymmdd) return '';
    const [year, month, day] = yyyymmdd.split('-');
    return `${day}/${month}/${year}`;
  }

  dateToMicroTime(dateStr: string): string {
    if (!dateStr) return '';
    const timestamp = new Date(dateStr + 'T00:00:00').getTime();
    return `/Date(${timestamp})/`;
  }

  // Row Expansion Control
  toggleRowExpand(key: string): void {
    this.expandedRows[key] = !this.expandedRows[key];
  }

  isRowExpanded(key: string): boolean {
    return !!this.expandedRows[key];
  }

  // Table operations
  setSort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  get filteredPeriods(): PeriodoRecord[] {
    let result = this.periods;

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(p => {
        const desc = p.DESCRIPCION.toLowerCase();
        const desde = this.formatJsonDateToDisplay(p.PERIODO_DESDE).toLowerCase();
        const hasta = this.formatJsonDateToDisplay(p.PERIODO_HASTA).toLowerCase();
        const estadoStr = p.ESTADO === 'A' ? 'activo' : 'inactivo';
        return desc.includes(term) || desde.includes(term) || hasta.includes(term) || estadoStr.includes(term);
      });
    }

    return result;
  }

  get sortedPeriods(): PeriodoRecord[] {
    const result = [...this.filteredPeriods];
    
    if (this.sortField) {
      result.sort((a, b) => {
        let valA: any = a[this.sortField as keyof PeriodoRecord];
        let valB: any = b[this.sortField as keyof PeriodoRecord];

        // Custom formatting logic for date parsing comparison
        if (this.sortField === 'PERIODO_DESDE' || this.sortField === 'PERIODO_HASTA') {
          valA = this.parseJsonDate(valA as string);
          valB = this.parseJsonDate(valB as string);
        }

        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }

  get paginatedPeriods(): PeriodoRecord[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.sortedPeriods.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.sortedPeriods.length / this.pageSize);
  }

  get totalRecords(): number {
    return this.sortedPeriods.length;
  }

  get startRecordIndex(): number {
    if (this.totalRecords === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endRecordIndex(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.totalRecords ? this.totalRecords : end;
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Modals operations
  openAddModal(): void {
    this.formDescripcion = '';
    this.formPeriodoDesde = '';
    this.formPeriodoHasta = '';
    this.formEstado = 'A';
    this.isAddModalOpen = true;
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  openEditModal(item: PeriodoRecord): void {
    this.selectedPeriodKey = item.SerialKey;
    this.formDescripcion = item.DESCRIPCION;
    this.formPeriodoDesde = this.parseJsonDate(item.PERIODO_DESDE);
    this.formPeriodoHasta = this.parseJsonDate(item.PERIODO_HASTA);
    this.formEstado = item.ESTADO;
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedPeriodKey = null;
  }

  // CRUD Operations
  saveNewPeriod(): void {
    // Basic format validation: MM/YYYY
    const descRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;
    if (!descRegex.test(this.formDescripcion)) {
      this.showToast('La descripción del periodo debe tener el formato MM/AAAA (ej. 12/2030)', 'error');
      return;
    }

    if (!this.formPeriodoDesde || !this.formPeriodoHasta) {
      this.showToast('Por favor complete las fechas de inicio y fin.', 'error');
      return;
    }

    const startTimestamp = new Date(this.formPeriodoDesde + 'T00:00:00').getTime();
    const endTimestamp = new Date(this.formPeriodoHasta + 'T00:00:00').getTime();

    if (startTimestamp > endTimestamp) {
      this.showToast('La fecha desde no puede ser posterior a la fecha hasta.', 'error');
      return;
    }

    const serialKey = 'key_period_' + Math.random().toString(36).substring(2, 10) + '..';

    const newRecord: PeriodoRecord = {
      PERIODO_ID: 0,
      DESCRIPCION: this.formDescripcion,
      PERIODO_DESDE: `/Date(${startTimestamp})/`,
      PERIODO_HASTA: `/Date(${endTimestamp})/`,
      PERIODOS_ID: null,
      ListaPeriodos: null,
      ListaPeriodosAnios: null,
      AGRUPADOR: null,
      ANOS: null,
      PERIODODETALLE_IDS: null,
      SerialKey: serialKey,
      ESTADO: this.formEstado,
      USUARIO_REG: 'sys',
      FECHA_REG: `/Date(${Date.now()})/`,
      USUARIO_ACT: '',
      FECHA_ACT: null,
      FILTRO: null,
      FLG_MASIVO: false,
      FLG_MEMORIA: false,
      FLG_MODIFICADO: false,
      PageSize: 0,
      PageNumber: 0,
      TotalPage: 372
    };

    // Prepend to show on top
    this.periods = [newRecord, ...this.periods];
    this.currentPage = 1;
    this.closeAddModal();
    this.showToast('Periodo registrado con éxito', 'success');
  }

  updatePeriod(): void {
    if (!this.selectedPeriodKey) return;

    const descRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;
    if (!descRegex.test(this.formDescripcion)) {
      this.showToast('La descripción del periodo debe tener el formato MM/AAAA (ej. 12/2030)', 'error');
      return;
    }

    if (!this.formPeriodoDesde || !this.formPeriodoHasta) {
      this.showToast('Por favor complete las fechas de inicio y fin.', 'error');
      return;
    }

    const startTimestamp = new Date(this.formPeriodoDesde + 'T00:00:00').getTime();
    const endTimestamp = new Date(this.formPeriodoHasta + 'T00:00:00').getTime();

    if (startTimestamp > endTimestamp) {
      this.showToast('La fecha desde no puede ser posterior a la fecha hasta.', 'error');
      return;
    }

    this.periods = this.periods.map(p => {
      if (p.SerialKey === this.selectedPeriodKey) {
        return {
          ...p,
          DESCRIPCION: this.formDescripcion,
          PERIODO_DESDE: `/Date(${startTimestamp})/`,
          PERIODO_HASTA: `/Date(${endTimestamp})/`,
          ESTADO: this.formEstado,
          USUARIO_ACT: 'sys',
          FECHA_ACT: `/Date(${Date.now()})/`,
          FLG_MODIFICADO: true
        };
      }
      return p;
    });

    this.closeEditModal();
    this.showToast('Periodo actualizado con éxito', 'success');
  }

  // JSON View Actions
  toggleListCollapse(): void {
    this.isListCollapsed = !this.isListCollapsed;
  }

  toggleItemCollapse(idx: number): void {
    this.collapsedItems[idx] = !this.collapsedItems[idx];
  }

  isItemCollapsed(idx: number): boolean {
    return !!this.collapsedItems[idx];
  }

  copyJsonToClipboard(): void {
    const rawData = {
      lista: this.periods,
      pageSize: 372,
      error: false,
      msj: null
    };
    navigator.clipboard.writeText(JSON.stringify(rawData, null, 4)).then(() => {
      this.showToast('JSON copiado al portapapeles con éxito', 'success');
    }).catch(() => {
      this.showToast('No se pudo copiar el JSON.', 'error');
    });
  }

  getRowJsonString(item: PeriodoRecord): string {
    return JSON.stringify(item, null, 2);
  }
}
