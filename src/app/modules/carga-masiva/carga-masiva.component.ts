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

  fileName: string = '';
  headers: string[] = [];
  excelData: any[] = [];
  isLoading: boolean = false;
  procesados: number = 0;
  totalRegistros: number = 0;

  constructor(private _dataService: DataService) { }

  ngOnInit(): void {

  }

  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      alert('Solo puedes subir un archivo a la vez.');
      return;
    }

    const file = target.files[0];
    this.fileName = file.name;

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      // raw: false permite que se lean las fechas como texto en formato excel original en vez de números de serie
      const data = XLSX.utils.sheet_to_json(ws, { raw: false });

      this.excelData = data;
      if (this.excelData.length > 0) {
        this.headers = Object.keys(this.excelData[0]);
      }
    };
    reader.readAsBinaryString(file);
  }

  procesarCarga(): void {
    if (this.excelData.length === 0) return;

    this.isLoading = true;
    this.totalRegistros = this.excelData.length;
    this.procesados = 0;

    const exitos: any[] = [];
    const errores: any[] = [];

    from(this.excelData).pipe(
      concatMap(row => {
      const payloadPersonal = {
        // DATOS PERSONALES
        p_Avatar: '',
        p_TipoDocumento: row['Tipo de documento (CODIGO) *'] || '',
        p_NumeroDocumento: String(row['Número de documento *'] || ''),
        p_PaisEmisorDocumento: row['País emisor de documento (CODIGO) *'] || '',
        p_FechaExpiracionDocumento: this.convertirFecha(row['Fecha de expiración de documento']),
        p_ApellidoPaterno: row['Apellido Paterno *'] || '',
        p_ApellidoMaterno: row['Apellido Materno'] || '',
        p_PrimerNombre: row['Primer Nombre *'] || '',
        p_SegundoNombre: row['Segundo Nombre'] || '',
        p_FechaNacimiento: this.convertirFecha(row['Fecha de nacimiento *']),
        p_Nacionalidad: row['Nacionalidad (CODIGO) *'] || '',
        p_IndicadorDomiciliado: row['Indicador domiciliado (CODIGO) *'] || '',
        p_Sexo: row['Sexo (CODIGO) *'] || '',
        p_EstadoCivil: row['Estado civil (CODIGO) *'] || '',
        p_GrupoSanguineo: row['Grupo sanguíneo (CODIGO)'] || '',
        p_EsDonante: this.parseBool(row['Donante (SI/NO)']),
        p_TieneDiscapacidad: this.parseBool(row['Discapacidad (SI/NO)']),
        p_SocioNegocio: row['Socio de Negocio'] || '',

        // MODALIDAD
        p_SituacionTrabajador: row['Situación de trabajador (CODIGO) *'] || '',
        p_TipoJornada: row['Tipo de jornada (CODIGO) *'] || '',
        p_TrabajaJornadaMaxima: this.parseBool(row['Trabajo jornada máxima (SI/NO)']),
        p_TrabajoAtipico: this.parseBool(row['Trabajo atípico (SI/NO)']),
        p_HorarioNocturno: this.parseBool(row['Horario nocturno (SI/NO)']),
        p_SituacionEspecial: row['Situación especial (CODIGO)'] || '',
        p_ModalidadTrabajo: row['Modalidad de trabajo (CODIGO) *'] || '',
        p_EsSindicalizado: this.parseBool(row['Sindicalizado (SI/NO)']),
        p_AplicaCuotaSindical: this.parseBool(row['Aplica Cuota Sindical (SI/NO)']),

        // AFILIACIÓN
        p_RegimenEssalud: row['Régimen aseguramiento ESSALUD (CODIGO) *'] || '',
        p_SaludEps: row['Salud EPS (CODIGO) *'] || '',
        p_TieneEssaludVida: this.parseBool(row['ESSALUD Vida (SI/NO) *']),
        p_SctrSalud: row['SCTR Salud (CODIGO)'] || '',
        p_AporteSctrSalud: row['Aporte SCTR Salud (CODIGO)'] || '',
        p_SctrPension: row['SCTR Pensión (CODIGO)'] || '',
        p_AporteSctrPension: row['Aporte SCTR Pension (CODIGO)'] || '',
        p_DescuentaSenati: this.parseBool(row['Descuenta SENATI (SI/NO)']),
        p_RegimenPensionario: row['Régimen pensionario (CODIGO) *'] || '',
        p_Cuspp: row['C.U.S.P.P.'] || '',
        p_TipoComisionAfp: row['Tipo de comisión AFP (CODIGO) *'] || '',
        p_EsJubilado: this.parseBool(row['Jubilado (SI/NO)']),

        // REMUNERACIÓN
        p_UnidadSalarial: row['Unidad salarial (CODIGO) *'] || '',
        p_Sueldo: row['Sueldo *'] ? parseFloat(row['Sueldo *']) : 0,
        p_TieneAsignacionFamiliar: this.parseBool(row['Asignacion familiar (SI/NO)']),
        p_NetoFijo: row['Neto Fijo'] ? parseFloat(row['Neto Fijo']) : null,
        p_PeriodicidadRemuneracion: row['Periodicidad de la remuneración (CODIGO)'] || '',

        p_TipoMonedaHaberes: row['Tipo moneda de haberes (CODIGO) *'] || '',
        p_TipoCuentaHaberes: row['Tipo de cuenta de haberes (CODIGO)'] || '',
        p_FormaPagoHaberes: row['Forma de pago de haberes (CODIGO)'] || '',
        p_CuentaBancariaHaberes: row['Cuenta bancaria de haberes'] || '',
        p_CuentaInterbancariaHaberes: row['Cuenta interbancaria de haberes'] || '',
        p_EntidadFinancieraHaberes: row['Entidad financiera de haberes (CODIGO)'] || '',

        p_FormaPagoCts: row['Forma de pago CTS (CODIGO)'] || '',
        p_TipoMonedaCts: row['Tipo de moneda CTS (CODIGO) *'] || '',
        p_TipoCuentaCts: row['Tipo de cuenta CTS (CODIGO)'] || '',
        p_EntidadFinancieraCts: row['Entidad financiera CTS (CODIGO)'] || '',
        p_CuentaBancariaCts: row['Cuenta bancaria CTS'] || '',
        p_CuentaInterbancariaCts: row['Cuenta interbancaria de CTS'] || '',

        // TRIBUTACIÓN
        p_Exoneracion5ta: this.parseBool(row['Exoneración de 5ta (SI/NO) *']),
        p_TieneCertificado5ta: this.parseBool(row['Certificado 5ta (SI/NO) *']),
        p_TotalRentas: row['Total rentas'] ? parseFloat(row['Total rentas']) : null,
        p_ImpuestoRetenido: row['Impuesto retenido'] ? parseFloat(row['Impuesto retenido']) : null,
        p_DobleTributacion: row['Doble tributación (CODIGO)'] || '',

        // ROL ORGANIZACIONAL
        p_TipoNominaRia: row['Tipo nómina RIA'] || '',
        p_GrupoNomina: row['Grupo de nómina (CODIGO) *'] || '',
        p_CategoriaPlame: row['Categoría PLAME (CODIGO) *'] || '',
        p_CategoriaOcupacional: row['Categoría ocupacional (CODIGO)'] || '',
        p_Cargo: row['Cargo (CODIGO) *'] || '',
        p_FechaAsignacionCargo: this.convertirFecha(row['Fecha de asignación del cargo *']),
        p_Ocupacion: row['Ocupación (CODIGO)'] || '',
        p_ProyectoObra: row['Proyecto - Obra'] || '',
        p_LugarTrabajo: row['Lugar de trabajo (CODIGO)'] || '',
        p_LugarPago: row['Lugar de pago (CODIGO)'] || '',

        p_IdArea: row['Área (CODIGO)'] || null,
        p_IdDepartamento: row['Departamento (CODIGO)'] || null,
        p_IdSeccion: row['Sección (CODIGO)'] || null,
        p_IdJefeInmediato: null,

        // EDUCACIÓN
        p_SituacionEducativa: row['Situación educativa (CODIGO)'] || '',
        p_FormacionSuperiorCompleta: row['Formación superior completa (CODIGO)'] || '',
        p_IndicadorEducacionCompletaPeru: this.parseBool(row['Indicador de educación completa en el Perú (SI/NO)']),
        p_CodigoInstitucionEducativa: row['Código institución educativa'] || '',
        p_CodigoCarrera: row['Código de carrera'] || '',
        p_AnioEgreso: row['Año de egreso'] || null,

        // CONTACTO Y RESIDENCIA
        p_TelefonoCasa: row['Teléfono de casa'] || '',
        p_TelefonoMovil: String(row['Teléfono móvil *'] || ''),
        p_TelefonoOficina: row['Teléfono de oficina'] || '',
        p_Anexo: row['Anexo'] || '',
        p_EmailPersonal: row['E-mail personal *'] || '',
        p_EmailTrabajo: row['E-mail de trabajo'] || '',

        p_DireccionCompleta: row['Dirección completa'] || '',
        p_TipoVia: row['Tipo de vía (CODIGO)'] || '',
        p_NombreVia: row['Nombre de vía'] || '',
        p_NumeroVia: row['Número de vía'] || '',
        p_DepartamentoInmueble: row['Departamento'] || '',
        p_Interior: row['Interior'] || '',
        p_Manzana: row['Manzana'] || '',
        p_Lote: row['Lote'] || '',
        p_Kilometro: row['Kilometro'] || '',
        p_Block: row['Block'] || '',
        p_Etapa: row['Etapa'] || '',
        p_TipoZona: row['Tipo de zona (CODIGO)'] || '',
        p_NombreZona: row['Nombre de zona'] || '',
        p_Referencia: row['Referencia'] || '',
        p_PaisResidencia: row['País (CODIGO)'] || '',
        p_Ubigeo: row['Ubigeo (CODIGO)'] || '',

        // COMPLEMENTARIOS
        p_CategoriaConstruccionCivil: row['Categoría Construcción Civil (N°REGISTRO)'] || '',
        p_EspecialidadConstruccionCivil: row['Especialidad Construcción Civil (N°REGISTRO)'] || '',
        p_TieneMovilidad: this.parseBool(row['Movilidad (SI/NO) *']),
        p_TieneAfpLey27252: this.parseBool(row['AFP Ley 27252 (SI/NO)']),
        p_TieneAptFcjmms: this.parseBool(row['APT FCJMMS (SI/NO)']),

        p_IdUsuarioActual: 1
      };

      const payloadContrato = {
        p_TipoTrabajador: row['Tipo de trabajador (CODIGO) *'] || '',
        p_RegimenLaboral: row['Régimen laboral (CODIGO) *'] || '',
        p_TipoContrato: row['Tipo de contrato (CODIGO) *'] || '',
        p_MotivoContratacion: row['Motivo de contratación (CODIGO) *'] || '',
        p_FechaInicio: this.convertirFecha(row['Fecha de inicio de contrato *']),
        p_EsIndeterminado: row['Fecha de termino de contrato'] ? 0 : 1,
        p_Meses: null,
        p_FechaFin: this.convertirFecha(row['Fecha de termino de contrato']),
        p_HorasJornada: row['Horas jornada laboral *'] ? parseFloat(row['Horas jornada laboral *']) : 0,
        p_HorasMensuales: row['Horas mensuales contrato *'] ? parseFloat(row['Horas mensuales contrato *']) : 0,
        p_IdUsuarioActual: 1
      };

      return this._dataService.doRequestPost('uspPersonalInsertar', { data: payloadPersonal }).pipe(
        switchMap((res: any) => {
          if (res?.data && res.data.length > 0) {
            const idPers = res.data[0].IdPersonal || res.data[0].Id;
            return this._dataService.doRequestPost('uspPersonalContratoInsertar', { data: { p_IdPersonal: idPers, ...payloadContrato } }).pipe(
              map(() => ({ error: false, data: row }))
            );
          }
          return of({ error: false, data: row });
        }),
        catchError(err => {
          console.error('Error insertando fila', row, err);
          return of({ error: true, data: row });
        }),
        tap((result: any) => {
          // Al terminar de procesar esta fila, actualizamos el contador en tiempo real
          this.procesados++;
          if (result.error) errores.push(result);
          else exitos.push(result);
        })
      );
      }),
      toArray() // Esperamos asíncronamente a que todas finalicen
    ).subscribe({
      next: (res) => {
        this.isLoading = false;

        let message = `¡Carga masiva finalizada!\n${exitos.length} registros procesados exitosamente.`;
        if (errores.length > 0) {
          message += `\n${errores.length} registros fallaron. Revise la consola para más detalles.`;
          console.error('Filas con errores:', errores.map((e: any) => e.data));
        }
        alert(message);

        this.excelData = [];
        this.fileName = '';
        this.headers = [];
        this.procesados = 0;
        this.totalRegistros = 0;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error procesando carga masiva', err);
        alert('Ocurrió un error al procesar el archivo. Revisa la consola.');
      }
    });
  }

  // Transforma formato DD/MM/YYYY a YYYY-MM-DD esperado por SQL
  private convertirFecha(fechaStr: string): string | null {
    if (!fechaStr) return null;
    const partes = fechaStr.split('/');
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }
    return fechaStr;
  }

  // Transforma formato SI/NO u otros de la celda a 1/0 para la base de datos
  private parseBool(valor: any): number {
    if (!valor) return 0;
    const texto = String(valor).trim().toUpperCase();
    return (texto === 'SI' || texto === 'SÍ' || texto === '1' || texto === 'TRUE') ? 1 : 0;
  }
}
