import { Component } from '@angular/core';
import { INCREMENTOS_MOCK, IncrementoSalarialRecord } from './incremento-salarial.data';

@Component({
  selector: 'app-incremento-salarial',
  templateUrl: './incremento-salarial.component.html',
  styleUrls: ['./incremento-salarial.component.scss']
})
export class IncrementoSalarialComponent {
  records: IncrementoSalarialRecord[] = [...INCREMENTOS_MOCK];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 15;

  // Active filters and views
  showJsonView: boolean = false;
  isListCollapsed: boolean = false;
  collapsedItems: { [key: number]: boolean } = {};
  expandedRows: { [key: string]: boolean } = {};

  // Modals state
  isAddModalOpen: boolean = false;
  isEditModalOpen: boolean = false;
  selectedRecordKey: string | null = null;

  // Form Fields
  formCategoria: string = '[SELECCIONE]';
  formJornalDiario: number | null = null;
  formAplicaDesde: string = '2026-05-20'; // Defaulting to 20/05/2026 matching screenshots
  formAplicaTodos: boolean = true;
  formEstado: string = 'A';

  // Toast System
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | 'info' = 'success';

  // Sorting
  sortField: string = 'CATEGORIA';
  sortDirection: 'asc' | 'desc' = 'asc';

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

  formatJsonDateToDisplay(jsonDateStr: string | undefined | null): string {
    if (!jsonDateStr) return '';
    const yyyymmdd = this.parseJsonDate(jsonDateStr);
    if (!yyyymmdd) return '';
    const [year, month, day] = yyyymmdd.split('-');
    return `${day}/${month}/${year}`;
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

  get filteredRecords(): IncrementoSalarialRecord[] {
    let result = this.records;

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(r => {
        const cat = r.CATEGORIA.toLowerCase();
        const jornal = String(r.JORNALDIARIO).toLowerCase();
        const desde = this.formatJsonDateToDisplay(r.APLICA_DESDE).toLowerCase();
        const hasta = r.APLICA_HASTA ? this.formatJsonDateToDisplay(r.APLICA_HASTA).toLowerCase() : '';
        const aplicaTodosStr = r.APLICA_TODOS ? 'si' : 'no';
        return cat.includes(term) || jornal.includes(term) || desde.includes(term) || hasta.includes(term) || aplicaTodosStr.includes(term);
      });
    }

    return result;
  }

  get sortedRecords(): IncrementoSalarialRecord[] {
    const result = [...this.filteredRecords];

    if (this.sortField) {
      result.sort((a, b) => {
        let valA: any = a[this.sortField as keyof IncrementoSalarialRecord];
        let valB: any = b[this.sortField as keyof IncrementoSalarialRecord];

        // Custom formatting logic for date parsing comparison
        if (this.sortField === 'APLICA_DESDE' || this.sortField === 'APLICA_HASTA') {
          valA = this.parseJsonDate(valA as string);
          valB = this.parseJsonDate(valB as string);
        }

        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;

        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }

  get paginatedRecords(): IncrementoSalarialRecord[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.sortedRecords.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.sortedRecords.length / this.pageSize);
  }

  get totalRecords(): number {
    return this.sortedRecords.length;
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
    this.formCategoria = '[SELECCIONE]';
    this.formJornalDiario = null;
    this.formAplicaDesde = '2026-05-20'; // Defaulting to 20/05/2026
    this.formAplicaTodos = true;
    this.formEstado = 'A';
    this.isAddModalOpen = true;
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  openEditModal(item: IncrementoSalarialRecord): void {
    this.selectedRecordKey = item.SerialKey;
    this.formCategoria = item.CATEGORIA;
    this.formJornalDiario = item.JORNALDIARIO;
    this.formAplicaDesde = this.parseJsonDate(item.APLICA_DESDE);
    this.formAplicaTodos = item.APLICA_TODOS;
    this.formEstado = item.ESTADO;
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedRecordKey = null;
  }

  // CRUD Operations
  saveNewRecord(): void {
    if (this.formCategoria === '[SELECCIONE]') {
      this.showToast('Por favor seleccione una categoría.', 'error');
      return;
    }

    if (this.formJornalDiario === null || this.formJornalDiario <= 0) {
      this.showToast('Por favor ingrese un jornal diario válido mayor a 0.', 'error');
      return;
    }

    if (!this.formAplicaDesde) {
      this.showToast('Por favor ingrese la fecha de vigencia desde.', 'error');
      return;
    }

    const startTimestamp = new Date(this.formAplicaDesde + 'T00:00:00').getTime();
    const serialKey = 'key_var_jornal_' + Math.random().toString(36).substring(2, 10) + '..';

    let catId = 0;
    let catKey = '-hIzW7JlxJnDP8YcJ8QeEw..';
    if (this.formCategoria === 'Operario') {
      catId = 1;
      catKey = '-hIzW7JlxJnDP8YcJ8Qoper..';
    } else if (this.formCategoria === 'Peón') {
      catId = 2;
      catKey = '-hIzW7JlxJnDP8YcJ8Qpeon..';
    }

    // Set other matching historical records of same category as not ES_ULTIMO = false, and set APLICA_HASTA = one day before
    this.records = this.records.map(r => {
      if (r.CATEGORIA === this.formCategoria && r.ES_ULTIMO) {
        const oneDayBeforeTimestamp = startTimestamp - 86400000;
        return {
          ...r,
          ES_ULTIMO: false,
          APLICA_HASTA: `/Date(${oneDayBeforeTimestamp})/`
        };
      }
      return r;
    });

    const newRecord: IncrementoSalarialRecord = {
      VARIACIONJORNAL_ID: 0,
      CATEGORIACONSTRUCCIONCIVIL_ID: catId,
      JORNALDIARIO: this.formJornalDiario,
      APLICA_DESDE: `/Date(${startTimestamp})/`,
      APLICA_HASTA: null,
      APLICA_TODOS: this.formAplicaTodos,
      MOTIVOELIMINACIONKey: null,
      MOTIVOELIMINACION_ID: 0,
      OBSERVACIONELIMINACION: null,
      VARIACIONJORNALKey: null,
      CATEGORIACONSTRUCCIONCIVILKey: catKey,
      ListaCategorias: null,
      ListaMotivoEliminacionIncremento: null,
      ListaAplicaTodos: null,
      CATEGORIA: this.formCategoria,
      APLICATODOS: this.formAplicaTodos ? 'Si' : 'No',
      ES_ULTIMO: true,
      JORNALFORMAT: `S/ ${this.formJornalDiario.toFixed(2)}`,
      EDITAR: false,
      SerialKey: serialKey,
      ESTADO: this.formEstado,
      USUARIO_REG: 'jmendoza',
      FECHA_REG: `/Date(${Date.now()})/`,
      USUARIO_ACT: null,
      FECHA_ACT: null,
      FILTRO: null,
      FLG_MASIVO: false,
      FLG_MEMORIA: false,
      FLG_MODIFICADO: false,
      PageSize: 0,
      PageNumber: 0,
      TotalPage: 1
    };

    // Prepend to show on top
    this.records = [newRecord, ...this.records];
    this.currentPage = 1;
    this.closeAddModal();
    this.showToast('Incremento salarial registrado con éxito', 'success');
  }

  updateRecord(): void {
    if (!this.selectedRecordKey) return;

    if (this.formJornalDiario === null || this.formJornalDiario <= 0) {
      this.showToast('Por favor ingrese un jornal diario válido mayor a 0.', 'error');
      return;
    }

    if (!this.formAplicaDesde) {
      this.showToast('Por favor ingrese la fecha de vigencia desde.', 'error');
      return;
    }

    const startTimestamp = new Date(this.formAplicaDesde + 'T00:00:00').getTime();

    this.records = this.records.map(r => {
      if (r.SerialKey === this.selectedRecordKey) {
        return {
          ...r,
          JORNALDIARIO: this.formJornalDiario!,
          APLICA_DESDE: `/Date(${startTimestamp})/`,
          APLICA_TODOS: this.formAplicaTodos,
          APLICATODOS: this.formAplicaTodos ? 'Si' : 'No',
          JORNALFORMAT: `S/ ${this.formJornalDiario!.toFixed(2)}`,
          ESTADO: this.formEstado,
          USUARIO_ACT: 'sys',
          FECHA_ACT: `/Date(${Date.now()})/`,
          FLG_MODIFICADO: true
        };
      }
      return r;
    });

    this.closeEditModal();
    this.showToast('Incremento salarial actualizado con éxito', 'success');
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
      lista: this.records,
      pageSize: this.records.length,
      error: false,
      msj: null
    };
    navigator.clipboard.writeText(JSON.stringify(rawData, null, 4)).then(() => {
      this.showToast('JSON copiado al portapapeles con éxito', 'success');
    }).catch(() => {
      this.showToast('No se pudo copiar el JSON.', 'error');
    });
  }

  getRowJsonString(item: IncrementoSalarialRecord): string {
    return JSON.stringify(item, null, 2);
  }
}
