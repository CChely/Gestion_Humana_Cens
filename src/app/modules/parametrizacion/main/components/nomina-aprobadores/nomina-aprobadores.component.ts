import { Component, OnInit } from '@angular/core';
import { 
  NominaAprobador, 
  TipoDocumento, 
  TIPO_DOCUMENTO_OPTIONS, 
  NOMINA_APROBADORES_MOCK 
} from './nomina-aprobadores.data';

@Component({
  selector: 'app-nomina-aprobadores',
  templateUrl: './nomina-aprobadores.component.html',
  styleUrls: ['./nomina-aprobadores.component.scss']
})
export class NominaAprobadoresComponent implements OnInit {
  // Master lists
  aprobadoresList: NominaAprobador[] = [];
  tipoDocumentoOptions: TipoDocumento[] = [];

  // Search & Pagination
  searchQuery: string = '';
  currentPage: number = 1;
  pageSize: number = 10;

  // Sorting
  sortField: string = 'NOMBRECOMPLETO';
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
  selectedAprobador: NominaAprobador | null = null;
  aprobadorKeyToDelete: string | null = null;

  formTipoDocId: number | null = null;
  formNumDoc: string = '';
  formNombres: string = '';
  formApellidos: string = '';
  formVigente: boolean = true;

  // Toast Notification Controls
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | 'info' = 'success';

  ngOnInit(): void {
    // Deep clone data to avoid modifying reference data directly
    this.aprobadoresList = JSON.parse(JSON.stringify(NOMINA_APROBADORES_MOCK));
    this.tipoDocumentoOptions = [...TIPO_DOCUMENTO_OPTIONS];
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
  getFilteredList(): NominaAprobador[] {
    let list = [...this.aprobadoresList];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(item => 
        (item.NOMBRECOMPLETO && item.NOMBRECOMPLETO.toLowerCase().includes(q)) ||
        (item.NUMDOCUMENTO && item.NUMDOCUMENTO.toLowerCase().includes(q)) ||
        (item.TIPODOCUMENTO && item.TIPODOCUMENTO.ABREVIATURA && item.TIPODOCUMENTO.ABREVIATURA.toLowerCase().includes(q))
      );
    }

    // Sort list
    list.sort((a, b) => {
      let valA: any = a[this.sortField as keyof NominaAprobador];
      let valB: any = b[this.sortField as keyof NominaAprobador];

      // Handle nested TIPODOCUMENTO fields if needed
      if (this.sortField === 'TIPODOCUMENTO') {
        valA = a.TIPODOCUMENTO?.ABREVIATURA || '';
        valB = b.TIPODOCUMENTO?.ABREVIATURA || '';
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
  getPaginatedList(): NominaAprobador[] {
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

  // Add / Edit actions
  openAddModal(): void {
    this.isEditing = false;
    this.selectedAprobador = null;
    
    // Default values
    this.formTipoDocId = null;
    this.formNumDoc = '';
    this.formNombres = '';
    this.formApellidos = '';
    this.formVigente = true;

    this.isAddEditOpen = true;
  }

  openEditModal(item: NominaAprobador): void {
    this.isEditing = true;
    this.selectedAprobador = item;

    // Prefill form
    this.formTipoDocId = item.TIPODOCUMENTO_ID || 1; // Default DNI
    this.formNumDoc = item.NUMDOCUMENTO || '';
    this.formNombres = item.NOMBRES || '';
    this.formApellidos = item.APELLIDOS || '';
    this.formVigente = item.FLG_VIGENTE;

    this.isAddEditOpen = true;
  }

  closeModal(): void {
    this.isAddEditOpen = false;
  }

  saveAprobador(): void {
    if (!this.formNumDoc || !this.formNombres || !this.formApellidos || !this.formTipoDocId) {
      this.showToast('Por favor complete todos los campos obligatorios (**)', 'error');
      return;
    }

    const docOption = this.tipoDocumentoOptions.find(d => d.TIPODOCUMENTO_ID === this.formTipoDocId);
    const abbreviatedDoc = docOption ? docOption.ABREVIATURA : 'DNI';

    const cleanNombres = this.formNombres.trim().toUpperCase();
    const cleanApellidos = this.formApellidos.trim().toUpperCase();
    const fullname = `${cleanNombres} ${cleanApellidos}`;
    
    // Generate avatar letters
    const avatar = (cleanNombres.charAt(0) + cleanApellidos.charAt(0)) || 'NA';

    if (this.isEditing && this.selectedAprobador) {
      // Edit in memory
      this.aprobadoresList = this.aprobadoresList.map(item => {
        if (item.SerialKey === this.selectedAprobador?.SerialKey) {
          return {
            ...item,
            FLG_VIGENTE: this.formVigente,
            NOMBRES: cleanNombres,
            APELLIDOS: cleanApellidos,
            TIPODOCUMENTO_ID: this.formTipoDocId,
            NUMDOCUMENTO: this.formNumDoc.trim(),
            NOMBRECOMPLETO: fullname,
            AVATARTRABAJADOR: avatar,
            TIPODOCUMENTO: {
              ...item.TIPODOCUMENTO,
              ABREVIATURA: abbreviatedDoc
            },
            USUARIO_ACT: 'jmendoza',
            FECHA_ACT: `/Date(${Date.now()})/`
          };
        }
        return item;
      });

      this.showToast(`Aprobador "${fullname}" actualizado con éxito.`, 'success');
    } else {
      // Register/Add new in memory
      const newSerial = `key_${Math.random().toString(36).substr(2, 9)}..`;
      const newAprobador: NominaAprobador = {
        NOMINAAPROBADORES_ID: 0,
        FLG_VIGENTE: this.formVigente,
        NOMBRES: cleanNombres,
        APELLIDOS: cleanApellidos,
        TIPODOCUMENTO_ID: this.formTipoDocId,
        NUMDOCUMENTO: this.formNumDoc.trim(),
        TIPODOCUMENTOKey: 'nZdUDxu1R2DBTZB_AmRsfw..', // default
        TIPODOCUMENTO: {
          TIPODOCUMENTO_ID: 0,
          DESCRIPCION: null,
          ABREVIATURA: abbreviatedDoc,
          DIGITOS: null,
          ES_NUMERICO: null
        },
        NOMBRECOMPLETO: fullname,
        AVATARTRABAJADOR: avatar,
        ESTADO: 'A',
        USUARIO_REG: 'jmendoza',
        FECHA_REG: `/Date(${Date.now()})/`,
        USUARIO_ACT: 'jmendoza',
        FECHA_ACT: `/Date(${Date.now()})/`,
        SerialKey: newSerial
      };

      this.aprobadoresList = [newAprobador, ...this.aprobadoresList];
      this.showToast(`Aprobador "${fullname}" registrado con éxito.`, 'success');
    }

    this.isAddEditOpen = false;
    this.currentPage = 1;
  }

  // Deletion logic
  openDeleteConfirm(item: NominaAprobador): void {
    this.aprobadorKeyToDelete = item.SerialKey;
    this.selectedAprobador = item;
    this.isDeleteConfirmOpen = true;
  }

  closeDeleteConfirm(): void {
    this.isDeleteConfirmOpen = false;
    this.aprobadorKeyToDelete = null;
    this.selectedAprobador = null;
  }

  deleteAprobador(): void {
    if (this.aprobadorKeyToDelete) {
      const name = this.selectedAprobador?.NOMBRECOMPLETO || 'Aprobador';
      this.aprobadoresList = this.aprobadoresList.filter(item => item.SerialKey !== this.aprobadorKeyToDelete);
      this.showToast(`Aprobador "${name}" eliminado con éxito.`, 'success');
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
        NOMINAAPROBADORES_ID: item.NOMINAAPROBADORES_ID,
        FLG_VIGENTE: item.FLG_VIGENTE,
        NOMBRES: null,
        APELLIDOS: null,
        TIPODOCUMENTO_ID: null,
        NUMDOCUMENTO: item.NUMDOCUMENTO,
        TIPODOCUMENTOKey: item.TIPODOCUMENTOKey,
        ListatipoDocumento: null,
        TIPODOCUMENTO: {
          TIPODOCUMENTO_ID: item.TIPODOCUMENTO.TIPODOCUMENTO_ID,
          DESCRIPCION: item.TIPODOCUMENTO.DESCRIPCION,
          ABREVIATURA: item.TIPODOCUMENTO.ABREVIATURA,
          DIGITOS: item.TIPODOCUMENTO.DIGITOS,
          ES_NUMERICO: item.TIPODOCUMENTO.ES_NUMERICO,
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
        NOMBRECOMPLETO: item.NOMBRECOMPLETO,
        AVATARTRABAJADOR: item.AVATARTRABAJADOR,
        NOMINAAPROBADORKey: null,
        NOMINAAPROBADOR_ID: null,
        SerialKey: item.SerialKey,
        ESTADO: item.ESTADO,
        USUARIO_REG: item.USUARIO_REG,
        FECHA_REG: item.FECHA_REG,
        USUARIO_ACT: item.USUARIO_ACT,
        FECHA_ACT: item.FECHA_ACT,
        FILTRO: null,
        FLG_MASIVO: false,
        FLG_MEMORIA: false,
        FLG_MODIFICADO: false,
        PageSize: 0,
        PageNumber: 0,
        TotalPage: 3
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

  // Get background color for avatars based on letters to match screenshots
  getAvatarBgClass(avatar: string): string {
    if (!avatar) return 'bg-teal-100 text-teal-700';
    const firstChar = avatar.charAt(0).toUpperCase();
    if ('A' <= firstChar && firstChar <= 'G') {
      return 'bg-emerald-100 text-emerald-700';
    } else if ('H' <= firstChar && firstChar <= 'N') {
      return 'bg-teal-100 text-teal-700';
    } else if ('O' <= firstChar && firstChar <= 'T') {
      return 'bg-pink-100 text-pink-700';
    } else {
      return 'bg-orange-100 text-orange-700';
    }
  }
}
