import { Component, OnInit } from '@angular/core';
import { 
  Concepto, 
  ConceptoAsociacion, 
  CONCEPTOS_PAGINADO_DATA, 
  PLAME_OPTIONS, 
  CLASE_OPTIONS, 
  DEFAULT_GROUPS, 
  DEFAULT_ACCUMULATORS, 
  DEFAULT_PLANILLAS, 
  getInitialAssociations,
  Plame,
  ClaseConcepto
} from './conceptos.data';

@Component({
  selector: 'app-conceptos',
  templateUrl: './conceptos.component.html',
  styleUrls: ['./conceptos.component.scss']
})
export class ConceptosComponent implements OnInit {
  // Master lists
  conceptosList: Concepto[] = [];
  plameOptions: Plame[] = [];
  claseOptions: ClaseConcepto[] = [];

  // Search & Pagination
  searchQuery: string = '';
  currentPage: number = 1;
  pageSize: number = 10;

  // Sorting
  sortField: string = 'SECUENCIA_CALCULO';
  sortDirection: 'asc' | 'desc' = 'asc';

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

  // Wizard Stepper State
  currentStep: number = 1; // 1 to 4
  isEditing: boolean = false;
  selectedConcepto: Concepto | null = null;
  conceptoKeyToDelete: string | null = null;

  // Wizard Step 1: Concepto Fields
  formNombre: string = '';
  formAlias: string = '';
  formTipo: number = 1; // 1: Fijo, 2: Variable, 3: Otros
  formClaseId: number = 1;
  formDiasBaseMes: number = 1; // 1: 30 dias, 2: Dias calendario
  formPlameId: number | null = 1;
  formGuardaReferencias: boolean = false;
  formFechaCorte: boolean = false;
  formActivo: boolean = true;

  // Wizard Step 2, 3, 4: Temp Associations copies
  tempGrupos: ConceptoAsociacion[] = [];
  tempAcumuladores: ConceptoAsociacion[] = [];
  tempPlanillas: ConceptoAsociacion[] = [];

  // Internal wizard search queries
  searchGrupoQuery: string = '';
  searchAcumuladorQuery: string = '';
  searchPlanillaQuery: string = '';

  // Toast Notification Controls
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | 'info' = 'success';

  ngOnInit(): void {
    // Deep clone data to avoid modifying reference data directly
    this.conceptosList = JSON.parse(JSON.stringify(CONCEPTOS_PAGINADO_DATA));
    this.plameOptions = [...PLAME_OPTIONS];
    this.claseOptions = [...CLASE_OPTIONS];
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

  // Popover Actions Menu Helper
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

  // Sorting and filtering
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

  getFilteredList(): Concepto[] {
    if (!this.searchQuery.trim()) {
      return this.conceptosList;
    }
    const query = this.searchQuery.trim().toLowerCase();
    return this.conceptosList.filter(item => 
      item.NOMBRE.toLowerCase().includes(query) ||
      item.ALIAS.toLowerCase().includes(query) ||
      (item.PLAME?.CODIGO || '').includes(query) ||
      (item.PLAME?.DESCRIPCION || '').toLowerCase().includes(query)
    );
  }

  getSortedList(): Concepto[] {
    const filtered = this.getFilteredList();
    if (!this.sortField) return filtered;

    return [...filtered].sort((a, b) => {
      let aVal = this.getNestedValue(a, this.sortField);
      let bVal = this.getNestedValue(b, this.sortField);

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

  getPaginatedList(): Concepto[] {
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

  // Inline grid sequence editing helper
  updateInlineSequence(item: Concepto, event: Event): void {
    const input = event.target as HTMLInputElement;
    const val = parseInt(input.value, 10);
    if (!isNaN(val) && val >= 1) {
      item.SECUENCIA_CALCULO = val;
      // Optionally sort/trigger view refresh
      this.showToast(`Secuencia de '${item.NOMBRE}' actualizada a ${val}.`, 'info');
    }
  }

  // Stepper Handlers
  goToStep(step: number): void {
    if (step >= 1 && step <= 4) {
      // Basic validation for Step 1 before proceeding
      if (step > 1 && (!this.formNombre.trim() || !this.formAlias.trim() || !this.formPlameId)) {
        this.showToast('Debe ingresar el Nombre, el Alias y seleccionar un ID PLAME.', 'error');
        return;
      }
      this.currentStep = step;
    }
  }

  nextStep(): void {
    this.goToStep(this.currentStep + 1);
  }

  prevStep(): void {
    this.goToStep(this.currentStep - 1);
  }

  // Filter lists inside steps
  getFilteredGroups(): ConceptoAsociacion[] {
    if (!this.searchGrupoQuery.trim()) return this.tempGrupos;
    const query = this.searchGrupoQuery.toLowerCase().trim();
    return this.tempGrupos.filter(g => g.DESCRIPCION.toLowerCase().includes(query));
  }

  getFilteredAcumuladores(): ConceptoAsociacion[] {
    if (!this.searchAcumuladorQuery.trim()) return this.tempAcumuladores;
    const query = this.searchAcumuladorQuery.toLowerCase().trim();
    return this.tempAcumuladores.filter(a => a.DESCRIPCION.toLowerCase().includes(query));
  }

  getFilteredPlanillas(): ConceptoAsociacion[] {
    if (!this.searchPlanillaQuery.trim()) return this.tempPlanillas;
    const query = this.searchPlanillaQuery.toLowerCase().trim();
    return this.tempPlanillas.filter(p => p.DESCRIPCION.toLowerCase().includes(query));
  }

  // CRUD Triggering Modals
  openAddModal(): void {
    this.isEditing = false;
    this.selectedConcepto = null;
    this.currentStep = 1;

    // Reset Form Fields
    this.formNombre = '';
    this.formAlias = '';
    this.formTipo = 1;
    this.formClaseId = 1;
    this.formDiasBaseMes = 1;
    this.formPlameId = this.plameOptions.length > 0 ? this.plameOptions[0].PLAME_ID : null;
    this.formGuardaReferencias = false;
    this.formFechaCorte = false;
    this.formActivo = true;

    // Reset Local Wizards Searches
    this.searchGrupoQuery = '';
    this.searchAcumuladorQuery = '';
    this.searchPlanillaQuery = '';

    // Initialize temporary associations copies to empty checkbox toggles
    this.tempGrupos = getInitialAssociations(DEFAULT_GROUPS);
    this.tempAcumuladores = getInitialAssociations(DEFAULT_ACCUMULATORS);
    this.tempPlanillas = getInitialAssociations(DEFAULT_PLANILLAS);

    this.isAddEditOpen = true;
  }

  openEditModal(concepto: Concepto): void {
    this.isEditing = true;
    this.selectedConcepto = concepto;
    this.currentStep = 1;

    // Populate Fields
    this.formNombre = concepto.NOMBRE;
    this.formAlias = concepto.ALIAS;
    this.formTipo = concepto.FLG_TIPO;
    this.formClaseId = concepto.CLASECONCEPTO_ID || 1;
    this.formDiasBaseMes = concepto.FLG_DIASBASEMES;
    this.formPlameId = concepto.PLAME_ID;
    this.formGuardaReferencias = concepto.FLG_GUARDAREFERENCIAS;
    this.formFechaCorte = concepto.FLG_FECHACORTE;
    this.formActivo = concepto.FLG_ACTIVO;

    // Reset Searches
    this.searchGrupoQuery = '';
    this.searchAcumuladorQuery = '';
    this.searchPlanillaQuery = '';

    // Clone Associations
    this.tempGrupos = JSON.parse(JSON.stringify(concepto.ListaConceptoGrupos || getInitialAssociations(DEFAULT_GROUPS)));
    this.tempAcumuladores = JSON.parse(JSON.stringify(concepto.ListaConceptoAcumuladores || getInitialAssociations(DEFAULT_ACCUMULATORS)));
    this.tempPlanillas = JSON.parse(JSON.stringify(concepto.ListaConceptoPlanillas || getInitialAssociations(DEFAULT_PLANILLAS)));

    this.isAddEditOpen = true;
    this.closeActions();
  }

  closeAddEditModal(): void {
    this.isAddEditOpen = false;
  }

  saveConcepto(): void {
    // Perform Basic Validation
    if (!this.formNombre.trim() || !this.formAlias.trim() || !this.formPlameId) {
      this.showToast('Nombre, Alias e ID PLAME son requeridos.', 'error');
      return;
    }

    const plame = this.plameOptions.find(p => p.PLAME_ID === Number(this.formPlameId));
    const clase = this.claseOptions.find(c => c.CLASECONCEPTO_ID === Number(this.formClaseId));

    const tipoDesc = this.formTipo === 1 ? 'Fijo' : this.formTipo === 2 ? 'Variable' : 'Otros';
    const diasDesc = this.formDiasBaseMes === 1 ? '30 Dias' : 'Días Calendario';

    if (this.isEditing && this.selectedConcepto) {
      // Find and update item in master list
      const target = this.conceptosList.find(c => c.SerialKey === this.selectedConcepto!.SerialKey);
      if (target) {
        target.NOMBRE = this.formNombre;
        target.ALIAS = this.formAlias;
        target.FLG_TIPO = Number(this.formTipo);
        target.FLG_TIPO_DESC = tipoDesc;
        target.CLASECONCEPTO_ID = Number(this.formClaseId);
        target.CLASECONCEPTO = clase;
        target.FLG_DIASBASEMES = Number(this.formDiasBaseMes);
        target.FLG_DIASBASEMES_DESC = diasDesc;
        target.PLAME_ID = Number(this.formPlameId);
        target.PLAME = plame;
        target.FLG_GUARDAREFERENCIAS = this.formGuardaReferencias;
        target.FLG_FECHACORTE = this.formFechaCorte;
        target.FLG_ACTIVO = this.formActivo;
        target.ESTADO = this.formActivo ? 'A' : 'I';

        // Apply temporary associations
        target.ListaConceptoGrupos = [...this.tempGrupos];
        target.ListaConceptoAcumuladores = [...this.tempAcumuladores];
        target.ListaConceptoPlanillas = [...this.tempPlanillas];

        this.showToast(`Concepto '${target.NOMBRE}' modificado con éxito.`, 'success');
      }
    } else {
      // Sequence selection
      const nextSequence = this.conceptosList.length > 0 
        ? Math.max(...this.conceptosList.map(c => c.SECUENCIA_CALCULO)) + 1 
        : 1;

      const randomSerialKey = Math.random().toString(36).substring(2, 8) + '_' + Math.random().toString(36).substring(2, 8) + '_..';
      const randomCode = String(100000 + Math.floor(Math.random() * 900000)).substring(0, 6);

      const newConcepto: Concepto = {
        CONCEPTO_ID: 0,
        PLAME_ID: Number(this.formPlameId),
        CLASECONCEPTO_ID: Number(this.formClaseId),
        SECUENCIA_CALCULO: nextSequence,
        CODIGO: randomCode,
        NOMBRE: this.formNombre,
        ALIAS: this.formAlias,
        FLG_TIPO: Number(this.formTipo),
        FLG_TIPO_DESC: tipoDesc,
        FLG_DIASBASEMES: Number(this.formDiasBaseMes),
        FLG_DIASBASEMES_DESC: diasDesc,
        PLAME: plame,
        CLASECONCEPTO: clase,
        FLG_GUARDAREFERENCIAS: this.formGuardaReferencias,
        FLG_FECHACORTE: this.formFechaCorte,
        FLG_ACTIVO: this.formActivo,
        SerialKey: randomSerialKey,
        ESTADO: this.formActivo ? 'A' : 'I',
        USUARIO_REG: 'jmendoza',
        FECHA_REG: `/Date(${Date.now()})/`,
        ListaConceptoGrupos: [...this.tempGrupos],
        ListaConceptoAcumuladores: [...this.tempAcumuladores],
        ListaConceptoPlanillas: [...this.tempPlanillas]
      };

      // Append
      this.conceptosList = [newConcepto, ...this.conceptosList];
      this.showToast(`Concepto '${newConcepto.NOMBRE}' registrado exitosamente en secuencia ${nextSequence}.`, 'success');
    }

    this.isAddEditOpen = false;
  }

  // Deletion Handlers
  openDeleteConfirm(concepto: Concepto): void {
    this.selectedConcepto = concepto;
    this.conceptoKeyToDelete = concepto.SerialKey;
    this.isDeleteConfirmOpen = true;
    this.closeActions();
  }

  closeDeleteConfirm(): void {
    this.isDeleteConfirmOpen = false;
    this.conceptoKeyToDelete = null;
    this.selectedConcepto = null;
  }

  executeDelete(): void {
    if (this.conceptoKeyToDelete) {
      const name = this.selectedConcepto ? this.selectedConcepto.NOMBRE : '';
      this.conceptosList = this.conceptosList.filter(c => c.SerialKey !== this.conceptoKeyToDelete);
      
      if (this.currentPage > this.getTotalPages() && this.currentPage > 1) {
        this.currentPage--;
      }

      this.showToast(`El concepto '${name}' ha sido removido del sistema de forma permanente.`, 'success');
    }
    this.closeDeleteConfirm();
  }

  // Toggle single membership associations
  toggleAssociation(item: ConceptoAsociacion): void {
    item.FLG_ACTIVO = !item.FLG_ACTIVO;
  }

  // Obsidian JSON Collapsing Handlers
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
      lista: this.conceptosList,
      pageSize: this.conceptosList.length,
      error: false,
      msj: null
    };
    const jsonStr = JSON.stringify(responsePayload, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
      this.showToast('JSON de conceptos copiado al portapapeles.', 'success');
    }).catch(() => {
      this.showToast('No se pudo copiar el JSON.', 'error');
    });
  }
}
