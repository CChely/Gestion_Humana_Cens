import { Component, OnInit } from '@angular/core';
import { 
  TASAS_IMPUESTO_PAGINADO_DATA, 
  TASAS_IMPUESTO_DETALLE_DATA, 
  TasaQuintaCat, 
  TasaQuintaCatDetalle,
  PeriodoDetalle
} from './tasas-impuesto.data';

@Component({
  selector: 'app-tasas-impuesto',
  templateUrl: './tasas-impuesto.component.html',
  styleUrls: ['./tasas-impuesto.component.scss']
})
export class TasasImpuestoComponent implements OnInit {
  // Master lists in memory
  tasasImpuestoList: TasaQuintaCat[] = [];
  tasasImpuestoDetalles: TasaQuintaCatDetalle[] = [];

  // Search and Pagination
  searchEjercicio: string = '';
  currentPage: number = 1;
  pageSize: number = 10;

  // Selected action key for popover menu toggles
  activeActionKey: string | null = null;

  // Obsidian JSON View Controls
  showJsonView: boolean = false;
  isJsonCollapsed: boolean = false;
  collapsedItemsState: { [key: number]: boolean } = {};
  collapsedSubObjectsState: { [key: number]: boolean } = {};

  // JSON Details Collapsed Controls
  isDetailsJsonCollapsed: boolean = false;
  collapsedDetailItemsState: { [key: number]: boolean } = {};

  // Modals Visibility Controls
  isDetailOpen: boolean = false;
  isAddEditOpen: boolean = false;
  isDeleteConfirmOpen: boolean = false;

  // Selected active items
  selectedExercise: TasaQuintaCat | null = null;
  selectedExerciseDetails: TasaQuintaCatDetalle[] = [];
  exerciseKeyToDelete: string | null = null;
  isEditing: boolean = false;

  // Form Fields
  formEjercicio: string = '';
  formFechaDesde: string = '';
  formFechaHasta: string = '';
  formUit: number | null = null;
  formVigencia: boolean = false;
  formTramos: Partial<TasaQuintaCatDetalle>[] = [];

  // Single Tranche Add Fields
  formAplicaDesdeStr: string = '';
  formTasa: number = 8;
  
  // Slider Range controls (0 to 30 UIT, defaults to 0-5)
  sliderMin: number = 0;
  sliderMax: number = 30;
  sliderStart: number = 0;
  sliderEnd: number = 5;

  // Toast Notification Controls
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | 'info' = 'success';

  ngOnInit(): void {
    // Deep clone data to avoid modifying reference data directly
    this.tasasImpuestoList = JSON.parse(JSON.stringify(TASAS_IMPUESTO_PAGINADO_DATA));
    this.tasasImpuestoDetalles = JSON.parse(JSON.stringify(TASAS_IMPUESTO_DETALLE_DATA));
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

  // Filter, Sorting and Pagination Lógic
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

  getFilteredList(): TasaQuintaCat[] {
    if (!this.searchEjercicio.trim()) {
      return this.tasasImpuestoList;
    }
    return this.tasasImpuestoList.filter(item => 
      item.EJERCICIO.toLowerCase().includes(this.searchEjercicio.trim().toLowerCase())
    );
  }

  getSortedList(): TasaQuintaCat[] {
    const filtered = this.getFilteredList();
    if (!this.sortField) return filtered;

    return [...filtered].sort((a, b) => {
      let aVal = this.getNestedValue(a, this.sortField);
      let bVal = this.getNestedValue(b, this.sortField);

      if (this.sortField === 'FECHADESDE' || this.sortField === 'FECHAHASTA') {
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

  getPaginatedList(): TasaQuintaCat[] {
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

  formatJsonDate(jsonDateStr: string | undefined | null): string {
    if (!jsonDateStr) return '-';
    const match = jsonDateStr.match(/\/Date\((\d+)\)\//);
    if (match) {
      const date = new Date(parseInt(match[1]));
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return jsonDateStr;
  }

  // Dynamic Value Helper: Calculates (Tramo * UIT)
  getCalculatedValue(uitDesde: number, uitHasta: number | null, uit: number | null): string {
    if (!uit) {
      return uitHasta === null ? '0 +' : '0';
    }
    
    const formattedFrom = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(uitDesde * uit);
    
    if (uitHasta === null) {
      return `$ ${formattedFrom} +`;
    }
    
    const formattedTo = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(uitHasta * uit);
    return `$ ${formattedFrom} - $ ${formattedTo}`;
  }

  // CRUD Actions
  openDetail(exercise: TasaQuintaCat): void {
    this.selectedExercise = exercise;
    this.selectedExerciseDetails = this.tasasImpuestoDetalles.filter(
      det => det.TASASQUINTACATKey === exercise.SerialKey
    );
    this.isDetailOpen = true;
    this.closeActions();
  }

  openAdd(): void {
    this.isEditing = false;
    this.formEjercicio = '';
    this.formFechaDesde = '';
    this.formFechaHasta = '';
    this.formUit = null;
    this.formVigencia = false;
    this.formTramos = [];
    this.sliderStart = 0;
    this.sliderEnd = 5;
    this.formTasa = 8;
    this.isAddEditOpen = true;
    this.closeActions();
  }

  openEdit(exercise: TasaQuintaCat): void {
    this.isEditing = true;
    this.selectedExercise = exercise;
    this.formEjercicio = exercise.EJERCICIO;
    this.formFechaDesde = this.parseJsonDate(exercise.FECHADESDE);
    this.formFechaHasta = this.parseJsonDate(exercise.FECHAHASTA);
    this.formUit = exercise.UIT;
    this.formVigencia = exercise.FLG_VIGENCIA;
    
    // Load associated tranches
    this.formTramos = this.tasasImpuestoDetalles
      .filter(det => det.TASASQUINTACATKey === exercise.SerialKey)
      .map(det => ({ ...det }));

    this.sliderStart = 0;
    this.sliderEnd = 5;
    this.formTasa = 8;
    
    this.isAddEditOpen = true;
    this.closeActions();
  }

  openDelete(key: string): void {
    this.exerciseKeyToDelete = key;
    this.isDeleteConfirmOpen = true;
    this.closeActions();
  }

  confirmDelete(): void {
    if (this.exerciseKeyToDelete) {
      // Remove exercise
      this.tasasImpuestoList = this.tasasImpuestoList.filter(
        item => item.SerialKey !== this.exerciseKeyToDelete
      );
      // Remove details
      this.tasasImpuestoDetalles = this.tasasImpuestoDetalles.filter(
        det => det.TASASQUINTACATKey !== this.exerciseKeyToDelete
      );
      this.showToast('Ejercicio y sus tasas de impuesto eliminados correctamente.', 'success');
      this.isDeleteConfirmOpen = false;
      this.exerciseKeyToDelete = null;
    }
  }

  // Interactive Range Slider + Grid Methods
  addTranche(): void {
    if (this.sliderStart >= this.sliderEnd) {
      this.showToast('El rango de UIT inicial debe ser menor al rango final.', 'error');
      return;
    }

    // Add to current form brackets
    const newTranche: Partial<TasaQuintaCatDetalle> = {
      UITDESDE: this.sliderStart,
      UITHASTA: this.sliderEnd >= this.sliderMax ? null : this.sliderEnd,
      TASA: this.formTasa,
      SerialKey: Math.random().toString(36).substring(2, 9),
      ESTADO: 'A'
    };

    this.formTramos.push(newTranche);
    this.showToast('Tramo de tasa añadido temporalmente.', 'info');

    // Auto-advance sliders for ease of use
    if (this.sliderEnd < this.sliderMax) {
      this.sliderStart = this.sliderEnd;
      this.sliderEnd = Math.min(this.sliderStart + 15, this.sliderMax);
    }
  }

  removeTranche(index: number): void {
    this.formTramos.splice(index, 1);
    this.showToast('Tramo de tasa eliminado de la lista.', 'info');
  }

  saveExercise(): void {
    if (!this.formEjercicio) {
      this.showToast('Debe ingresar el Ejercicio Anual.', 'error');
      return;
    }
    if (!this.formFechaDesde || !this.formFechaHasta) {
      this.showToast('Debe seleccionar las fechas de inicio y fin.', 'error');
      return;
    }
    if (this.formTramos.length === 0) {
      this.showToast('Debe agregar al menos un tramo de tasa para este ejercicio.', 'error');
      return;
    }

    const startTimestamp = new Date(this.formFechaDesde).getTime();
    const endTimestamp = new Date(this.formFechaHasta).getTime();

    // If setting this exercise as active, deactivate other exercises
    if (this.formVigencia) {
      this.tasasImpuestoList.forEach(ex => ex.FLG_VIGENCIA = false);
    }

    if (this.isEditing && this.selectedExercise) {
      // Edit mode
      const idx = this.tasasImpuestoList.findIndex(ex => ex.SerialKey === this.selectedExercise!.SerialKey);
      if (idx !== -1) {
        this.tasasImpuestoList[idx] = {
          ...this.tasasImpuestoList[idx],
          EJERCICIO: this.formEjercicio,
          FECHADESDE: `/Date(${startTimestamp})/`,
          FECHAHASTA: `/Date(${endTimestamp})/`,
          UIT: this.formUit,
          FLG_VIGENCIA: this.formVigencia,
          PERIODODESDE: {
            ...this.tasasImpuestoList[idx].PERIODODESDE,
            DESCRIPCION: `01/${this.formEjercicio}`,
            PERIODO_DESDE: `/Date(${startTimestamp})/`
          },
          PERIODOHASTA: {
            ...this.tasasImpuestoList[idx].PERIODOHASTA,
            DESCRIPCION: `12/${this.formEjercicio}`,
            PERIODO_HASTA: `/Date(${endTimestamp})/`
          }
        };

        // Update details: delete old and save new
        this.tasasImpuestoDetalles = this.tasasImpuestoDetalles.filter(
          det => det.TASASQUINTACATKey !== this.selectedExercise!.SerialKey
        );

        this.formTramos.forEach(tr => {
          this.tasasImpuestoDetalles.push({
            TASASQUINTACATDETALLE_ID: null,
            TASASQUINTACAT_ID: null,
            UITDESDE: tr.UITDESDE ?? 0,
            UITHASTA: tr.UITHASTA ?? null,
            TASA: tr.TASA ?? 8,
            TASASQUINTACATKey: this.selectedExercise!.SerialKey,
            TASASQUINTACAT: null,
            SerialKey: tr.SerialKey ?? Math.random().toString(36).substring(2, 9),
            ESTADO: 'A',
            USUARIO_REG: 'jmendoza',
            FECHA_REG: `/Date(${Date.now()})/`,
            USUARIO_ACT: '',
            FECHA_ACT: null,
            FILTRO: null,
            FLG_MASIVO: false,
            FLG_MEMORIA: false,
            FLG_MODIFICADO: false,
            PageSize: 0,
            PageNumber: 0,
            TotalPage: 0
          });
        });
      }
      this.showToast('Ejercicio de tasas de impuesto guardado con éxito.', 'success');
    } else {
      // Add mode
      const newKey = `Key-${Math.random().toString(36).substring(2, 9)}`;
      const newExercise: TasaQuintaCat = {
        TASASQUINTACAT_ID: 0,
        PERIODODESDE_ID: null,
        PERIODOHASTA_ID: null,
        FLG_VIGENCIA: this.formVigencia,
        PERIODODESDEKey: `PFrom-${Math.random().toString(36).substring(2, 9)}`,
        PERIODOHASTAKey: `PTo-${Math.random().toString(36).substring(2, 9)}`,
        EJERCICIO: this.formEjercicio,
        FECHADESDE: `/Date(${startTimestamp})/`,
        FECHAHASTA: `/Date(${endTimestamp})/`,
        UIT: this.formUit,
        PERIODODESDE: {
          PERIODO_ID: 0,
          DESCRIPCION: `01/${this.formEjercicio}`,
          PERIODO_DESDE: `/Date(${startTimestamp})/`,
          PERIODO_HASTA: `/Date(${startTimestamp + 2592000000})/`,
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
        PERIODOHASTA: {
          PERIODO_ID: 0,
          DESCRIPCION: `12/${this.formEjercicio}`,
          PERIODO_DESDE: `/Date(${endTimestamp - 2592000000})/`,
          PERIODO_HASTA: `/Date(${endTimestamp})/`,
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
        ListaTasasDetalle: null,
        TASASQUINTACATDETALLE: null,
        SerialKey: newKey,
        ESTADO: 'A',
        USUARIO_REG: 'jmendoza',
        FECHA_REG: `/Date(${Date.now()})/`,
        USUARIO_ACT: '',
        FECHA_ACT: null,
        FILTRO: null,
        FLG_MASIVO: false,
        FLG_MEMORIA: false,
        FLG_MODIFICADO: false,
        PageSize: 0,
        PageNumber: 0,
        TotalPage: 6
      };

      this.tasasImpuestoList.unshift(newExercise);

      // Save details
      this.formTramos.forEach(tr => {
        this.tasasImpuestoDetalles.push({
          TASASQUINTACATDETALLE_ID: null,
          TASASQUINTACAT_ID: null,
          UITDESDE: tr.UITDESDE ?? 0,
          UITHASTA: tr.UITHASTA ?? null,
          TASA: tr.TASA ?? 8,
          TASASQUINTACATKey: newKey,
          TASASQUINTACAT: null,
          SerialKey: tr.SerialKey ?? Math.random().toString(36).substring(2, 9),
          ESTADO: 'A',
          USUARIO_REG: 'jmendoza',
          FECHA_REG: `/Date(${Date.now()})/`,
          USUARIO_ACT: '',
          FECHA_ACT: null,
          FILTRO: null,
          FLG_MASIVO: false,
          FLG_MEMORIA: false,
          FLG_MODIFICADO: false,
          PageSize: 0,
          PageNumber: 0,
          TotalPage: 0
        });
      });

      this.showToast('Ejercicio de tasas de impuesto creado exitosamente.', 'success');
    }

    this.isAddEditOpen = false;
    this.selectedExercise = null;
  }

  // Clipboard Copier
  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.showToast('Contenido copiado al portapapeles.', 'success');
    }).catch(err => {
      this.showToast('No se pudo copiar el JSON automáticamente.', 'error');
    });
  }

  getJsonPaginadoString(): string {
    const payload = {
      lista: this.tasasImpuestoList,
      pageSize: this.tasasImpuestoList.length,
      error: false,
      msj: null
    };
    return JSON.stringify(payload, null, 4);
  }

  getJsonDetalleString(): string {
    const payload = {
      lista: this.tasasImpuestoDetalles,
      pageSize: this.tasasImpuestoDetalles.length,
      error: false,
      msj: null
    };
    return JSON.stringify(payload, null, 4);
  }

  // Obsidian JSON Node Collapsing Actions
  toggleJsonCollapse(): void {
    this.isJsonCollapsed = !this.isJsonCollapsed;
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

  // JSON Details node controls
  toggleDetailsJsonCollapse(): void {
    this.isDetailsJsonCollapsed = !this.isDetailsJsonCollapsed;
  }

  toggleDetailItemCollapse(index: number): void {
    this.collapsedDetailItemsState[index] = !this.collapsedDetailItemsState[index];
  }

  isDetailItemCollapsed(index: number): boolean {
    return !!this.collapsedDetailItemsState[index];
  }
}
