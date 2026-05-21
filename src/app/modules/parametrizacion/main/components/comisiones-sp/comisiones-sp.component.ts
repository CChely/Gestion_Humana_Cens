import { Component, OnInit } from '@angular/core';
import { COMISIONES_SP_DATA, TasasTarifasAfp, RegimenPensionario } from './comisiones-sp.data';
import { DataService } from '../../../../../shared/services/data.service';

@Component({
  selector: 'app-comisiones-sp',
  templateUrl: './comisiones-sp.component.html',
  styleUrls: ['./comisiones-sp.component.scss']
})
export class ComisionesSpComponent implements OnInit {
  comisionesList: TasasTarifasAfp[] = [...COMISIONES_SP_DATA];
  comisionesSearchTerm: string = '';
  comisionesCurrentPage: number = 1;
  comisionesPageSize: number = 10;
  selectedComisionesKeys: Set<string> = new Set();
  
  // Regímenes de Pensiones Disponibles para el desplegable (cargados dinámicamente desde el mantenedor)
  regimenPensionarioOptions: any[] = [];


  constructor(private _dataService: DataService) {}

  ngOnInit(): void {
    this.cargarRegimenesPensionarios();
  }

  cargarRegimenesPensionarios(): void {
    const payload = {
      data: {
        p_Tipo: 'Regimen Pensionario'
      }
    };
    this._dataService.doRequestPost('uspMainDataObtenerPorTipo', payload).subscribe({
      next: (res: any) => {
        const data = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        if (data && data.length > 0) {
          const pensionRegimenes = data.map((item: any) => ({
            CODIGO: item.Codigo || item.codigo,
            DESCRIPCION: item.Descripcion || item.descripcion
          }));
          if (pensionRegimenes.length > 0) {
            this.regimenPensionarioOptions = pensionRegimenes;
          }
        }
      },
      error: (err: any) => {
        console.error('Error al cargar regímenes pensionarios del endpoint:', err);
      }
    });
  }

  // Control de vista JSON para Comisiones SP
  showComisionesJsonView: boolean = false;
  isComisionesCollapsed: boolean = false;
  collapsedComisionesItemsState: { [key: number]: boolean } = {};
  collapsedComisionesSubObjectsState: { [key: number]: boolean } = {};

  // Modales
  isComisionesModalOpen: boolean = false;
  isEditingComision: boolean = false;
  isDeleteComisionModalOpen: boolean = false;
  comisionKeyToDelete: string | null = null;

  // Variables del formulario
  comisionPeriodoDesdeStr: string = '';
  comisionPeriodoHastaStr: string = '';
  selectedRegimenCodigo: string = '02';
  currentComisionForm: Partial<TasasTarifasAfp> = {
    CSOBREFLUJO: 0,
    CMIXSOBREFLUJO: 0,
    CMIXANUALSOBRESALDO: 0,
    PRIMASEGUROS: 0,
    APORTEOBLIGATORIO: 0,
    REMUNERACIONMAXIMA: 0,
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

  comisionesSortField: string = '';
  comisionesSortDirection: 'asc' | 'desc' = 'asc';

  setComisionesSort(field: string): void {
    if (this.comisionesSortField === field) {
      this.comisionesSortDirection = this.comisionesSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.comisionesSortField = field;
      this.comisionesSortDirection = 'asc';
    }
  }

  getNestedValue(obj: any, path: string): any {
    if (!obj) return null;
    return path.split('.').reduce((o, p) => (o ? o[p] : null), obj);
  }

  toggleComisionesCollapse(): void {
    this.isComisionesCollapsed = !this.isComisionesCollapsed;
  }

  toggleComisionesItemCollapse(index: number): void {
    this.collapsedComisionesItemsState[index] = !this.collapsedComisionesItemsState[index];
  }

  isComisionesItemCollapsed(index: number): boolean {
    return !!this.collapsedComisionesItemsState[index];
  }

  toggleComisionesSubObjectCollapse(index: number): void {
    this.collapsedComisionesSubObjectsState[index] = !this.collapsedComisionesSubObjectsState[index];
  }

  isComisionesSubObjectCollapsed(index: number): boolean {
    return !!this.collapsedComisionesSubObjectsState[index];
  }

  expandAllComisionesJson(): void {
    this.isComisionesCollapsed = false;
    this.collapsedComisionesItemsState = {};
    this.collapsedComisionesSubObjectsState = {};
  }

  collapseAllComisionesJson(): void {
    this.isComisionesCollapsed = false;
    this.comisionesList.forEach((_, i) => {
      this.collapsedComisionesItemsState[i] = true;
      this.collapsedComisionesSubObjectsState[i] = true;
    });
  }

  copyComisionesJsonToClipboard(): void {
    const wrapped = {
      lista: this.comisionesList,
      pageSize: this.comisionesList.length,
      error: false,
      msj: null
    };
    const jsonStr = JSON.stringify(wrapped, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
      this.showToast('JSON de Comisiones copiado al portapapeles.', 'success');
    }).catch(err => {
      this.showToast('No se pudo copiar el JSON.', 'error');
    });
  }

  get filteredComisiones(): TasasTarifasAfp[] {
    let result = this.comisionesList;
    
    if (this.comisionesSearchTerm.trim()) {
      const term = this.comisionesSearchTerm.toLowerCase().trim();
      result = result.filter(c => 
        c.PERIODODEVENGUE.toLowerCase().includes(term) ||
        (c.REGIMENPENSIONARIO && c.REGIMENPENSIONARIO.DESCRIPCION.toLowerCase().includes(term)) ||
        c.CSOBREFLUJO.toString().includes(term) ||
        c.CMIXSOBREFLUJO.toString().includes(term) ||
        c.CMIXANUALSOBRESALDO.toString().includes(term) ||
        c.PRIMASEGUROS.toString().includes(term) ||
        c.APORTEOBLIGATORIO.toString().includes(term)
      );
    }
    
    return result;
  }

  get sortedComisiones(): TasasTarifasAfp[] {
    const result = [...this.filteredComisiones];
    if (!this.comisionesSortField) return result;

    return result.sort((a, b) => {
      let aVal = this.getNestedValue(a, this.comisionesSortField);
      let bVal = this.getNestedValue(b, this.comisionesSortField);

      if (this.comisionesSortField === 'PERIODODEVENGUE') {
        const parsePeriod = (val: string) => {
          if (!val) return 0;
          const parts = val.split('/');
          if (parts.length === 2) {
            return parseInt(parts[1] + parts[0], 10);
          }
          return 0;
        };
        aVal = parsePeriod(aVal);
        bVal = parsePeriod(bVal);
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return this.comisionesSortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else {
        aVal = aVal === null || aVal === undefined ? 0 : aVal;
        bVal = bVal === null || bVal === undefined ? 0 : bVal;
        return this.comisionesSortDirection === 'asc'
          ? (aVal > bVal ? 1 : -1)
          : (bVal > aVal ? 1 : -1);
      }
    });
  }
  
  get paginatedComisiones(): TasasTarifasAfp[] {
    const startIndex = (this.comisionesCurrentPage - 1) * this.comisionesPageSize;
    return this.sortedComisiones.slice(startIndex, startIndex + this.comisionesPageSize);
  }
  
  get comisionesTotalPages(): number {
    return Math.ceil(this.filteredComisiones.length / this.comisionesPageSize);
  }
  
  get comisionesTotalPagesArray(): number[] {
    return Array.from({ length: this.comisionesTotalPages }, (_, i) => i + 1);
  }
  
  changeComisionesPage(page: number): void {
    if (page >= 1 && page <= this.comisionesTotalPages) {
      this.comisionesCurrentPage = page;
    }
  }

  isAllComisionesSelected(): boolean {
    const paginated = this.paginatedComisiones;
    if (paginated.length === 0) return false;
    return paginated.every(c => this.selectedComisionesKeys.has(c.SerialKey));
  }
  
  toggleSelectAllComisiones(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const paginated = this.paginatedComisiones;
    if (checked) {
      paginated.forEach(c => this.selectedComisionesKeys.add(c.SerialKey));
    } else {
      paginated.forEach(c => this.selectedComisionesKeys.delete(c.SerialKey));
    }
  }
  
  toggleSelectComision(key: string): void {
    if (this.selectedComisionesKeys.has(key)) {
      this.selectedComisionesKeys.delete(key);
    } else {
      this.selectedComisionesKeys.add(key);
    }
  }
  
  isComisionSelected(key: string): boolean {
    return this.selectedComisionesKeys.has(key);
  }

  openAddComisionModal(): void {
    this.isEditingComision = false;
    this.currentComisionForm = {
      TASASTARIFASAFP_ID: 0,
      PERIODODEVENGUE: '',
      CSOBREFLUJO: 0,
      CMIXSOBREFLUJO: 0,
      CMIXANUALSOBRESALDO: 0,
      PRIMASEGUROS: 0,
      APORTEOBLIGATORIO: 0,
      REMUNERACIONMAXIMA: 0,
      ESTADO: 'A'
    };
    this.selectedRegimenCodigo = '02'; // default ONP
    this.comisionPeriodoDesdeStr = '';
    this.comisionPeriodoHastaStr = '';
    this.isComisionesModalOpen = true;
  }
  
  openEditComisionModal(comision: TasasTarifasAfp): void {
    this.isEditingComision = true;
    this.currentComisionForm = {
      ...comision,
      REGIMENPENSIONARIO: comision.REGIMENPENSIONARIO ? { ...comision.REGIMENPENSIONARIO } : undefined,
      PERIODO: comision.PERIODO ? { ...comision.PERIODO } : undefined
    };
    this.selectedRegimenCodigo = comision.REGIMENPENSIONARIO?.CODIGO || '02';
    this.comisionPeriodoDesdeStr = this.parseJsonDate(comision.PERIODO?.PERIODO_DESDE);
    this.comisionPeriodoHastaStr = this.parseJsonDate(comision.PERIODO?.PERIODO_HASTA);
    this.isComisionesModalOpen = true;
  }
  
  closeComisionModal(): void {
    this.isComisionesModalOpen = false;
  }
  
  saveComision(): void {
    if (!this.comisionPeriodoDesdeStr || !this.comisionPeriodoHastaStr) {
      this.showToast('Por favor ingrese las fechas del periodo (Desde y Hasta).', 'error');
      return;
    }
    
    // Derive PERIODODESC / PERIODODEVENGUE from comisionPeriodoDesdeStr
    const parts = this.comisionPeriodoDesdeStr.split('-');
    const desc = parts.length >= 2 ? `${parts[1]}/${parts[0]}` : '';
    
    const selectedRegimen = this.regimenPensionarioOptions.find(r => r.CODIGO === this.selectedRegimenCodigo);
    const regimenDesc = selectedRegimen ? selectedRegimen.DESCRIPCION : 'AFP';

    const fechaDesdeJson = `/Date(${new Date(this.comisionPeriodoDesdeStr + 'T00:00:00').getTime()})/`;
    const fechaHastaJson = `/Date(${new Date(this.comisionPeriodoHastaStr + 'T00:00:00').getTime()})/`;

    const regPensionario: RegimenPensionario = {
      REMUNERATIVOS_ID: this.currentComisionForm.REGIMENPENSIONARIO?.REMUNERATIVOS_ID || 0,
      MAESTRA_ID: this.currentComisionForm.REGIMENPENSIONARIO?.MAESTRA_ID || 0,
      CODIGO: this.selectedRegimenCodigo,
      DESCRIPCION: regimenDesc,
      FLG_ACTIVO: this.selectedRegimenCodigo !== '02', // Active if AFP
      FLG_MASIVO: false,
      FLG_MEMORIA: false,
      FLG_MODIFICADO: false,
      PageSize: 0,
      PageNumber: 0,
      TotalPage: 0
    };

    const periodoObj = {
      PERIODO_ID: this.currentComisionForm.PERIODO?.PERIODO_ID || 0,
      DESCRIPCION: desc,
      PERIODO_DESDE: fechaDesdeJson,
      PERIODO_HASTA: fechaHastaJson,
      FLG_MASIVO: false,
      FLG_MEMORIA: false,
      FLG_MODIFICADO: false,
      PageSize: 0,
      PageNumber: 0,
      TotalPage: 0
    };

    if (this.isEditingComision) {
      const updatedComision: TasasTarifasAfp = {
        ...this.currentComisionForm,
        PERIODODEVENGUE: desc,
        PERIODOKey: this.currentComisionForm.PERIODOKey || 'key_' + Math.random().toString(36).substring(2, 6),
        REGIMENPENSIONARIO: regPensionario,
        PERIODO: periodoObj,
      } as TasasTarifasAfp;

      this.comisionesList = this.comisionesList.map(c => 
        c.SerialKey === this.currentComisionForm.SerialKey ? updatedComision : c
      );
      this.showToast(`Las tasas de pensiones para ${regimenDesc} (${desc}) se actualizaron correctamente.`, 'success');
    } else {
      const randomKey = Math.random().toString(36).substring(2, 8) + '_' + Math.random().toString(36).substring(2, 8) + '_..';
      const serialKey = Math.random().toString(36).substring(2, 8) + '-' + Math.random().toString(36).substring(2, 8) + '..';

      const newComision: TasasTarifasAfp = {
        TASASTARIFASAFP_ID: 0,
        TASASTARIFASAFPS_ID: null,
        AFP_ID: null,
        AFPS_ID: null,
        PERIODO_ID: null,
        PERIODODEVENGUE: desc,
        COMISIONFIJA: null,
        CSOBREFLUJO: this.currentComisionForm.CSOBREFLUJO || 0,
        CMIXSOBREFLUJO: this.currentComisionForm.CMIXSOBREFLUJO || 0,
        CMIXANUALSOBRESALDO: this.currentComisionForm.CMIXANUALSOBRESALDO || 0,
        PRIMASEGUROS: this.currentComisionForm.PRIMASEGUROS || 0,
        APORTEOBLIGATORIO: this.currentComisionForm.APORTEOBLIGATORIO || 0,
        REMUNERACIONMAXIMA: this.currentComisionForm.REMUNERACIONMAXIMA || 0,
        AFPKey: 'key_' + this.selectedRegimenCodigo,
        AFPSKey: null,
        PERIODOKey: randomKey,
        TASASTARIFASAFPKey: null,
        PERIODORECIENTE: false,
        REGIMENPENSIONARIO: regPensionario,
        PERIODO: periodoObj,
        ListaRegimenPensionario: null,
        ListaPeriodos: null,
        SerialKey: serialKey,
        ESTADO: this.currentComisionForm.ESTADO || 'A',
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
        TotalPage: 1
      };

      this.comisionesList = [newComision, ...this.comisionesList];
      this.showToast(`Las tasas de pensiones para ${newComision.REGIMENPENSIONARIO.DESCRIPCION} (${desc}) se crearon correctamente.`, 'success');
    }
    
    this.closeComisionModal();
  }
  
  confirmDeleteComision(key: string): void {
    this.comisionKeyToDelete = key;
    this.isDeleteComisionModalOpen = true;
  }

  closeDeleteComisionModal(): void {
    this.isDeleteComisionModalOpen = false;
    this.comisionKeyToDelete = null;
  }

  executeDeleteComision(): void {
    if (this.comisionKeyToDelete) {
      const target = this.comisionesList.find(c => c.SerialKey === this.comisionKeyToDelete);
      const desc = target ? `${target.REGIMENPENSIONARIO?.DESCRIPCION} (${target.PERIODODEVENGUE})` : '';
      
      this.comisionesList = this.comisionesList.filter(c => c.SerialKey !== this.comisionKeyToDelete);
      this.selectedComisionesKeys.delete(this.comisionKeyToDelete);
      
      if (this.comisionesCurrentPage > this.comisionesTotalPages && this.comisionesCurrentPage > 1) {
        this.comisionesCurrentPage--;
      }
      
      this.showToast(`El registro ${desc} ha sido eliminado correctamente.`, 'success');
    }
    this.closeDeleteComisionModal();
  }
}
