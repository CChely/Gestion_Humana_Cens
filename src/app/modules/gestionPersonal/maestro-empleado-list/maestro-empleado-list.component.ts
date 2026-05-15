import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../shared/services/data.service';
import { forkJoin } from 'rxjs';

export interface Empleado {
  IdPersonal: number;
  Codigo: string;
  FotoPerfilUrl: string;
  TipoDocumento: string;        // El código (ej. "1")
  TipoDocumentoDesc: string;    // La descripción (ej. "DNI")
  NumeroDocumento: string;
  PrimerNombre: string;
  ApellidoPaterno: string;
  NombreCompleto: string;
  EmailPersonal: string;
  EmailTrabajo: string;
  FechaIngreso: string;
  Cargo: string;                // El código
  CargoDesc: string;            // La descripción (ej. "Asistente de RRHH")
  Departamento: string;         // Usaremos UbicacionNombre ("Testing", "Sistemas", etc.)
  EstructuraJerarquica?: string;
  EstructuraOrg?: any[];        // Para almacenar el JSON parseado
  Estado: 'Activo' | 'Inactivo';
  SincErp: 'Pendiente' | 'Migrado';
  Completado: number;
  ColorAvatar: string;
  Iniciales: string;
}

@Component({
  selector: 'app-maestro-empleado-list',
  templateUrl: './maestro-empleado-list.component.html',
  styleUrls: ['./maestro-empleado-list.component.scss']
})
export class MaestroEmpleadoListComponent implements OnInit {

  titulo = 'Maestro de empleado';
  totalEmpleados = 0;
  indicadores = {
    activos: { valor: 0, porcentaje: 0 },
    altasRecientes: { valor: 0, porcentaje: 0 },
    cesados: { valor: 0, porcentaje: 0 },
    eliminados: { valor: 0, porcentaje: 0 }
  };

  empleadosBase: Empleado[] = [];
  empleadosMostrados: Empleado[] = [];
  empleadosFiltrados: Empleado[] = [];

  paginaActual = 1;
  itemsPorPagina = 8;
  totalPaginas = 1;

  columnaOrden: keyof Empleado | '' = '';
  direccionOrden: 'asc' | 'desc' = 'asc';

  textoBusqueda: string = '';
  menuAccionesAbierto = false;

  // Variables para la selección y eliminación
  seleccionados: Set<number> = new Set<number>();
  modalEliminarAbierto = false;
  modalExitoAbierto = false;
  modalErrorAbierto = false;
  mensajeExito = '';
  mensajeError = '';

  colores = [
    'bg-indigo-100 text-indigo-700', 'bg-emerald-100 text-emerald-700',
    'bg-rose-100 text-rose-700', 'bg-sky-100 text-sky-700',
    'bg-amber-100 text-amber-700'
  ];

  constructor(private _dataService: DataService) { }

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados(): void {
    const payload = { data: null };

    this._dataService.doRequestPost('uspPersonalObtenerTodos', payload).subscribe({
      next: (res: any) => {
        const data = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);

        this.empleadosBase = data.map((e: any, index: number) => {
          const nombreAmostrar = e.Nombre || `${e.PrimerNombre || ''} ${e.ApellidoPaterno || ''}`.trim() || `Empleado ${e.IdPersonal || e.Id}`;
          const iniciales = nombreAmostrar.substring(0, 2).toUpperCase();

          let estructuraOrg = [];
          if (e.EstructuraJSON) {
            try {
              estructuraOrg = JSON.parse(e.EstructuraJSON);
            } catch (err) {}
          }

          const emp: Empleado = {
            IdPersonal: e.IdPersonal || e.Id,
            Codigo: e.Codigo || 'Sin Código',
            FotoPerfilUrl: e.Avatar || e.FotoPerfilUrl || null,
            TipoDocumento: e.TipoDocumento || 'DOC',
            TipoDocumentoDesc: e.TipoDocumentoDesc || 'DOC', // AQUI RECIBIMOS LA DESCRIPCIÓN DEL SP
            NumeroDocumento: e.NumeroDocumento || 'S/N',
            PrimerNombre: e.PrimerNombre,
            ApellidoPaterno: e.ApellidoPaterno,
            NombreCompleto: nombreAmostrar,
            EmailPersonal: e.EmailPersonal || 'Sin Correo',
            EmailTrabajo: e.EmailTrabajo || 'Sin Correo',
            FechaIngreso: this.formatearFecha(e.FechaCreacion || e.FechaAsignacionCargo),
            Cargo: e.Cargo || 'Sin Cargo',
            CargoDesc: e.CargoDesc || 'Sin Cargo',           // AQUI RECIBIMOS LA DESCRIPCIÓN DEL SP
            Departamento: e.UbicacionNombre || 'Sin Área',
            EstructuraJerarquica: e.EstructuraJerarquica || '',
            EstructuraOrg: estructuraOrg,
            Estado: e.EstaEliminado ? 'Inactivo' : 'Activo',
            SincErp: 'Pendiente',
            Completado: this.calcularPorcentajeCompletado(e),
            ColorAvatar: this.colores[index % this.colores.length],
            Iniciales: iniciales
          };

          // Si FotoPerfilUrl es un identificador baseCodeFile y no una URL o base64, lo descargamos
          if (emp.FotoPerfilUrl && !emp.FotoPerfilUrl.startsWith('http') && !emp.FotoPerfilUrl.startsWith('data:')) {
            const rawBaseCode = emp.FotoPerfilUrl;
            emp.FotoPerfilUrl = ''; // Limpiamos temporalmente para renderizar las iniciales hasta que se descargue
            this._dataService.downloadFile(rawBaseCode).subscribe({
              next: (res) => {
                if (res.data && res.data.bytesFile) {
                  const extension = res.data.extension.replace('.', ''); // limpiar extensiones tipo ".jpg" a "jpg"
                  emp.FotoPerfilUrl = `data:image/${extension};base64,${res.data.bytesFile}`;
                }
              },
              error: (err) => console.error(`Error al descargar foto para empleado ${emp.Codigo}`, err)
            });
          }

          return emp;
        });

        this.empleadosFiltrados = [...this.empleadosBase];
        this.seleccionados.clear(); // Limpiar selecciones al recargar
        this.calcularIndicadores();
        this.actualizarTabla();
      },
      error: (err) => console.error('Error al cargar la lista de empleados:', err)
    });
  }

  formatearFecha(fechaIso: string): string {
    if (!fechaIso) return 'N/A';
    const d = new Date(fechaIso);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }

  calcularPorcentajeCompletado(emp: any): number {
    let llenos = 0;
    const camposImportantes = ['TipoDocumento', 'NumeroDocumento', 'PrimerNombre', 'ApellidoPaterno', 'FechaNacimiento', 'Sexo', 'EstadoCivil', 'Cargo', 'GrupoNomina', 'Sueldo'];
    camposImportantes.forEach(campo => {
      if (emp[campo] && emp[campo].toString().trim() !== '') { llenos++; }
    });
    return Math.round((llenos / camposImportantes.length) * 100);
  }

  calcularIndicadores(): void {
    this.totalEmpleados = this.empleadosBase.length;
    if (this.totalEmpleados === 0) return;

    let activos = 0, cesados = 0;

    this.empleadosBase.forEach(e => {
      if (e.Estado === 'Activo') activos++;
      if (e.Estado === 'Inactivo') cesados++;
    });

    this.indicadores.activos.valor = activos;
    this.indicadores.activos.porcentaje = parseFloat(((activos / this.totalEmpleados) * 100).toFixed(2));
    this.indicadores.cesados.valor = cesados;
    this.indicadores.cesados.porcentaje = parseFloat(((cesados / this.totalEmpleados) * 100).toFixed(2));
  }

  toggleMenuAcciones(): void { this.menuAccionesAbierto = !this.menuAccionesAbierto; }

  buscar(evento: any): void {
    const texto = evento.target.value.toLowerCase().trim();
    if (texto === '') { this.empleadosFiltrados = [...this.empleadosBase]; }
    else {
      this.empleadosFiltrados = this.empleadosBase.filter(e =>
        e.NombreCompleto.toLowerCase().includes(texto) ||
        e.NumeroDocumento.includes(texto) ||
        e.EmailPersonal.toLowerCase().includes(texto) ||
        e.CargoDesc.toLowerCase().includes(texto)
      );
    }
    this.paginaActual = 1;
    this.actualizarTabla();
  }

  ordenarPor(columna: keyof Empleado): void {
    if (this.columnaOrden === columna) { this.direccionOrden = this.direccionOrden === 'asc' ? 'desc' : 'asc'; }
    else { this.columnaOrden = columna; this.direccionOrden = 'asc'; }

    this.empleadosFiltrados.sort((a, b) => {
      const valorA = a[columna] || ''; const valorB = b[columna] || '';
      if (valorA < valorB) return this.direccionOrden === 'asc' ? -1 : 1;
      if (valorA > valorB) return this.direccionOrden === 'asc' ? 1 : -1;
      return 0;
    });
    this.actualizarTabla();
  }

  actualizarTabla(): void {
    this.totalPaginas = Math.ceil(this.empleadosFiltrados.length / this.itemsPorPagina) || 1;
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.empleadosMostrados = this.empleadosFiltrados.slice(inicio, fin);
  }

  paginaSiguiente(): void { if (this.paginaActual < this.totalPaginas) { this.paginaActual++; this.actualizarTabla(); } }
  paginaAnterior(): void { if (this.paginaActual > 1) { this.paginaActual--; this.actualizarTabla(); } }
  get indiceInicio(): number { return this.empleadosFiltrados.length === 0 ? 0 : (this.paginaActual - 1) * this.itemsPorPagina + 1; }
  get indiceFin(): number { const fin = this.paginaActual * this.itemsPorPagina; return fin > this.empleadosFiltrados.length ? this.empleadosFiltrados.length : fin; }

  // ==========================================
  // LÓGICA DE SELECCIÓN DE EMPLEADOS
  // ==========================================
  estaSeleccionado(id: number): boolean {
    return this.seleccionados.has(id);
  }

  get todosSeleccionados(): boolean {
    return this.empleadosMostrados.length > 0 && this.empleadosMostrados.every(e => this.seleccionados.has(e.IdPersonal));
  }

  toggleSeleccion(id: number, event?: Event): void {
    if (event) event.stopPropagation(); // Evitar que el clic en la fila active otra acción
    if (this.seleccionados.has(id)) {
      this.seleccionados.delete(id);
    } else {
      this.seleccionados.add(id);
    }
  }

  toggleSeleccionTodos(event: any): void {
    const checked = event.target.checked;
    if (checked) {
      this.empleadosMostrados.forEach(e => this.seleccionados.add(e.IdPersonal));
    } else {
      this.empleadosMostrados.forEach(e => this.seleccionados.delete(e.IdPersonal));
    }
  }

  // ==========================================
  // LÓGICA DE ELIMINACIÓN Y MODALES
  // ==========================================
  abrirModalEliminar(event?: Event): void {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    this.menuAccionesAbierto = false; // Cerrar el menú desplegable
    if (this.seleccionados.size === 0) return; // Si no hay nada seleccionado, ignorar
    this.modalEliminarAbierto = true;
  }

  eliminarSeleccionados(): void {
    if (this.seleccionados.size === 0) return;

    // Creamos un array de peticiones usando el Stored Procedure 'uspPersonalEliminar'
    const peticiones = Array.from(this.seleccionados).map(id => {
      const payload = { data: { p_Id: id, p_IdUsuarioActual: 1 } }; // TODO: Cambiar '1' por el ID de tu Auth Service
      return this._dataService.doRequestPost('uspPersonalEliminar', payload);
    });

    // Ejecutamos todas las peticiones en paralelo
    forkJoin(peticiones).subscribe({
      next: () => {
        this.modalEliminarAbierto = false;
        this.cargarEmpleados();
        this.mensajeExito = `Se han eliminado correctamente ${this.seleccionados.size} empleado(s).`;
        this.modalExitoAbierto = true;
      },
      error: (err) => {
        console.error('Error en eliminación múltiple:', err);
        this.modalEliminarAbierto = false;
        this.mensajeError = 'Ocurrió un error al intentar eliminar. Verifique la conexión.';
        this.modalErrorAbierto = true;
      }
    });
  }

  // ==========================================
  // EXPORTAR A EXCEL (CSV)
  // ==========================================
  exportarExcel(): void {
    if (this.empleadosFiltrados.length === 0) return;

    const cabeceras = [
      'Código', 'Nombres y Apellidos', 'Tipo Documento', 'Número Documento',
      'Email Personal', 'Fecha Ingreso', 'Cargo', 'Departamento',
      'Estado', 'Sinc. ERP', '% Completado'
    ];

    // Función auxiliar para escapar caracteres especiales de XML
    const escapeXml = (str: any) => {
      if (str === null || str === undefined) return '';
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    };

    // Cabeceras estrictas para XML Spreadsheet 2003
    let xml = `<?xml version="1.0"?>\n<?mso-application progid="Excel.Sheet"?>\n`;
    xml += `<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n xmlns:o="urn:schemas-microsoft-com:office:office"\n xmlns:x="urn:schemas-microsoft-com:office:excel"\n xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"\n xmlns:html="http://www.w3.org/TR/REC-html40">\n`;
    xml += ` <Styles>\n  <Style ss:ID="sHeader">\n   <Font ss:Bold="1" ss:Color="#FFFFFF"/>\n   <Interior ss:Color="#4F46E5" ss:Pattern="Solid"/>\n  </Style>\n  <Style ss:ID="sText">\n   <NumberFormat ss:Format="@"/>\n  </Style>\n </Styles>\n`;
    xml += ` <Worksheet ss:Name="Empleados">\n  <Table>\n   <Row>\n`;

    // Generar Cabeceras con Estilo
    cabeceras.forEach(c => {
      xml += `    <Cell ss:StyleID="sHeader"><Data ss:Type="String">${escapeXml(c)}</Data></Cell>\n`;
    });
    xml += `   </Row>\n`;

    // Generar Filas
    this.empleadosFiltrados.forEach(emp => {
      xml += `   <Row>\n`;
      xml += `    <Cell><Data ss:Type="String">${escapeXml(emp.Codigo)}</Data></Cell>\n`;
      xml += `    <Cell><Data ss:Type="String">${escapeXml(emp.NombreCompleto)}</Data></Cell>\n`;
      xml += `    <Cell><Data ss:Type="String">${escapeXml(emp.TipoDocumentoDesc)}</Data></Cell>\n`;
      // sText fuerza a que Excel lo procese como texto, manteniendo los 0 iniciales
      xml += `    <Cell ss:StyleID="sText"><Data ss:Type="String">${escapeXml(emp.NumeroDocumento)}</Data></Cell>\n`;
      xml += `    <Cell><Data ss:Type="String">${escapeXml(emp.EmailPersonal)}</Data></Cell>\n`;
      xml += `    <Cell><Data ss:Type="String">${escapeXml(emp.FechaIngreso)}</Data></Cell>\n`;
      xml += `    <Cell><Data ss:Type="String">${escapeXml(emp.CargoDesc)}</Data></Cell>\n`;
      xml += `    <Cell><Data ss:Type="String">${escapeXml(emp.Departamento)}</Data></Cell>\n`;
      xml += `    <Cell><Data ss:Type="String">${escapeXml(emp.Estado)}</Data></Cell>\n`;
      xml += `    <Cell><Data ss:Type="String">${escapeXml(emp.SincErp)}</Data></Cell>\n`;
      xml += `    <Cell><Data ss:Type="String">${emp.Completado}%</Data></Cell>\n`;
      xml += `   </Row>\n`;
    });

    xml += `  </Table>\n </Worksheet>\n</Workbook>`;

    // Exportar como aplicación Excel (XLS)
    const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    // IMPORTANTE: .xml evita la alerta en Windows y se abre de forma nativa en Excel
    link.download = `Maestro_Empleados_${new Date().toISOString().substring(0, 10)}.xml`;
    link.click();
  }
}
