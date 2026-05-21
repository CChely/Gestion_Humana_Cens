import { Component } from '@angular/core';
import { 
  NOMINAS_REGIMEN_PAGINADO_DATA, 
  MASTER_DATA_COLLECTION, 
  NominasRegimen, 
  MasterDataItem, 
  NominaSubDetalle 
} from './nominas-regimen.data';

@Component({
  selector: 'app-nominas-regimen',
  templateUrl: './nominas-regimen.component.html',
  styleUrls: ['./nominas-regimen.component.scss']
})
export class NominasRegimenComponent {
  nominas: NominasRegimen[] = [...NOMINAS_REGIMEN_PAGINADO_DATA];
  masterData: MasterDataItem[] = [...MASTER_DATA_COLLECTION];
  
  // Tabla & Paginación
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  selectedKeys: Set<string> = new Set();
  
  // Ordenamiento
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Consola JSON Obsidian
  showJsonView: boolean = false;
  activeConsoleTab: 'listarPaginado' | 'registrar' | 'masterData' = 'listarPaginado';
  isConsoleCollapsed: boolean = false;
  collapsedItemsState: { [key: number]: boolean } = {};
  collapsedSubObjectsState: { [key: number]: boolean } = {};

  // Modales
  isModalOpen: boolean = false;
  isEditing: boolean = false;
  activeModalTab: 'regimen' | 'nominas' = 'regimen';
  
  // Modal de Eliminación
  isDeleteModalOpen: boolean = false;
  keyToDelete: string | null = null;

  // Campos de Formulario
  formAlias: string = '';
  selectedRegimenId: number | null = null;
  selectedPlameId: number | null = null;
  selectedTipoTrabajadorId: number | null = null;
  formActivo: boolean = true;
  formTipoNominas: string = '';
  formSubNominas: NominaSubDetalle[] = [];
  editingSerialKey: string | null = null;

  // Toast flotante
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

  // Filtrado de Master Data por Tipo
  getMasterItems(tipo: string): MasterDataItem[] {
    return this.masterData.filter(item => item.Tipo === tipo);
  }

  // Helper para buscar un ítem en el master data
  getMasterItemById(id: number | null): MasterDataItem | null {
    if (id === null) return null;
    return this.masterData.find(item => item.Id === id) || null;
  }

  // Manejo de ordenamiento de columnas
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

  parseJsonDate(jsonDateStr: string | undefined): string {
    if (!jsonDateStr) return '';
    const match = jsonDateStr.match(/\/Date\((\d+)\)\//);
    if (match) {
      const date = new Date(parseInt(match[1]));
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${day}/${month}/${year}`;
    }
    return '';
  }

  // Filtro por término de búsqueda
  get filteredNominas(): NominasRegimen[] {
    let result = this.nominas;
    
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(n => 
        n.ALIAS.toLowerCase().includes(term) ||
        (n.REGIMENLABORAL && n.REGIMENLABORAL.DESCRIPCION.toLowerCase().includes(term)) ||
        (n.PLAME && n.PLAME.DESCRIPCION.toLowerCase().includes(term)) ||
        (n.TIPOTRABAJADOR && n.TIPOTRABAJADOR.DESCRIPCION.toLowerCase().includes(term)) ||
        n.FLG_ESTADO_DESC.toLowerCase().includes(term)
      );
    }
    
    return result;
  }

  // Ordenamiento de tabla
  get sortedNominas(): NominasRegimen[] {
    const result = [...this.filteredNominas];
    if (!this.sortField) return result;
    
    return result.sort((a, b) => {
      let aVal = this.getNestedValue(a, this.sortField);
      let bVal = this.getNestedValue(b, this.sortField);
      
      if (this.sortField === 'FECHA_REG') {
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

  // Paginación
  get paginatedNominas(): NominasRegimen[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.sortedNominas.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.sortedNominas.length / this.pageSize);
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Multi-Selección
  isAllSelected(): boolean {
    const paginated = this.paginatedNominas;
    if (paginated.length === 0) return false;
    return paginated.every(item => this.selectedKeys.has(item.SerialKey));
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const paginated = this.paginatedNominas;
    if (checked) {
      paginated.forEach(item => this.selectedKeys.add(item.SerialKey));
    } else {
      paginated.forEach(item => this.selectedKeys.delete(item.SerialKey));
    }
  }

  toggleSelectItem(key: string): void {
    if (this.selectedKeys.has(key)) {
      this.selectedKeys.delete(key);
    } else {
      this.selectedKeys.add(key);
    }
  }

  isSelected(key: string): boolean {
    return this.selectedKeys.has(key);
  }

  // Abrir Modal de Registro (Agregar)
  openAddModal(): void {
    this.isEditing = false;
    this.activeModalTab = 'regimen';
    this.editingSerialKey = null;
    
    // Inicializar vacíos
    this.formAlias = '';
    this.selectedRegimenId = null;
    this.selectedPlameId = null;
    this.selectedTipoTrabajadorId = null;
    this.formActivo = true;
    this.formTipoNominas = '';
    
    // Generar sub-nominas por defecto vacías
    this.formSubNominas = [
      { id: 1, descripcion: 'Planilla Regular de Contrato', checked: true, activo: true },
      { id: 2, descripcion: 'Planilla de Liquidación Beneficios', checked: true, activo: false },
      { id: 3, descripcion: 'Planilla de Aumentos Retroactivos', checked: false, activo: false }
    ];
    
    this.isModalOpen = true;
  }

  // Abrir Modal de Modificación (Editar)
  openEditModal(item: NominasRegimen): void {
    this.isEditing = true;
    this.activeModalTab = 'regimen';
    this.editingSerialKey = item.SerialKey;
    
    this.formAlias = item.ALIAS;
    this.formActivo = item.FLG_ESTADO;
    
    // Buscar los correspondientes IDs en la lista master data
    const regItem = this.masterData.find(m => m.Tipo === 'Regimen Laboral' && m.Descripcion === item.REGIMENLABORAL.DESCRIPCION);
    this.selectedRegimenId = regItem ? regItem.Id : null;

    const plameItem = this.masterData.find(m => m.Tipo === 'Categoria Plame' && m.Descripcion === item.PLAME.DESCRIPCION);
    this.selectedPlameId = plameItem ? plameItem.Id : null;

    const empItem = this.masterData.find(m => m.Tipo === 'Tipo Trabajador' && m.Descripcion === item.TIPOTRABAJADOR.DESCRIPCION);
    this.selectedTipoTrabajadorId = empItem ? empItem.Id : null;
    
    this.formTipoNominas = '';
    
    // Copiar sub-nominas
    this.formSubNominas = item.subNominas ? item.subNominas.map(sub => ({ ...sub })) : [];
    
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  // Guardar datos
  save(): void {
    if (!this.formAlias.trim()) {
      this.showToast('Por favor, ingrese un Alias para el régimen.', 'error');
      return;
    }
    if (!this.selectedRegimenId) {
      this.showToast('Por favor, seleccione un Régimen Laboral.', 'error');
      return;
    }
    if (!this.selectedPlameId) {
      this.showToast('Por favor, seleccione una Categoría PLAME.', 'error');
      return;
    }
    if (!this.selectedTipoTrabajadorId) {
      this.showToast('Por favor, seleccione un Tipo de Empleado.', 'error');
      return;
    }

    const regObj = this.getMasterItemById(this.selectedRegimenId);
    const plameObj = this.getMasterItemById(this.selectedPlameId);
    const empObj = this.getMasterItemById(this.selectedTipoTrabajadorId);

    if (this.isEditing && this.editingSerialKey) {
      this.nominas = this.nominas.map(item => {
        if (item.SerialKey === this.editingSerialKey) {
          return {
            ...item,
            ALIAS: this.formAlias,
            FLG_ESTADO: this.formActivo,
            FLG_ESTADO_DESC: this.formActivo ? 'Activo' : 'Inactivo',
            REGIMENLABORAL: {
              CONTRACTUALES_ID: 0,
              MAESTRA_ID: 0,
              CODIGO: regObj?.Codigo || '',
              DESCRIPCION: regObj?.Descripcion || ''
            },
            PLAME: {
              CONTRACTUALES_ID: 0,
              MAESTRA_ID: 0,
              CODIGO: plameObj?.Codigo || '',
              DESCRIPCION: plameObj?.Descripcion || ''
            },
            TIPOTRABAJADOR: {
              CONTRACTUALES_ID: 0,
              MAESTRA_ID: 0,
              CODIGO: empObj?.Codigo || null,
              DESCRIPCION: empObj?.Descripcion || ''
            },
            subNominas: this.formSubNominas.map(sub => ({ ...sub })),
            USUARIO_ACT: 'admin_user',
            FECHA_ACT: `/Date(${Date.now()})/`
          };
        }
        return item;
      });
      this.showToast(`El régimen '${this.formAlias}' ha sido modificado con éxito.`, 'success');
    } else {
      const randomKey = Math.random().toString(36).substring(2, 8) + '_' + Math.random().toString(36).substring(2, 8) + '_..';
      const serialKey = Math.random().toString(36).substring(2, 8) + '-' + Math.random().toString(36).substring(2, 8) + '..';

      const newItem: NominasRegimen = {
        TIPOSPLANILLA_ID: 0,
        REGIMENLABORAL_ID: null,
        PLAME_ID: null,
        ALIAS: this.formAlias,
        FLG_TRABAJADOR: 0,
        FLG_ESTADO: this.formActivo,
        FLG_ESTADO_DESC: this.formActivo ? 'Activo' : 'Inactivo',
        NUM_ORDEN: null,
        REGIMENLABORALKey: 'key_reg_' + Date.now() + '..',
        PLAMEKey: 'key_plame_' + Date.now() + '..',
        TIPOSPLANILLADETALLEKey: null,
        REGIMENLABORAL: {
          CONTRACTUALES_ID: 0,
          MAESTRA_ID: 0,
          CODIGO: regObj?.Codigo || '',
          DESCRIPCION: regObj?.Descripcion || ''
        },
        PLAME: {
          CONTRACTUALES_ID: 0,
          MAESTRA_ID: 0,
          CODIGO: plameObj?.Codigo || '',
          DESCRIPCION: plameObj?.Descripcion || ''
        },
        TIPOTRABAJADOR: {
          CONTRACTUALES_ID: 0,
          MAESTRA_ID: 0,
          CODIGO: empObj?.Codigo || null,
          DESCRIPCION: empObj?.Descripcion || ''
        },
        TIPOSPLANILLADETALLE: null,
        ListaRegimenLaborales: null,
        ListaPlames: null,
        ListaTipoTrabajador: null,
        ListaEstadoTiposPlanilla: null,
        ListaTiposPlanillaDetalle: null,
        SerialKey: serialKey,
        ESTADO: 'A',
        USUARIO_REG: 'sujeyp',
        FECHA_REG: `/Date(${Date.now()})/`,
        USUARIO_ACT: 'sujeyp',
        FECHA_ACT: `/Date(${Date.now()})/`,
        FILTRO: null,
        FLG_MASIVO: false,
        FLG_MEMORIA: false,
        FLG_MODIFICADO: false,
        PageSize: 0,
        PageNumber: 0,
        TotalPage: 3,
        subNominas: this.formSubNominas.map(sub => ({ ...sub }))
      };

      this.nominas = [newItem, ...this.nominas];
      this.showToast(`El régimen '${this.formAlias}' ha sido registrado con éxito.`, 'success');
    }

    this.closeModal();
  }

  // Eliminar
  confirmDelete(key: string): void {
    this.keyToDelete = key;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.keyToDelete = null;
  }

  executeDelete(): void {
    if (this.keyToDelete) {
      const target = this.nominas.find(n => n.SerialKey === this.keyToDelete);
      const alias = target ? target.ALIAS : '';
      
      this.nominas = this.nominas.filter(n => n.SerialKey !== this.keyToDelete);
      this.selectedKeys.delete(this.keyToDelete);
      
      if (this.currentPage > this.totalPages && this.currentPage > 1) {
        this.currentPage--;
      }
      
      this.showToast(`El régimen '${alias}' fue eliminado de la base de datos local.`, 'success');
    }
    this.closeDeleteModal();
  }

  // Checklist de sub-nominas
  addSubNominaItem(): void {
    if (!this.formTipoNominas.trim()) return;
    
    // Evitar duplicados
    const normalized = this.formTipoNominas.trim();
    if (this.formSubNominas.some(s => s.descripcion.toLowerCase() === normalized.toLowerCase())) {
      this.showToast('Esta planilla ya se encuentra en el listado.', 'error');
      return;
    }

    const nextId = this.formSubNominas.length > 0 ? Math.max(...this.formSubNominas.map(s => s.id)) + 1 : 1;
    this.formSubNominas.push({
      id: nextId,
      descripcion: normalized,
      checked: true,
      activo: false
    });

    this.formTipoNominas = '';
    this.showToast(`Planilla '${normalized}' agregada al checklist.`, 'success');
  }

  removeSubNominaItem(id: number): void {
    this.formSubNominas = this.formSubNominas.filter(s => s.id !== id);
  }

  // Obsidian Console Collapse controls
  toggleConsoleCollapse(): void {
    this.isConsoleCollapsed = !this.isConsoleCollapsed;
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
    this.isConsoleCollapsed = false;
    this.collapsedItemsState = {};
    this.collapsedSubObjectsState = {};
  }

  collapseAllJson(): void {
    this.isConsoleCollapsed = false;
    this.nominas.forEach((_, i) => {
      this.collapsedItemsState[i] = true;
      this.collapsedSubObjectsState[i] = true;
    });
  }

  // Copiar JSON
  copyJsonToClipboard(): void {
    let rawObj: any;
    if (this.activeConsoleTab === 'listarPaginado') {
      rawObj = {
        lista: this.nominas.map(n => {
          const { subNominas, ...rest } = n;
          return rest;
        }),
        pageSize: this.nominas.length,
        error: false,
        msj: null
      };
    } else if (this.activeConsoleTab === 'registrar') {
      // Simular payload de registro con el primer elemento activo o modificado
      const target: any = this.nominas[0] || {};
      rawObj = {
        TIPOSPLANILLA_ID: target.TIPOSPLANILLA_ID || 0,
        REGIMENLABORAL_ID: target.REGIMENLABORAL_ID || null,
        PLAME_ID: target.PLAME_ID || null,
        ALIAS: target.ALIAS || '',
        FLG_TRABAJADOR: target.FLG_TRABAJADOR || 0,
        FLG_ESTADO: target.FLG_ESTADO || false,
        ESTADO: target.ESTADO || 'A',
        subNominas: target.subNominas || []
      };
    } else {
      rawObj = {
        data: this.masterData
      };
    }

    const jsonStr = JSON.stringify(rawObj, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
      this.showToast('JSON de la consola copiado correctamente.', 'success');
    }).catch(() => {
      this.showToast('No se pudo copiar el JSON al portapapeles.', 'error');
    });
  }
}
