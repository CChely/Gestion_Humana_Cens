import { Component, OnInit } from '@angular/core';
import { 
  ParametricaCalculo, 
  TIPO_DATO_OPTIONS, 
  VALORES_GENERALES_MOCK 
} from './valores-generales.data';

@Component({
  selector: 'app-valores-generales',
  templateUrl: './valores-generales.component.html',
  styleUrls: ['./valores-generales.component.scss']
})
export class ValoresGeneralesComponent implements OnInit {
  // Master lists
  valoresList: ParametricaCalculo[] = [];
  tipoDatoOptions: string[] = [];

  // Search & Pagination
  searchQuery: string = '';
  currentPage: number = 1;
  pageSize: number = 10;

  // Sorting
  sortField: string = 'CODIGO';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Obsidian JSON View Controls
  showJsonView: boolean = false;
  isJsonCollapsed: boolean = false;
  collapsedItemsState: { [key: number]: boolean } = {};
  collapsedSubObjectsState: { [key: number]: boolean } = {};

  // Modals Visibility Controls
  isAddEditOpen: boolean = false;
  isDeleteConfirmOpen: boolean = false;

  // Form Fields
  isEditing: boolean = false;
  selectedValor: ParametricaCalculo | null = null;
  valorKeyToDelete: string | null = null;

  formTipoDato: string = '';
  formCodigo: string = '';
  formDescripcion: string = '';
  formValor: string = '';
  formVigente: boolean = true;

  // Search/Filter for dropdown inside Register/Edit (searchable styled dropdown)
  dropdownSearchQuery: string = '';
  isDropdownOpen: boolean = false;

  // Toast Notification Controls
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | 'info' = 'success';

  ngOnInit(): void {
    // Deep clone data to avoid modifying reference data directly
    this.valoresList = JSON.parse(JSON.stringify(VALORES_GENERALES_MOCK));
    this.tipoDatoOptions = [...TIPO_DATO_OPTIONS];
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

  // Filter list by searchQuery
  getFilteredList(): ParametricaCalculo[] {
    let list = [...this.valoresList];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(item => 
        (item.CODIGO && item.CODIGO.toLowerCase().includes(q)) ||
        (item.DESCRIPCION && item.DESCRIPCION.toLowerCase().includes(q)) ||
        (item.VALOR && item.VALOR.toLowerCase().includes(q)) ||
        (item.TIPODATO && item.TIPODATO.DESCRIPCION && item.TIPODATO.DESCRIPCION.toLowerCase().includes(q))
      );
    }

    // Sort list
    list.sort((a, b) => {
      let valA: any = a[this.sortField as keyof ParametricaCalculo];
      let valB: any = b[this.sortField as keyof ParametricaCalculo];

      // Handle nested fields
      if (this.sortField === 'TIPODATO') {
        valA = a.TIPODATO?.DESCRIPCION || '';
        valB = b.TIPODATO?.DESCRIPCION || '';
      }

      // Convert to string for case-insensitive alphabetical sorting
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB || '').toString().toLowerCase();
      }

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }

  // Get current page list
  getPaginatedList(): ParametricaCalculo[] {
    const list = this.getFilteredList();
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return list.slice(startIndex, startIndex + this.pageSize);
  }

  getTotalPages(): number {
    return Math.ceil(this.getFilteredList().length / this.pageSize) || 1;
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  setSort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  // Filtered dropdown options for "Tipo dato" searchable dropdown
  getFilteredDropdownOptions(): string[] {
    if (!this.dropdownSearchQuery.trim()) {
      return this.tipoDatoOptions;
    }
    const q = this.dropdownSearchQuery.toLowerCase().trim();
    return this.tipoDatoOptions.filter(opt => opt.toLowerCase().includes(q));
  }

  selectDropdownOption(opt: string): void {
    this.formTipoDato = opt;
    this.isDropdownOpen = false;
    this.dropdownSearchQuery = '';
  }

  // Add / Edit actions
  openAddModal(): void {
    this.isEditing = false;
    this.selectedValor = null;
    
    // Default values
    this.formTipoDato = '';
    this.formCodigo = '';
    this.formDescripcion = '';
    this.formValor = '';
    this.formVigente = true;
    
    this.dropdownSearchQuery = '';
    this.isDropdownOpen = false;

    this.isAddOpenEditModal();
  }

  isAddOpenEditModal(): void {
    this.isAddEditOpen = true;
  }

  openEditModal(item: ParametricaCalculo): void {
    this.isEditing = true;
    this.selectedValor = item;

    // Prefill form
    this.formTipoDato = item.TIPODATO?.DESCRIPCION || '';
    this.formCodigo = item.CODIGO || '';
    this.formDescripcion = item.DESCRIPCION || '';
    this.formValor = item.VALOR || '';
    this.formVigente = item.FLG_ESTADO;

    this.dropdownSearchQuery = '';
    this.isDropdownOpen = false;

    this.isAddEditOpen = true;
  }

  closeModal(): void {
    this.isAddEditOpen = false;
  }

  saveValor(): void {
    if (this.isEditing) {
      if (!this.formDescripcion || !this.formValor || !this.formTipoDato) {
        this.showToast('Por favor complete todos los campos obligatorios (*)', 'error');
        return;
      }
    } else {
      if (!this.formCodigo || !this.formDescripcion || !this.formValor || !this.formTipoDato) {
        this.showToast('Por favor complete todos los campos obligatorios (*)', 'error');
        return;
      }
    }

    const cleanCodigo = this.formCodigo.trim().toUpperCase();
    const cleanDescripcion = this.formDescripcion.trim();
    const cleanValor = this.formValor.trim();

    // Check code duplication for addition
    if (!this.isEditing) {
      const exists = this.valoresList.some(item => item.CODIGO === cleanCodigo);
      if (exists) {
        this.showToast(`El código "${cleanCodigo}" ya está registrado.`, 'error');
        return;
      }
    }

    if (this.isEditing && this.selectedValor) {
      // Edit in memory
      this.valoresList = this.valoresList.map(item => {
        if (item.SerialKey === this.selectedValor?.SerialKey) {
          return {
            ...item,
            DESCRIPCION: cleanDescripcion,
            VALOR: cleanValor,
            FLG_ESTADO: this.formVigente,
            TIPODATO: {
              ...item.TIPODATO,
              DESCRIPCION: this.formTipoDato
            },
            USUARIO_ACT: 'bacuna',
            FECHA_ACT: `/Date(${Date.now()})/`
          };
        }
        return item;
      });

      this.showToast(`Parámetro "${this.selectedValor.CODIGO}" guardado con éxito.`, 'success');
    } else {
      // Register/Add new in memory
      const newSerial = `key_${Math.random().toString(36).substr(2, 9)}..`;
      const newParam: ParametricaCalculo = {
        PARAMETRICASCALCULO_ID: 0,
        PARAMETRICASCALCULO_IDS: null,
        CODIGO: cleanCodigo,
        DESCRIPCION: cleanDescripcion,
        TIPODATO_ID: null,
        VALOR: cleanValor,
        FLG_ESTADO: this.formVigente,
        PARAMETRICASCALCULOKey: null,
        TIPODATOKey: 'AtjPeVHIBDXVnFAEqlS6bg..',
        ListaTipoDato: null,
        TIPODATO: {
          TIPOVARIABLE_ID: 0,
          DESCRIPCION: this.formTipoDato,
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
        SerialKey: newSerial,
        ESTADO: 'A',
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
        TotalPage: 68
      };

      this.valoresList = [newParam, ...this.valoresList];
      this.showToast(`Parámetro "${cleanCodigo}" registrado con éxito.`, 'success');
    }

    this.isAddEditOpen = false;
    this.currentPage = 1;
  }

  // Deletion logic
  openDeleteConfirm(item: ParametricaCalculo): void {
    this.valorKeyToDelete = item.SerialKey;
    this.selectedValor = item;
    this.isDeleteConfirmOpen = true;
  }

  closeDeleteConfirm(): void {
    this.isDeleteConfirmOpen = false;
    this.valorKeyToDelete = null;
    this.selectedValor = null;
  }

  deleteValor(): void {
    if (this.valorKeyToDelete) {
      const code = this.selectedValor?.CODIGO || 'Parámetro';
      this.valoresList = this.valoresList.filter(item => item.SerialKey !== this.valorKeyToDelete);
      this.showToast(`Parámetro "${code}" eliminado con éxito.`, 'success');
      this.closeDeleteConfirm();
      this.currentPage = 1;
    }
  }

  // Obsidian Dark JSON helper functions
  toggleJsonCollapse(): void {
    this.isJsonCollapsed = !this.isJsonCollapsed;
    const paginated = this.getPaginatedList();
    paginated.forEach((_, idx) => {
      this.collapsedItemsState[idx] = this.isJsonCollapsed;
      this.collapsedSubObjectsState[idx] = this.isJsonCollapsed;
    });
  }

  toggleItemCollapse(idx: number): void {
    this.collapsedItemsState[idx] = !this.collapsedItemsState[idx];
  }

  isItemCollapsed(idx: number): boolean {
    return !!this.collapsedItemsState[idx];
  }

  toggleSubObjectCollapse(idx: number): void {
    this.collapsedSubObjectsState[idx] = !this.collapsedSubObjectsState[idx];
  }

  isSubObjectCollapsed(idx: number): boolean {
    return !!this.collapsedSubObjectsState[idx];
  }

  copyJsonToClipboard(): void {
    const listToCopy = this.getFilteredList();
    const payload = {
      lista: listToCopy.map(item => ({
        PARAMETRICASCALCULO_ID: item.PARAMETRICASCALCULO_ID,
        PARAMETRICASCALCULO_IDS: item.PARAMETRICASCALCULO_IDS,
        CODIGO: item.CODIGO,
        DESCRIPCION: item.DESCRIPCION,
        TIPODATO_ID: item.TIPODATO_ID,
        VALOR: item.VALOR,
        FLG_ESTADO: item.FLG_ESTADO,
        PARAMETRICASCALCULOKey: item.PARAMETRICASCALCULOKey,
        TIPODATOKey: item.TIPODATOKey,
        ListaTipoDato: item.ListaTipoDato,
        TIPODATO: {
          TIPOVARIABLE_ID: item.TIPODATO.TIPOVARIABLE_ID,
          DESCRIPCION: item.TIPODATO.DESCRIPCION,
          SerialKey: item.TIPODATO.SerialKey,
          ESTADO: item.TIPODATO.ESTADO,
          USUARIO_REG: item.TIPODATO.USUARIO_REG,
          FECHA_REG: item.TIPODATO.FECHA_REG,
          USUARIO_ACT: item.TIPODATO.USUARIO_ACT,
          FECHA_ACT: item.TIPODATO.FECHA_ACT,
          FILTRO: item.TIPODATO.FILTRO,
          FLG_MASIVO: item.TIPODATO.FLG_MASIVO,
          FLG_MEMORIA: item.TIPODATO.FLG_MEMORIA,
          FLG_MODIFICADO: item.TIPODATO.FLG_MODIFICADO,
          PageSize: item.TIPODATO.PageSize,
          PageNumber: item.TIPODATO.PageNumber,
          TotalPage: item.TIPODATO.TotalPage
        },
        SerialKey: item.SerialKey,
        ESTADO: item.ESTADO,
        USUARIO_REG: item.USUARIO_REG,
        FECHA_REG: item.FECHA_REG,
        USUARIO_ACT: item.USUARIO_ACT,
        FECHA_ACT: item.FECHA_ACT,
        FILTRO: item.FILTRO,
        FLG_MASIVO: item.FLG_MASIVO,
        FLG_MEMORIA: item.FLG_MEMORIA,
        FLG_MODIFICADO: item.FLG_MODIFICADO,
        PageSize: item.PageSize,
        PageNumber: item.PageNumber,
        TotalPage: item.TotalPage
      })),
      pageSize: listToCopy.length,
      error: false,
      msj: null
    };

    const textToCopy = JSON.stringify(payload, null, 4);

    navigator.clipboard.writeText(textToCopy).then(
      () => {
        this.showToast('JSON copiado al portapapeles', 'success');
      },
      () => {
        this.showToast('No se pudo copiar el JSON', 'error');
      }
    );
  }
}
