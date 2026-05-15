import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../shared/services/data.service';

interface Empleado { Id: number; Nombre: string; Avatar: string; }
interface NivelOrganizacional { Id: number; Nivel: number; Nombre: string; }
interface NodoOrganizacional {
  Id: number; IdNivelOrganizacional: number; IdPadre: number | null;
  Codigo: string; Nombre: string; Descripcion: string;
  ResponsableId: number | null; ResponsableNombre?: string; ResponsableAvatar?: string;
}

@Component({
  selector: 'app-maestro-areas',
  templateUrl: './maestro-areas.component.html',
  styleUrls: ['./maestro-areas.component.scss']
})
export class MaestroAreasComponent implements OnInit {
  empleados: Empleado[] = [];
  niveles: NivelOrganizacional[] = [];
  nodos: NodoOrganizacional[] = [];

  selecciones: { [key: number]: NodoOrganizacional | null } = {};

  showFormModal = false;
  showDeleteModal = false;
  showNivelModal = false;
  showDeleteNivelModal = false; // <-- Nuevo modal

  modalMode: 'crear' | 'editar' = 'crear';
  currentNivelIdInsert: number = 0;

  // Variables para Nivel Estructural
  modalNivelMode: 'crear' | 'editar' = 'crear';
  currentNivelEditId: number | null = null;
  nuevoNivelNombre: string = '';
  nuevoNivelPosicion: number = 1;
  nivelToDelete: NivelOrganizacional | null = null; // <-- Nivel a eliminar
  deleteNivelErrorMsg: string = ''; // <-- Mensaje de error para nivel

  // Variables para Nodo
  formData: any = { Id: null, IdPadre: null, Codigo: '', Nombre: '', Descripcion: '', ResponsableId: null };
  padresDisponibles: NodoOrganizacional[] = [];
  itemToDelete: any = null;
  deleteErrorMsg: string = '';

  showSuccessModal = false;
  successMessage = '';
  searchTerm: string = '';

  itemToTrace: any = null;
  @ViewChild('trazabilidadComp') trazabilidadComp: any;

  constructor(private _dataService: DataService) {}

  ngOnInit(): void { this.cargarDatos(); }

  cargarDatos(): void {
    this._dataService.doRequestPost('uspPersonalObtenerTodo', { data: {} }).subscribe((res: any) => {
      this.empleados = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
    });

    this._dataService.doRequestPost('uspNivelOrganizacionalObtenerTodo', { data: {} }).subscribe((res: any) => {
      this.niveles = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      this.niveles.sort((a, b) => a.Nivel - b.Nivel);
      this.niveles.forEach(n => { if (this.selecciones[n.Id] === undefined) this.selecciones[n.Id] = null; });
    });

    this._dataService.doRequestPost('uspNodoOrganizacionalObtenerTodo', { data: {} }).subscribe((res: any) => {
      this.nodos = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      this.restaurarSelecciones();
    });
  }

  restaurarSelecciones() {
    for (let key in this.selecciones) {
      if (this.selecciones[key]) {
        const found = this.nodos.find(n => n.Id === this.selecciones[key]!.Id);
        this.selecciones[key] = found || null;
      }
    }
  }

  getNodosVisibles(nivel: NivelOrganizacional, index: number): NodoOrganizacional[] {
    let result = this.nodos.filter(n => n.IdNivelOrganizacional === nivel.Id);
    if (index > 0) {
      const nivelAnterior = this.niveles[index - 1];
      const nodoPadreSeleccionado = this.selecciones[nivelAnterior.Id];
      if (!nodoPadreSeleccionado) return [];
      result = result.filter(n => n.IdPadre === nodoPadreSeleccionado.Id);
    } else {
      result = result.filter(n => n.IdPadre === null);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(n =>
        n.Nombre.toLowerCase().includes(term) ||
        n.Codigo.toLowerCase().includes(term) ||
        (this.getResponsable(n.ResponsableId)?.Nombre?.toLowerCase() || '').includes(term)
      );
    }
    return result;
  }

  seleccionarNodo(nivelId: number, nodo: NodoOrganizacional, nivelIndex: number) {
    this.selecciones[nivelId] = nodo;
    this.itemToTrace = nodo;
    for (let i = nivelIndex + 1; i < this.niveles.length; i++) {
      this.selecciones[this.niveles[i].Id] = null;
    }
  }

  puedeCrearEnNivel(index: number): boolean {
    if (index === 0) return true;
    return !!this.selecciones[this.niveles[index - 1].Id];
  }

  // ==========================================
  // MODAL: NIVEL ESTRUCTURAL (Crear / Editar / Eliminar)
  // ==========================================
  abrirModalNivel(mode: 'crear' | 'editar', nivel?: NivelOrganizacional) {
    this.modalNivelMode = mode;
    if (mode === 'crear') {
      this.nuevoNivelNombre = '';
      this.nuevoNivelPosicion = this.niveles.length > 0 ? this.niveles.length + 1 : 1;
      this.currentNivelEditId = null;
    } else if (nivel) {
      this.nuevoNivelNombre = nivel.Nombre;
      this.currentNivelEditId = nivel.Id;
    }
    this.showNivelModal = true;
  }

  cerrarModalNivel() { this.showNivelModal = false; }

  guardarNivel() {
    if (!this.nuevoNivelNombre.trim()) return;

    if (this.modalNivelMode === 'crear') {
      const payload = { data: { p_Nivel: Number(this.nuevoNivelPosicion), p_Nombre: this.nuevoNivelNombre.trim(), p_IdUsuarioActual: 1 } };
      this._dataService.doRequestPost('uspNivelOrganizacionalInsertar', payload).subscribe({
        next: () => { this.cargarDatos(); this.cerrarModalNivel(); this.mostrarMensajeExito('Nivel estructural agregado'); },
        error: (err) => console.error('Error al crear nivel:', err)
      });
    } else {
      const payload = { data: { p_Id: this.currentNivelEditId, p_Nombre: this.nuevoNivelNombre.trim(), p_IdUsuarioActual: 1 } };
      this._dataService.doRequestPost('uspNivelOrganizacionalActualizar', payload).subscribe({
        next: () => { this.cargarDatos(); this.cerrarModalNivel(); this.mostrarMensajeExito('Nombre del nivel actualizado'); },
        error: (err) => console.error('Error al actualizar nivel:', err)
      });
    }
  }

  abrirModalEliminarNivel(nivel: NivelOrganizacional) {
    this.nivelToDelete = nivel;
    this.deleteNivelErrorMsg = '';
    this.showDeleteNivelModal = true;
  }

  cerrarModalEliminarNivel() {
    this.showDeleteNivelModal = false;
    this.nivelToDelete = null;
  }

  confirmarEliminarNivel() {
    this._dataService.doRequestPost('uspNivelOrganizacionalEliminar', { data: { p_Id: this.nivelToDelete!.Id, p_IdUsuarioActual: 1 } }).subscribe({
      next: () => {
        this.cargarDatos();
        this.cerrarModalEliminarNivel();
        this.mostrarMensajeExito('Columna estructural eliminada exitosamente');
      },
      error: (err) => {
        // Capturar el mensaje del RAISERROR de SQL si viene en la respuesta, sino mensaje genérico
        this.deleteNivelErrorMsg = err?.error?.message || 'No se puede eliminar la estructura. Verifique dependencias.';
      }
    });
  }

  // ==========================================
  // MODAL: FORMULARIO NODO
  // ==========================================
  abrirModalForm(mode: 'crear' | 'editar', nivel: NivelOrganizacional, nivelIndex: number, item?: NodoOrganizacional) {
    this.modalMode = mode;
    this.currentNivelIdInsert = nivel.Id;
    if (nivelIndex > 0) {
      const idNivelAnterior = this.niveles[nivelIndex - 1].Id;
      this.padresDisponibles = this.nodos.filter(n => n.IdNivelOrganizacional === idNivelAnterior);
    } else {
      this.padresDisponibles = [];
    }
    if (mode === 'crear') {
      const nodoAnterior = nivelIndex === 0 ? null : this.selecciones[this.niveles[nivelIndex - 1].Id];
      this.formData = { Id: null, IdPadre: nodoAnterior ? nodoAnterior.Id : null, Codigo: '', Nombre: '', Descripcion: '', ResponsableId: null };
    } else if (item) {
      this.formData = { ...item };
    }
    this.showFormModal = true;
  }

  guardarForm() {
    if (!this.formData.Codigo || !this.formData.Nombre || !this.formData.Descripcion) return;
    const payloadData: any = { p_Codigo: this.formData.Codigo, p_Nombre: this.formData.Nombre, p_Descripcion: this.formData.Descripcion, p_ResponsableId: this.formData.ResponsableId || null, p_IdPadre: this.formData.IdPadre || null, p_IdUsuarioActual: 1 };
    let endpoint = this.modalMode === 'crear' ? 'uspNodoOrganizacionalInsertar' : 'uspNodoOrganizacionalActualizar';
    if (this.modalMode === 'crear') payloadData.p_IdNivelOrganizacional = this.currentNivelIdInsert;
    else payloadData.p_Id = this.formData.Id;

    this._dataService.doRequestPost(endpoint, { data: payloadData }).subscribe({
      next: () => {
        this.cargarDatos(); this.cerrarModalForm(); this.mostrarMensajeExito(`Registro ${this.modalMode === 'crear' ? 'creado' : 'actualizado'} con éxito`);
        if (this.modalMode === 'editar' && this.itemToTrace?.Id === this.formData.Id && this.trazabilidadComp) this.trazabilidadComp.cargarHistorial();
      },
      error: (err) => console.error('Error al guardar:', err)
    });
  }

  // ==========================================
  // MODAL: ELIMINAR NODO
  // ==========================================
  abrirModalEliminar(item: NodoOrganizacional) {
    this.itemToDelete = item;
    this.deleteErrorMsg = '';
    if (this.nodos.some(n => n.IdPadre === item.Id)) {
      this.deleteErrorMsg = 'No puedes eliminar este registro porque tiene elementos internos asignados.';
      return;
    }
    this.showDeleteModal = true;
  }

  confirmarEliminar() {
    if (this.deleteErrorMsg) return;
    this._dataService.doRequestPost('uspNodoOrganizacionalEliminar', { data: { p_Id: this.itemToDelete.Id, p_IdUsuarioActual: 1 } }).subscribe({
      next: () => {
        for (let key in this.selecciones) if (this.selecciones[key]?.Id === this.itemToDelete.Id) this.selecciones[key] = null;
        if (this.itemToTrace?.Id === this.itemToDelete.Id) this.itemToTrace = null;
        this.cargarDatos(); this.cerrarModalEliminar(); this.mostrarMensajeExito('Registro eliminado');
      },
      error: (err) => this.deleteErrorMsg = 'Error al eliminar. Verifique dependencias.'
    });
  }

  getResponsable(id: number | null): Empleado | undefined { return id ? this.empleados.find(e => e.Id === id) : undefined; }
  mostrarMensajeExito(mensaje: string) { this.successMessage = mensaje; this.showSuccessModal = true; setTimeout(() => this.showSuccessModal = false, 2000); }
  cerrarModalForm() { this.showFormModal = false; }
  cerrarModalEliminar() { this.showDeleteModal = false; this.itemToDelete = null; this.deleteErrorMsg = ''; }
}
