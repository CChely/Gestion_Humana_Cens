import { Component, OnInit } from '@angular/core';
import { 
  ParametricaCampo, 
  CAMPOS_ADICIONALES_MOCK 
} from './campos-adicionales.data';

@Component({
  selector: 'app-campos-adicionales',
  templateUrl: './campos-adicionales.component.html',
  styleUrls: ['./campos-adicionales.component.scss']
})
export class CamposAdicionalesComponent implements OnInit {
  // Master lists
  camposList: ParametricaCampo[] = [];

  // Search & Pagination
  searchQuery: string = '';
  currentPage: number = 1;
  pageSize: number = 10;

  // Sorting
  sortField: string = 'NUM_ORDEN';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Obsidian JSON View Controls
  showJsonView: boolean = false;
  isJsonCollapsed: boolean = false;
  collapsedItemsState: { [key: number]: boolean } = {};

  // Modals Visibility Controls
  isEditOpen: boolean = false;

  // Form Fields
  selectedCampo: ParametricaCampo | null = null;
  formTabla: string = '';
  formColumna: string = '';
  formObligatorio: boolean = false;
  formMantenimiento: boolean = false;
  formCargaMasiva: boolean = false;
  formNumOrden: number = 1;

  // Toast Notification Controls
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | 'info' = 'success';

  ngOnInit(): void {
    // Deep clone data to avoid modifying reference data directly
    this.camposList = JSON.parse(JSON.stringify(CAMPOS_ADICIONALES_MOCK));
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
  getFilteredList(): ParametricaCampo[] {
    let list = [...this.camposList];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(item => 
        (item.CODIGO && item.CODIGO.toLowerCase().includes(q)) ||
        (item.TABLA && item.TABLA.toLowerCase().includes(q)) ||
        (item.COLUMNA && item.COLUMNA.toLowerCase().includes(q))
      );
    }

    // Sort list
    list.sort((a, b) => {
      let valA: any = a[this.sortField as keyof ParametricaCampo];
      let valB: any = b[this.sortField as keyof ParametricaCampo];

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
  getPaginatedList(): ParametricaCampo[] {
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

  // Edit actions
  openEditModal(item: ParametricaCampo): void {
    this.selectedCampo = item;

    // Prefill form
    this.formTabla = item.TABLA || '';
    this.formColumna = item.COLUMNA || '';
    this.formObligatorio = item.FLG_OBLIGATORIO;
    this.formMantenimiento = item.FLG_MANTENIMIENTO;
    this.formCargaMasiva = item.FLG_CARGAMASIVA;
    this.formNumOrden = item.NUM_ORDEN;

    this.isEditOpen = true;
  }

  closeModal(): void {
    this.isEditOpen = false;
    this.selectedCampo = null;
  }

  saveCampo(): void {
    if (!this.formTabla.trim() || !this.formColumna.trim()) {
      this.showToast('Por favor complete todos los campos obligatorios (*)', 'error');
      return;
    }

    if (this.formNumOrden < 0) {
      this.showToast('El número de orden debe ser mayor o igual a 0', 'error');
      return;
    }

    if (this.selectedCampo) {
      // Edit in memory
      this.camposList = this.camposList.map(item => {
        if (item.SerialKey === this.selectedCampo?.SerialKey) {
          return {
            ...item,
            TABLA: this.formTabla.trim(),
            COLUMNA: this.formColumna.trim(),
            FLG_OBLIGATORIO: this.formObligatorio,
            FLG_MANTENIMIENTO: this.formMantenimiento,
            FLG_CARGAMASIVA: this.formCargaMasiva,
            NUM_ORDEN: Number(this.formNumOrden),
            USUARIO_ACT: 'bacuna',
            FECHA_ACT: `/Date(${Date.now()})/`
          };
        }
        return item;
      });

      this.showToast(`Campo adicional "${this.formColumna.trim()}" actualizado con éxito.`, 'success');
      this.closeModal();
    }
  }

  // Obsidian Dark JSON helper functions
  toggleJsonCollapse(): void {
    this.isJsonCollapsed = !this.isJsonCollapsed;
    const paginated = this.getPaginatedList();
    paginated.forEach((_, idx) => {
      this.collapsedItemsState[idx] = this.isJsonCollapsed;
    });
  }

  toggleItemCollapse(idx: number): void {
    this.collapsedItemsState[idx] = !this.collapsedItemsState[idx];
  }

  isItemCollapsed(idx: number): boolean {
    return !!this.collapsedItemsState[idx];
  }

  copyJsonToClipboard(): void {
    const listToCopy = this.getFilteredList();
    const payload = {
      lista: listToCopy.map(item => ({
        PARAMETRICASCAMPO_ID: item.PARAMETRICASCAMPO_ID,
        CODIGO: item.CODIGO,
        TABLA: item.TABLA,
        COLUMNA: item.COLUMNA,
        FLG_OBLIGATORIO: item.FLG_OBLIGATORIO,
        FLG_MANTENIMIENTO: item.FLG_MANTENIMIENTO,
        FLG_CARGAMASIVA: item.FLG_CARGAMASIVA,
        NUM_ORDEN: item.NUM_ORDEN,
        ESTADO: item.ESTADO,
        USUARIO_REG: item.USUARIO_REG,
        FECHA_REG: item.FECHA_REG,
        USUARIO_ACT: item.USUARIO_ACT,
        FECHA_ACT: item.FECHA_ACT,
        SerialKey: item.SerialKey,
        FLG_MASIVO: item.FLG_MASIVO,
        FLG_MEMORIA: item.FLG_MEMORIA,
        FLG_MODIFICADO: item.FLG_MODIFICADO,
        FILTRO: item.FILTRO,
        PageSize: item.PageSize,
        PageNumber: item.PageNumber,
        TotalPage: item.TotalPage
      })),
      pageSize: listToCopy.length,
      error: false,
      mej: null
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
