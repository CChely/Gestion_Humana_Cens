import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../shared/services/data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  @Input() origen: string = '';
  titulo: string = '';

  mainForm: UntypedFormGroup;
  items: any[] = [];
  isEditing: boolean = false;
  currentId: number | null = null;

  searchInputControl = new FormControl('');
  isModalOpen: boolean = false;
  isDeleteModalOpen: boolean = false;
  itemToDelete: any = null;
  itemToTrace: any = null;

  // Variables de Paginación y Ordenamiento
  currentPage: number = 1;
  pageSize: number = 10;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Variables del Modal de Éxito
  isSuccessModalOpen: boolean = false;
  successTitle: string = '';
  successMessage: string = '';

  // Variables del Modal de Error
  isErrorModalOpen: boolean = false;
  errorTitle: string = '';
  errorMessage: string = '';

  constructor(private _route: ActivatedRoute, private _formBuilder: FormBuilder, private _dataService: DataService) {
    this.mainForm = this._formBuilder.group({
      codigo: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Al buscar algo, regresamos automáticamente a la página 1
    this.searchInputControl.valueChanges.subscribe(() => {
      this.currentPage = 1;
    });

    // Suscribirnos a los cambios de parámetros en la URL de Angular
    this._route.paramMap.subscribe(params => {
      const paramOrigen = params.get('origen');
      if (paramOrigen) {
        this.origen = paramOrigen;
        this._setTituloPorOrigen(this.origen);
      } else {
        // En caso de que se entre directamente a /mantenimiento/main sin parámetros
        this.origen = 'main';
        this.titulo = 'Mantenimiento';
      }

      this.itemToTrace = null;
      this.resetForm();
      this.loadData();
    });
  }

  get processedItems() {
    if (!Array.isArray(this.items)) return [];
    const query = this.searchInputControl.value;
    let result = [...this.items];

    // 1. Filtrado (Búsqueda)
    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(item =>
        (item.Codigo || item.codigo || '').toString().toLowerCase().includes(lowerQuery) ||
        (item.Descripcion || item.descripcion || '').toString().toLowerCase().includes(lowerQuery)
      );
    }

    // 2. Ordenamiento
    if (this.sortColumn) {
      result.sort((a, b) => {
        const valA = (a[this.sortColumn] || a[this.sortColumn.toLowerCase()] || '').toString().toLowerCase();
        const valB = (b[this.sortColumn] || b[this.sortColumn.toLowerCase()] || '').toString().toLowerCase();
        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }

  get paginatedItems() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.processedItems.slice(start, start + this.pageSize);
  }

  get totalItems() {
    return this.processedItems.length;
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get startIndex() {
    return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex() {
    const end = this.currentPage * this.pageSize;
    return end > this.totalItems ? this.totalItems : end;
  }

  loadData(): void {
    const payload = {
      data: {
        p_Tipo: this.titulo
      }
    };

    this._dataService.doRequestPost('uspMainDataObtenerPorTipo', payload).subscribe({
      next: (res: any) => {
        this.items = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      },
      error: (err) => {
        console.error('Error al cargar datos:', err);
        this.items = [];
      }
    });
  }

  openModal(item?: any): void {
    this.resetForm();
    if (item) {
      this.edit(item);
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.resetForm();
  }

  openDeleteModal(item: any): void {
    this.itemToDelete = item;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.itemToDelete = null;
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  openTrazabilidad(item: any): void {
    this.itemToTrace = item;
  }

  save(): void {
    if (this.mainForm.invalid) return;

    const formData = this.mainForm.value;

    // --- VALIDACIÓN DE DUPLICADOS ---
    const codigoInput = formData.codigo.toString().trim().toLowerCase();
    const descripcionInput = formData.descripcion.toString().trim().toLowerCase();

    const duplicado = this.items.find(item => {
      const isSameId = this.isEditing && (item.Id || item.id) === this.currentId;
      if (isSameId) return false; // Si estamos editando, ignoramos el registro actual

      const code = (item.Codigo || item.codigo || '').toString().trim().toLowerCase();
      const desc = (item.Descripcion || item.descripcion || '').toString().trim().toLowerCase();

      return code === codigoInput || desc === descripcionInput;
    });

    if (duplicado) {
      const isCodeDuplicate = (duplicado.Codigo || duplicado.codigo || '').toString().trim().toLowerCase() === codigoInput;
      const mensaje = isCodeDuplicate ? `El código "${formData.codigo}" ya se encuentra registrado.` : `La descripción "${formData.descripcion}" ya se encuentra registrada.`;
      this.showErrorModal('Registro Duplicado', mensaje);
      return; // Detenemos el guardado
    }
    // ---------------------------------

    if (this.isEditing && this.currentId) {
      const payload = {
        data: {
          p_Id: this.currentId,
          p_Codigo: formData.codigo,
          p_Descripcion: formData.descripcion,
          p_IdUsuarioActual: 1 // <- Reemplazar por el ID real del AuthService
        }
      };

      this._dataService.doRequestPost('uspMainDataActualizar', payload).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
          this.showSuccessModal('¡Actualizado!', 'El registro se actualizó correctamente.');
        },
        error: (err) => console.error('Error al actualizar:', err)
      });
    } else {
      const payload = {
        data: {
          p_Tipo: this.titulo,
          p_Codigo: formData.codigo,
          p_Descripcion: formData.descripcion,
          p_IdUsuarioActual: 1 // <- Reemplazar por el ID real del AuthService
        }
      };

      this._dataService.doRequestPost('uspMainDataInsertar', payload).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
          this.showSuccessModal('¡Registrado!', 'El nuevo registro se guardó exitosamente.');
        },
        error: (err) => console.error('Error al insertar:', err)
      });
    }
  }

  edit(item: any): void {
    this.isEditing = true;
    this.currentId = item.Id || item.id; // Manejo seguro de mayúsculas/minúsculas
    this.mainForm.patchValue({
      codigo: item.Codigo || item.codigo,
      descripcion: item.Descripcion || item.descripcion
    });
  }

  deleteItem(id: number): void {
    // (Deprecado - Lógica movida a confirmDelete)
  }

  confirmDelete(): void {
    if (!this.itemToDelete) return;
    const id = this.itemToDelete.Id || this.itemToDelete.id;
    const payload = { data: { p_Id: id, p_IdUsuarioActual: 1 } };
    this._dataService.doRequestPost('uspMainDataEliminar', payload).subscribe({
      next: () => {
        this.loadData();
        this.closeDeleteModal();
        this.showSuccessModal('¡Eliminado!', 'El registro ha sido eliminado del sistema.');
      },
      error: (err) => console.error('Error al eliminar:', err)
    });
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentId = null;
    this.mainForm.reset();
  }

  showSuccessModal(title: string, message: string): void {
    this.successTitle = title;
    this.successMessage = message;
    this.isSuccessModalOpen = true;
    setTimeout(() => {
      this.closeSuccessModal();
    }, 2500); // Se cerrará solo después de 2.5 segundos
  }

  closeSuccessModal(): void {
    this.isSuccessModalOpen = false;
  }

  showErrorModal(title: string, message: string): void {
    this.errorTitle = title;
    this.errorMessage = message;
    this.isErrorModalOpen = true;
  }

  closeErrorModal(): void {
    this.isErrorModalOpen = false;
  }

  private _setTituloPorOrigen(origen: string): void {
    // switch (origen) {
    //   case 'puesto-jerarquia': this.titulo = 'Puesto Jerarquía'; break;
    //   case 'area': this.titulo = 'Área'; break;
    //   case 'proyecto': this.titulo = 'Proyecto'; break;
    //   case 'ubigeo': this.titulo = 'Ubigeo'; break;
    //   default: this.titulo = 'Mantenimiento'; break;
    // }

    // Convertir "tipo-trabajador" a "Tipo Trabajador"
    const formatoOrigen = origen
      .split('-')
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
      .join(' ');

    this.titulo = `${formatoOrigen}`;
  }

}
