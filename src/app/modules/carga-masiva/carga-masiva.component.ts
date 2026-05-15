import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { from, of } from 'rxjs';
import { concatMap, switchMap, catchError, map, tap, toArray } from 'rxjs/operators';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-carga-masiva',
  templateUrl: './carga-masiva.component.html',
  styleUrls: ['./carga-masiva.component.scss']
})
export class CargaMasivaComponent implements OnInit {

  // Control de vistas ('menu' = Hub Principal, 'empleados' = Carga de Personal)
  vistaActual: 'menu' | 'empleados' = 'menu';

  // Variables específicas de la carga de empleados
  fileName: string = '';
  headers: string[] = [];
  excelData: any[] = [];
  isLoading: boolean = false;
  procesados: number = 0;
  totalRegistros: number = 0;

  catalogos: any = {};
  nodosOrg: any[] = [];
  isCatalogosLoading: boolean = true;
  erroresValidacion: any[] = [];

  diccionarioValidacion: { [key: string]: string } = {
    'Tipo de documento (CODIGO) *': 'tipoDocumento', 'País emisor de documento (CODIGO) *': 'paises', 'Nacionalidad (CODIGO) *': 'nacionalidad',
    'Indicador domiciliado (CODIGO) *': 'indicadorDomiciliado', 'Sexo (CODIGO) *': 'sexo', 'Estado civil (CODIGO) *': 'estadoCivil',
    'Grupo sanguíneo (CODIGO)': 'grupoSanguineo', 'Situación de trabajador (CODIGO) *': 'situacionTrabajador', 'Tipo de jornada (CODIGO) *': 'tipoJornada',
    'Situación especial (CODIGO)': 'situacionEspecial', 'Modalidad de trabajo (CODIGO) *': 'modalidadTrabajo', 'Régimen aseguramiento ESSALUD (CODIGO) *': 'regimenEssalud',
    'Salud EPS (CODIGO) *': 'saludEps', 'SCTR Salud (CODIGO)': 'sctrSalud', 'Aporte SCTR Salud (CODIGO)': 'aporteSctrSalud',
    'SCTR Pensión (CODIGO)': 'sctrPension', 'Aporte SCTR Pension (CODIGO)': 'aporteSctrPension', 'Régimen pensionario (CODIGO) *': 'regimenPensionario',
    'Tipo de comisión AFP (CODIGO) *': 'tipoComision', 'Unidad salarial (CODIGO) *': 'unidadSalarial', 'Periodicidad de la remuneración (CODIGO)': 'periodicidadRemuneracion',
    'Tipo moneda de haberes (CODIGO) *': 'tipoMoneda', 'Tipo de cuenta de haberes (CODIGO)': 'tipoCuenta', 'Forma de pago de haberes (CODIGO)': 'formaPagoHaberes',
    'Entidad financiera de haberes (CODIGO)': 'entidadFinanciera', 'Forma de pago CTS (CODIGO)': 'formaPagoHaberes', 'Tipo de moneda CTS (CODIGO) *': 'tipoMoneda',
    'Tipo de cuenta CTS (CODIGO)': 'tipoCuenta', 'Entidad financiera CTS (CODIGO)': 'entidadFinanciera', 'Doble tributación (CODIGO)': 'dobleTributacion',
    'Tipo nómina RIA': 'tipoNominaRia', 'Grupo de nómina (CODIGO) *': 'grupoNomina', 'Categoría PLAME (CODIGO) *': 'categoriaPlame',
    'Categoría ocupacional (CODIGO)': 'categoriaOcupacional', 'Cargo (CODIGO) *': 'cargo', 'Ocupación (CODIGO)': 'ocupacion',
    'Lugar de trabajo (CODIGO)': 'lugarTrabajo', 'Lugar de pago (CODIGO)': 'lugarPago', 'Situación educativa (CODIGO)': 'situacionEducativa',
    'Formación superior completa (CODIGO)': 'formacionSuperiorCompleta', 'Tipo de vía (CODIGO)': 'tipoVia', 'Tipo de zona (CODIGO)': 'tipoZona'
  };

  nombresAmigablesCatalogos: { [key: string]: string } = {
    'tipoDocumento': 'Tipo de Documento', 'paises': 'Países', 'nacionalidad': 'Nacionalidad', 'indicadorDomiciliado': 'Indicador Domiciliado', 'sexo': 'Sexo', 'estadoCivil': 'Estado Civil',
    'grupoSanguineo': 'Grupo Sanguíneo', 'situacionTrabajador': 'Situación del Trabajador', 'tipoJornada': 'Tipo de Jornada', 'situacionEspecial': 'Situación Especial',
    'modalidadTrabajo': 'Modalidad de Trabajo', 'regimenEssalud': 'Régimen Essalud', 'saludEps': 'Salud EPS', 'sctrSalud': 'SCTR Salud', 'aporteSctrSalud': 'Aporte SCTR Salud',
    'sctrPension': 'SCTR Pensión', 'aporteSctrPension': 'Aporte SCTR Pensión', 'regimenPensionario': 'Régimen Pensionario', 'tipoComision': 'Tipo de Comisión AFP',
    'unidadSalarial': 'Unidad Salarial', 'periodicidadRemuneracion': 'Periodicidad de Remuneración', 'tipoMoneda': 'Tipo de Moneda', 'tipoCuenta': 'Tipo de Cuenta Bancaria',
    'formaPagoHaberes': 'Forma de Pago', 'entidadFinanciera': 'Entidad Financiera', 'dobleTributacion': 'Doble Tributación', 'tipoNominaRia': 'Tipo Nómina RIA',
    'grupoNomina': 'Grupo de Nómina', 'categoriaPlame': 'Categoría PLAME', 'categoriaOcupacional': 'Categoría Ocupacional', 'cargo': 'Cargo', 'ocupacion': 'Ocupación',
    'lugarTrabajo': 'Lugar de Trabajo', 'lugarPago': 'Lugar de Pago', 'situacionEducativa': 'Situación Educativa', 'formacionSuperiorCompleta': 'Formación Superior Completa', 'tipoVia': 'Tipo de Vía', 'tipoZona': 'Tipo de Zona'
  };

  constructor(private _dataService: DataService) { }

  ngOnInit(): void {}

  // ==========================================
  // NAVEGACIÓN ENTRE VISTAS
  // ==========================================
  irCargaEmpleados() {
    this.vistaActual = 'empleados';
    // Solo carga catálogos la primera vez que entra al módulo de empleados
    if (Object.keys(this.catalogos).length === 0) {
      this.cargarCatalogosParaValidar();
    }
  }

  volverAlMenu() {
    this.vistaActual = 'menu';
  }

  // ==========================================
  // MÓDULO: CARGA DE EMPLEADOS
  // ==========================================
  cargarCatalogosParaValidar(): void {
    this.isCatalogosLoading = true;
    this._dataService.doRequestPost('uspMainDataObtenerGeneral', { data: null }).subscribe((res: any) => {
      const data = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      const catalogosDesdeBD = [
        'grupoNomina', 'categoriaPlame', 'tipoTrabajador', 'regimenLaboral', 'tipoContrato', 'motivoContratacion',
        'tipoJornada', 'situacionEspecial', 'regimenEssalud', 'saludEps', 'regimenPensionario', 'dobleTributacion',
        'tipoNominaRia', 'proyectoObra', 'situacionEducativa', 'entidadFinanciera', 'empresasExternas',
        'aporteSctrSalud', 'aporteSctrPension', 'especialidadCtc', 'categoriaOcupacional', 'lugarTrabajo',
        'lugarPago', 'ocupacion', 'cargo', 'situacionTrabajador', 'tipoCuenta', 'sctrSalud', 'sctrPension',
        'tipoDocumento', 'estadoCivil', 'grupoSanguineo', 'formacionSuperiorCompleta', 'vinculosFamiliares',
        'indicadorDomiciliado', 'tipoVia', 'tipoZona', 'tipoMoneda', 'sexo', 'modalidadTrabajo', 'tipoComision',
        'unidadSalarial', 'formaPagoHaberes', 'periodicidadRemuneracion', 'categoriaCtc'
      ];
      data.forEach((item: any) => {
        if (item.Tipo) {
          const palabras = item.Tipo.trim().toLowerCase().split(' ').filter((p: string) => p !== '');
          if (palabras.length > 0) {
            const key = palabras[0] + palabras.slice(1).map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
            if (catalogosDesdeBD.includes(key)) {
              if (!this.catalogos[key]) { this.catalogos[key] = []; }
              this.catalogos[key].push({ codigo: item.Codigo, descripcion: item.Descripcion, id: item.Id });
            }
          }
        }
      });
      this._dataService.doRequestPost('uspNodoOrganizacionalObtenerTodo', { data: {} }).subscribe((res2: any) => {
        this.nodosOrg = Array.isArray(res2?.data) ? res2.data : (Array.isArray(res2) ? res2 : []);
        this.isCatalogosLoading = false;
      });
    });
  }

  descargarPlantilla(): void {
    const headers = [
      'Tipo de documento (CODIGO) *', 'Número de documento *', 'País emisor de documento (CODIGO) *', 'Fecha de expiración de documento', 'Apellido Paterno *', 'Apellido Materno', 'Primer Nombre *', 'Segundo Nombre', 'Fecha de nacimiento *', 'Nacionalidad (CODIGO) *', 'Indicador domiciliado (CODIGO) *', 'Sexo (CODIGO) *', 'Estado civil (CODIGO) *', 'Grupo sanguíneo (CODIGO)', 'Donante (SI/NO)', 'Discapacidad (SI/NO)', 'Socio de Negocio',
      'Tipo de trabajador (CODIGO) *', 'Régimen laboral (CODIGO) *', 'Tipo de contrato (CODIGO) *', 'Motivo de contratación (CODIGO) *', 'Fecha de inicio de contrato *', 'Fecha de termino de contrato', 'Horas jornada laboral *', 'Horas mensuales contrato *',
      'Situación de trabajador (CODIGO) *', 'Tipo de jornada (CODIGO) *', 'Trabajo jornada máxima (SI/NO)', 'Trabajo atípico (SI/NO)', 'Horario nocturno (SI/NO)', 'Situación especial (CODIGO)', 'Modalidad de trabajo (CODIGO) *', 'Sindicalizado (SI/NO)', 'Aplica Cuota Sindical (SI/NO)',
      'Régimen aseguramiento ESSALUD (CODIGO) *', 'Salud EPS (CODIGO) *', 'ESSALUD Vida (SI/NO) *', 'SCTR Salud (CODIGO)', 'Aporte SCTR Salud (CODIGO)', 'SCTR Pensión (CODIGO)', 'Aporte SCTR Pension (CODIGO)', 'Descuenta SENATI (SI/NO)', 'Régimen pensionario (CODIGO) *', 'C.U.S.P.P.', 'Tipo de comisión AFP (CODIGO) *', 'Jubilado (SI/NO)',
      'Unidad salarial (CODIGO) *', 'Sueldo *', 'Asignacion familiar (SI/NO)', 'Neto Fijo', 'Periodicidad de la remuneración (CODIGO)', 'Tipo moneda de haberes (CODIGO) *', 'Tipo de cuenta de haberes (CODIGO)', 'Forma de pago de haberes (CODIGO)', 'Cuenta bancaria de haberes', 'Cuenta interbancaria de haberes', 'Entidad financiera de haberes (CODIGO)', 'Forma de pago CTS (CODIGO)', 'Tipo de moneda CTS (CODIGO) *', 'Tipo de cuenta CTS (CODIGO)', 'Entidad financiera CTS (CODIGO)', 'Cuenta bancaria CTS', 'Cuenta interbancaria de CTS',
      'Exoneración de 5ta (SI/NO) *', 'Certificado 5ta (SI/NO) *', 'Total rentas', 'Impuesto retenido', 'Doble tributación (CODIGO)',
      'Tipo nómina RIA', 'Grupo de nómina (CODIGO) *', 'Categoría PLAME (CODIGO) *', 'Categoría ocupacional (CODIGO)', 'Cargo (CODIGO) *', 'Fecha de asignación del cargo *', 'Ocupación (CODIGO)', 'Proyecto - Obra', 'Lugar de trabajo (CODIGO)', 'Lugar de pago (CODIGO)',
      'Ubicación Organizacional (ID)',
      'Situación educativa (CODIGO)', 'Formación superior completa (CODIGO)', 'Indicador de educación completa en el Perú (SI/NO)', 'Código institución educativa', 'Código de carrera', 'Año de egreso',
      'Teléfono de casa', 'Teléfono móvil *', 'Teléfono de oficina', 'Anexo', 'E-mail personal *', 'E-mail de trabajo',
      'Dirección completa', 'Tipo de vía (CODIGO)', 'Nombre de vía', 'Número de vía', 'Departamento', 'Interior', 'Manzana', 'Lote', 'Kilometro', 'Block', 'Etapa', 'Tipo de zona (CODIGO)', 'Nombre de zona', 'Referencia', 'País (CODIGO)', 'Otro empleador (SI/NO)', 'Ubigeo (CODIGO)',
      'Categoría Construcción Civil (N°REGISTRO)', 'Especialidad Construcción Civil (N°REGISTRO)', 'Movilidad (SI/NO) *', 'AFP Ley 27252 (SI/NO)', 'APT FCJMMS (SI/NO)'
    ];

    const emptyRow: any = {};
    headers.forEach(h => emptyRow[h] = '');

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([emptyRow]);
    const wscols = headers.map(h => ({ wch: h.length + 5 }));
    ws['!cols'] = wscols;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Plantilla Empleados');
    XLSX.writeFile(wb, 'Plantilla_Carga_Empleados.xlsx');
  }

  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) { alert('Solo puedes subir un archivo a la vez.'); return; }

    const file = target.files[0];
    this.fileName = file.name;

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const data = XLSX.utils.sheet_to_json(ws, { defval: '', raw: false });
      this.excelData = data;

      if (this.excelData.length > 0) {
        this.headers = Object.keys(this.excelData[0]);
        this.validarDatosExcel();
      }
    };
    reader.readAsBinaryString(file);
  }

  validarDatosExcel(): void {
    this.erroresValidacion = [];
    this.excelData.forEach((row, index) => {
      const filaFisica = index + 2;
      const nom = row['Primer Nombre *'] || '';
      const ape = row['Apellido Paterno *'] || '';
      const nombreCompleto = nom && ape ? `${nom} ${ape}` : 'Sin nombre (Fila Incompleta)';

      this.headers.forEach(columna => {
        const valorCelda = row[columna]?.toString().trim();
        const esObligatorio = columna.includes('*');

        if (esObligatorio && (!valorCelda || valorCelda === '')) {
          this.erroresValidacion.push({ filaIndex: index, filaExcel: filaFisica, nombrePersona: nombreCompleto, columna: columna, valorActual: '', mensaje: 'El campo es obligatorio.' });
        }

        if (valorCelda && valorCelda !== '') {
          const llaveCatalogo = this.diccionarioValidacion[columna];
          if (llaveCatalogo && this.catalogos[llaveCatalogo]) {
            const existe = this.catalogos[llaveCatalogo].some((catItem: any) => String(catItem.codigo).trim() === String(valorCelda));
            if (!existe) {
              const nombreCat = this.nombresAmigablesCatalogos[llaveCatalogo] || 'Catálogo';
              this.erroresValidacion.push({ filaIndex: index, filaExcel: filaFisica, nombrePersona: nombreCompleto, columna: columna, valorActual: valorCelda, mensaje: `El código no existe en el catálogo de ${nombreCat}.` });
            }
          }
          if (columna === 'Ubicación Organizacional (ID)') {
             const existeNodo = this.nodosOrg.some((nodo: any) => String(nodo.Id) === String(valorCelda));
             if (!existeNodo) {
               this.erroresValidacion.push({ filaIndex: index, filaExcel: filaFisica, nombrePersona: nombreCompleto, columna: columna, valorActual: valorCelda, mensaje: `El ID Organizacional no existe en la estructura de la empresa.` });
             }
          }
        }
      });
    });
  }

  actualizarValorEnExcel(error: any, nuevoValor: string): void {
    this.excelData[error.filaIndex][error.columna] = nuevoValor;
    this.validarDatosExcel();
  }

  procesarCarga(): void {
    if (this.erroresValidacion.length > 0) { alert('Aún existen errores de validación. Por favor, corríjalos antes de procesar.'); return; }
    if (this.excelData.length === 0) return;

    this.isLoading = true;
    this.totalRegistros = this.excelData.length;
    this.procesados = 0;

    const exitos: any[] = [];
    const errores: any[] = [];

    from(this.excelData).pipe(
      concatMap(row => {
      const payloadPersonal = {
        p_Avatar: '', p_TipoDocumento: row['Tipo de documento (CODIGO) *'] || '', p_NumeroDocumento: String(row['Número de documento *'] || ''), p_PaisEmisorDocumento: row['País emisor de documento (CODIGO) *'] || '', p_FechaExpiracionDocumento: this.convertirFecha(row['Fecha de expiración de documento']), p_ApellidoPaterno: row['Apellido Paterno *'] || '', p_ApellidoMaterno: row['Apellido Materno'] || '', p_PrimerNombre: row['Primer Nombre *'] || '', p_SegundoNombre: row['Segundo Nombre'] || '', p_FechaNacimiento: this.convertirFecha(row['Fecha de nacimiento *']), p_Nacionalidad: row['Nacionalidad (CODIGO) *'] || '', p_IndicadorDomiciliado: row['Indicador domiciliado (CODIGO) *'] || '', p_Sexo: row['Sexo (CODIGO) *'] || '', p_EstadoCivil: row['Estado civil (CODIGO) *'] || '', p_GrupoSanguineo: row['Grupo sanguíneo (CODIGO)'] || '', p_EsDonante: this.parseBool(row['Donante (SI/NO)']), p_TieneDiscapacidad: this.parseBool(row['Discapacidad (SI/NO)']), p_SocioNegocio: row['Socio de Negocio'] || '',
        p_SituacionTrabajador: row['Situación de trabajador (CODIGO) *'] || '', p_TipoJornada: row['Tipo de jornada (CODIGO) *'] || '', p_TrabajaJornadaMaxima: this.parseBool(row['Trabajo jornada máxima (SI/NO)']), p_TrabajoAtipico: this.parseBool(row['Trabajo atípico (SI/NO)']), p_HorarioNocturno: this.parseBool(row['Horario nocturno (SI/NO)']), p_SituacionEspecial: row['Situación especial (CODIGO)'] || '', p_ModalidadTrabajo: row['Modalidad de trabajo (CODIGO) *'] || '', p_EsSindicalizado: this.parseBool(row['Sindicalizado (SI/NO)']), p_AplicaCuotaSindical: this.parseBool(row['Aplica Cuota Sindical (SI/NO)']),
        p_RegimenEssalud: row['Régimen aseguramiento ESSALUD (CODIGO) *'] || '', p_SaludEps: row['Salud EPS (CODIGO) *'] || '', p_TieneEssaludVida: this.parseBool(row['ESSALUD Vida (SI/NO) *']), p_SctrSalud: row['SCTR Salud (CODIGO)'] || '', p_AporteSctrSalud: row['Aporte SCTR Salud (CODIGO)'] || '', p_SctrPension: row['SCTR Pensión (CODIGO)'] || '', p_AporteSctrPension: row['Aporte SCTR Pension (CODIGO)'] || '', p_DescuentaSenati: this.parseBool(row['Descuenta SENATI (SI/NO)']), p_RegimenPensionario: row['Régimen pensionario (CODIGO) *'] || '', p_Cuspp: row['C.U.S.P.P.'] || '', p_TipoComisionAfp: row['Tipo de comisión AFP (CODIGO) *'] || '', p_EsJubilado: this.parseBool(row['Jubilado (SI/NO)']),
        p_UnidadSalarial: row['Unidad salarial (CODIGO) *'] || '', p_Sueldo: row['Sueldo *'] ? parseFloat(row['Sueldo *']) : 0, p_TieneAsignacionFamiliar: this.parseBool(row['Asignacion familiar (SI/NO)']), p_NetoFijo: row['Neto Fijo'] ? parseFloat(row['Neto Fijo']) : null, p_PeriodicidadRemuneracion: row['Periodicidad de la remuneración (CODIGO)'] || '',
        p_TipoMonedaHaberes: row['Tipo moneda de haberes (CODIGO) *'] || '', p_TipoCuentaHaberes: row['Tipo de cuenta de haberes (CODIGO)'] || '', p_FormaPagoHaberes: row['Forma de pago de haberes (CODIGO)'] || '', p_CuentaBancariaHaberes: row['Cuenta bancaria de haberes'] || '', p_CuentaInterbancariaHaberes: row['Cuenta interbancaria de haberes'] || '', p_EntidadFinancieraHaberes: row['Entidad financiera de haberes (CODIGO)'] || '',
        p_FormaPagoCts: row['Forma de pago CTS (CODIGO)'] || '', p_TipoMonedaCts: row['Tipo de moneda CTS (CODIGO) *'] || '', p_TipoCuentaCts: row['Tipo de cuenta CTS (CODIGO)'] || '', p_EntidadFinancieraCts: row['Entidad financiera CTS (CODIGO)'] || '', p_CuentaBancariaCts: row['Cuenta bancaria CTS'] || '', p_CuentaInterbancariaCts: row['Cuenta interbancaria de CTS'] || '',
        p_Exoneracion5ta: this.parseBool(row['Exoneración de 5ta (SI/NO) *']), p_TieneCertificado5ta: this.parseBool(row['Certificado 5ta (SI/NO) *']), p_TotalRentas: row['Total rentas'] ? parseFloat(row['Total rentas']) : null, p_ImpuestoRetenido: row['Impuesto retenido'] ? parseFloat(row['Impuesto retenido']) : null, p_DobleTributacion: row['Doble tributación (CODIGO)'] || '',
        p_TipoNominaRia: row['Tipo nómina RIA'] || '', p_GrupoNomina: row['Grupo de nómina (CODIGO) *'] || '', p_CategoriaPlame: row['Categoría PLAME (CODIGO) *'] || '', p_CategoriaOcupacional: row['Categoría ocupacional (CODIGO)'] || '', p_Cargo: row['Cargo (CODIGO) *'] || '', p_FechaAsignacionCargo: this.convertirFecha(row['Fecha de asignación del cargo *']), p_Ocupacion: row['Ocupación (CODIGO)'] || '', p_ProyectoObra: row['Proyecto - Obra'] || '', p_LugarTrabajo: row['Lugar de trabajo (CODIGO)'] || '', p_LugarPago: row['Lugar de pago (CODIGO)'] || '',
        p_IdNodoOrganizacional: row['Ubicación Organizacional (ID)'] ? parseInt(row['Ubicación Organizacional (ID)']) : null, p_IdJefeInmediato: null,
        p_SituacionEducativa: row['Situación educativa (CODIGO)'] || '', p_FormacionSuperiorCompleta: row['Formación superior completa (CODIGO)'] || '', p_IndicadorEducacionCompletaPeru: this.parseBool(row['Indicador de educación completa en el Perú (SI/NO)']), p_CodigoInstitucionEducativa: row['Código institución educativa'] || '', p_CodigoCarrera: row['Código de carrera'] || '', p_AnioEgreso: row['Año de egreso'] || null,
        p_TelefonoCasa: row['Teléfono de casa'] || '', p_TelefonoMovil: String(row['Teléfono móvil *'] || ''), p_TelefonoOficina: row['Teléfono de oficina'] || '', p_Anexo: row['Anexo'] || '', p_EmailPersonal: row['E-mail personal *'] || '', p_EmailTrabajo: row['E-mail de trabajo'] || '',
        p_DireccionCompleta: row['Dirección completa'] || '', p_TipoVia: row['Tipo de vía (CODIGO)'] || '', p_NombreVia: row['Nombre de vía'] || '', p_NumeroVia: row['Número de vía'] || '', p_DepartamentoInmueble: row['Departamento'] || '', p_Interior: row['Interior'] || '', p_Manzana: row['Manzana'] || '', p_Lote: row['Lote'] || '', p_Kilometro: row['Kilometro'] || '', p_Block: row['Block'] || '', p_Etapa: row['Etapa'] || '', p_TipoZona: row['Tipo de zona (CODIGO)'] || '', p_NombreZona: row['Nombre de zona'] || '', p_Referencia: row['Referencia'] || '', p_PaisResidencia: row['País (CODIGO)'] || '', p_Ubigeo: row['Ubigeo (CODIGO)'] || '',
        p_CategoriaConstruccionCivil: row['Categoría Construcción Civil (N°REGISTRO)'] || '', p_EspecialidadConstruccionCivil: row['Especialidad Construcción Civil (N°REGISTRO)'] || '', p_TieneMovilidad: this.parseBool(row['Movilidad (SI/NO) *']), p_TieneAfpLey27252: this.parseBool(row['AFP Ley 27252 (SI/NO)']), p_TieneAptFcjmms: this.parseBool(row['APT FCJMMS (SI/NO)']), p_IdUsuarioActual: 1
      };

      const payloadContrato = {
        p_TipoTrabajador: row['Tipo de trabajador (CODIGO) *'] || '', p_RegimenLaboral: row['Régimen laboral (CODIGO) *'] || '', p_TipoContrato: row['Tipo de contrato (CODIGO) *'] || '', p_MotivoContratacion: row['Motivo de contratación (CODIGO) *'] || '', p_FechaInicio: this.convertirFecha(row['Fecha de inicio de contrato *']), p_EsIndeterminado: row['Fecha de termino de contrato'] ? 0 : 1, p_Meses: null, p_FechaFin: this.convertirFecha(row['Fecha de termino de contrato']), p_HorasJornada: row['Horas jornada laboral *'] ? parseFloat(row['Horas jornada laboral *']) : 0, p_HorasMensuales: row['Horas mensuales contrato *'] ? parseFloat(row['Horas mensuales contrato *']) : 0, p_IdUsuarioActual: 1
      };

      return this._dataService.doRequestPost('uspPersonalInsertar', { data: payloadPersonal }).pipe(
        switchMap((res: any) => {
          if (res?.data && res.data.length > 0) {
            const idPers = res.data[0].IdPersonal || res.data[0].Id;
            return this._dataService.doRequestPost('uspPersonalContratoInsertar', { data: { p_IdPersonal: idPers, ...payloadContrato } }).pipe( map(() => ({ error: false, data: row })) );
          }
          return of({ error: false, data: row });
        }),
        catchError(err => { return of({ error: true, data: row }); }),
        tap((result: any) => { this.procesados++; if (result.error) errores.push(result); else exitos.push(result); })
      );
      }),
      toArray()
    ).subscribe({
      next: (res) => {
        this.isLoading = false;
        let message = `¡Carga masiva finalizada!\n${exitos.length} registros procesados exitosamente.`;
        if (errores.length > 0) message += `\n${errores.length} registros fallaron por problemas en base de datos.`;
        alert(message);
        this.excelData = []; this.fileName = ''; this.headers = []; this.erroresValidacion = []; this.procesados = 0; this.totalRegistros = 0;
      },
      error: (err) => {
        this.isLoading = false; alert('Ocurrió un error general al procesar el archivo.');
      }
    });
  }

  private convertirFecha(fechaStr: string): string | null {
    if (!fechaStr) return null;
    const partes = fechaStr.split('/');
    if (partes.length === 3) return `${partes[2]}-${partes[1]}-${partes[0]}`;
    return fechaStr;
  }

  private parseBool(valor: any): number {
    if (!valor) return 0;
    const texto = String(valor).trim().toUpperCase();
    return (texto === 'SI' || texto === 'SÍ' || texto === '1' || texto === 'TRUE') ? 1 : 0;
  }
}
