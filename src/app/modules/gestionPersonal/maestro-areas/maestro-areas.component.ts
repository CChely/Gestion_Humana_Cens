import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../shared/services/data.service';

interface Empleado {
  Id: number;
  Nombre: string;
  Avatar: string;
}

interface Area {
  Id: number;
  Codigo: string;
  Nombre: string;
  Descripcion: string;
  ResponsableId: number | null;
}

interface Departamento {
  Id: number;
  IdArea: number;
  Codigo: string;
  Nombre: string;
  Descripcion: string;
  ResponsableId: number | null;
}

interface Seccion {
  Id: number;
  IdDepartamento: number;
  Codigo: string;
  Nombre: string;
  Descripcion: string;
  ResponsableId: number | null;
}

@Component({
  selector: 'app-maestro-areas',
  templateUrl: './maestro-areas.component.html',
  styleUrls: ['./maestro-areas.component.scss']
})
export class MaestroAreasComponent implements OnInit {

  empleados: Empleado[] = [];

  areas: Area[] = [];
  departamentos: Departamento[] = [];
  secciones: Seccion[] = [];

  selectedArea: Area | null = null;
  selectedDepartamento: Departamento | null = null;
  selectedSeccion: Seccion | null = null;

  showFormModal = false;
  showDeleteModal = false;
  modalMode: 'crear' | 'editar' = 'crear';
  modalType: 'area' | 'departamento' | 'seccion' = 'area';

  formData: any = { Id: null, Codigo: '', Nombre: '', Descripcion: '', ResponsableId: null };
  itemToDelete: any = null;
  deleteErrorMsg: string = '';

  showSuccessModal = false;
  successMessage = '';

  searchTerm: string = '';

  itemToTrace: any = null;
  tablaToTrace: string = '';

  @ViewChild('trazabilidadComp') trazabilidadComp: any;

  constructor(private _dataService: DataService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    // Cargar Personal (Responsables)
    this._dataService.doRequestPost('uspPersonalObtenerTodo', { data: {} }).subscribe((res: any) => {
      this.empleados = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
    });
    // Cargar Áreas
    this._dataService.doRequestPost('uspAreaObtenerTodo', { data: {} }).subscribe((res: any) => {
      this.areas = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      if (this.selectedArea) this.selectedArea = this.areas.find(a => a.Id === this.selectedArea!.Id) || null;
    });
    // Cargar Departamentos
    this._dataService.doRequestPost('uspDepartamentoObtenerTodo', { data: {} }).subscribe((res: any) => {
      this.departamentos = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      if (this.selectedDepartamento) this.selectedDepartamento = this.departamentos.find(d => d.Id === this.selectedDepartamento!.Id) || null;
    });
    // Cargar Secciones
    this._dataService.doRequestPost('uspSeccionObtenerTodo', { data: {} }).subscribe((res: any) => {
      this.secciones = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
    });
  }

  get totalAreas(): number { return this.areas.length; }
  get totalDepartamentos(): number { return this.departamentos.length; }
  get totalSecciones(): number { return this.secciones.length; }

  get areasFiltradas(): Area[] {
    if (!this.searchTerm) return this.areas;
    const term = this.searchTerm.toLowerCase();
    return this.areas.filter(a =>
      a.Nombre.toLowerCase().includes(term) ||
      a.Codigo.toLowerCase().includes(term) ||
      (this.getResponsable(a.ResponsableId)?.Nombre?.toLowerCase() || '').includes(term)
    );
  }

  get departamentosVisibles(): Departamento[] {
    if (!this.selectedArea) return [];
    let result = this.departamentos.filter(d => d.IdArea === this.selectedArea!.Id);
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(d =>
        d.Nombre.toLowerCase().includes(term) ||
        d.Codigo.toLowerCase().includes(term) ||
        (this.getResponsable(d.ResponsableId)?.Nombre?.toLowerCase() || '').includes(term)
      );
    }
    return result;
  }

  get seccionesVisibles(): Seccion[] {
    if (!this.selectedDepartamento) return [];
    let result = this.secciones.filter(s => s.IdDepartamento === this.selectedDepartamento!.Id);
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(s =>
        s.Nombre.toLowerCase().includes(term) ||
        s.Codigo.toLowerCase().includes(term) ||
        (this.getResponsable(s.ResponsableId)?.Nombre?.toLowerCase() || '').includes(term)
      );
    }
    return result;
  }

  abrirModalForm(mode: 'crear' | 'editar', type: 'area' | 'departamento' | 'seccion', item?: any) {
    this.modalMode = mode;
    this.modalType = type;

    if (mode === 'editar' && item) {
      this.formData = { ...item };
    } else {
      this.formData = { Id: null, Codigo: '', Nombre: '', Descripcion: '', ResponsableId: null };
    }
    this.showFormModal = true;
  }

  guardarForm() {
    if (!this.formData.Codigo || !this.formData.Nombre || !this.formData.Descripcion) return;

    const payloadData: any = {
      p_Codigo: this.formData.Codigo,
      p_Nombre: this.formData.Nombre,
      p_Descripcion: this.formData.Descripcion,
      p_ResponsableId: this.formData.ResponsableId || null,
      p_IdUsuarioActual: 1 // Reemplazar con Auth Service real
    };

    if (this.modalMode === 'editar') {
      payloadData.p_Id = this.formData.Id;
    }

    let endpoint = '';
    if (this.modalType === 'area') {
      endpoint = this.modalMode === 'crear' ? 'uspAreaInsertar' : 'uspAreaActualizar';
    } else if (this.modalType === 'departamento') {
      endpoint = this.modalMode === 'crear' ? 'uspDepartamentoInsertar' : 'uspDepartamentoActualizar';
      payloadData.p_IdArea = this.selectedArea!.Id;
    } else if (this.modalType === 'seccion') {
      endpoint = this.modalMode === 'crear' ? 'uspSeccionInsertar' : 'uspSeccionActualizar';
      payloadData.p_IdDepartamento = this.selectedDepartamento!.Id;
    }

    const payload = { data: payloadData };

    this._dataService.doRequestPost(endpoint, payload).subscribe({
      next: () => {
        this.cargarDatos();
        this.cerrarModalForm();
        this.mostrarMensajeExito(`Registro ${this.modalMode === 'crear' ? 'creado' : 'actualizado'} con éxito`);

        // Refrescar trazabilidad si se editó el registro actualmente seleccionado
        if (this.modalMode === 'editar' && this.itemToTrace?.Id === this.formData.Id) {
          if (this.trazabilidadComp) this.trazabilidadComp.cargarHistorial();
        }
      },
      error: (err) => console.error('Error al guardar:', err)
    });
  }

  confirmarEliminar() {
    let endpoint = '';

    if (this.modalType === 'area') {
      const tieneDepartamentos = this.departamentos.some(d => d.IdArea === this.itemToDelete.Id);
      if (tieneDepartamentos) {
        this.deleteErrorMsg = 'No puedes eliminar un Área que tiene departamentos asignados.';
        return;
      }
      endpoint = 'uspAreaEliminar';
    } else if (this.modalType === 'departamento') {
      const tieneSecciones = this.secciones.some(s => s.IdDepartamento === this.itemToDelete.Id);
      if (tieneSecciones) {
        this.deleteErrorMsg = 'No puedes eliminar un Departamento que tiene secciones asignadas.';
        return;
      }
      endpoint = 'uspDepartamentoEliminar';
    } else if (this.modalType === 'seccion') {
      endpoint = 'uspSeccionEliminar';
    }

    const payload = { data: { p_Id: this.itemToDelete.Id, p_IdUsuarioActual: 1 } };
    this._dataService.doRequestPost(endpoint, payload).subscribe({
      next: () => {
        this.cargarDatos();
        if (this.modalType === 'area' && this.selectedArea?.Id === this.itemToDelete.Id) this.selectedArea = null;
        if (this.modalType === 'departamento' && this.selectedDepartamento?.Id === this.itemToDelete.Id) this.selectedDepartamento = null;
        if (this.modalType === 'seccion' && this.selectedSeccion?.Id === this.itemToDelete.Id) this.selectedSeccion = null;
        if (this.itemToTrace?.Id === this.itemToDelete.Id) {
          this.itemToTrace = null;
          this.tablaToTrace = '';
        }
        this.cerrarModalEliminar();
        this.mostrarMensajeExito('Registro eliminado con éxito');
      },
      error: (err) => console.error('Error al eliminar:', err)
    });
  }

  mostrarMensajeExito(mensaje: string) {
    this.successMessage = mensaje;
    this.showSuccessModal = true;
    setTimeout(() => {
      this.showSuccessModal = false;
    }, 2000);
  }

  seleccionarArea(area: Area) {
    this.selectedArea = area;
    this.selectedDepartamento = null;
    this.selectedSeccion = null;
    this.itemToTrace = area;
    this.tablaToTrace = 'Area';
  }

  seleccionarDepartamento(depto: Departamento) {
    this.selectedDepartamento = depto;
    this.selectedSeccion = null;
    this.itemToTrace = depto;
    this.tablaToTrace = 'Departamento';
  }

  seleccionarSeccion(seccion: Seccion) {
    this.selectedSeccion = seccion;
    this.itemToTrace = seccion;
    this.tablaToTrace = 'Seccion';
  }

  abrirModalEliminar(type: 'area' | 'departamento' | 'seccion', item: any) {
    this.modalType = type;
    this.itemToDelete = item;
    this.deleteErrorMsg = '';
    this.showDeleteModal = true;
  }

  cerrarModalForm() {
    this.showFormModal = false;
  }

  cerrarModalEliminar() {
    this.showDeleteModal = false;
    this.itemToDelete = null;
    this.deleteErrorMsg = '';
  }

  getResponsable(id: number | null): Empleado | undefined {
    if (!id) return undefined;
    return this.empleados.find(e => e.Id === id);
  }
}
