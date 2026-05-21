import { Component, OnInit, OnDestroy } from '@angular/core';
//@ts-ignore
import LUGARES from './lugares.json';
import { DATALOCAL } from './data';
import { DataService } from '../../../shared/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-maestro-empleado',
  templateUrl: './maestro-empleado.component.html',
  styleUrls: ['./maestro-empleado.component.scss']
})
export class MaestroEmpleadoComponent implements OnInit, OnDestroy {

  seccionActiva: string = 'datos-personales';
  personalActual: any;
  isEdicion: boolean = false;
  edadCalculada: number | null = null;
  fotoPerfilUrl: string | ArrayBuffer | null = null;

  isSuccessModalOpen: boolean = false;
  successTitle: string = ''; successMessage: string = '';
  isErrorModalOpen: boolean = false;
  errorTitle: string = ''; errorMessage: string = '';
  isUploadingFile: boolean = false;

  dropdownTipoDocAbierto = false; busquedaTipoDoc = ''; tipoDocumentoSeleccionado: any = null;
  modalContratoAbierto = false; modalEmpresaAbierta = false; modalDerechohabienteAbierto = false;
  modalJefeAbierto = false; modalProyectoAbierto = false;

  jefeInmediatoSeleccionado: string = ''; proyectoSeleccionadoDesc: string = '';
  empleadosJefe: any[] = [];
  busquedaJefe = ''; paginaActualJefe = 1; itemsPorPaginaJefe = 5;
  tieneOtroEmpleador = false;

  contratos: any[] = [];
  contratoActual: any = { tipoTrabajador: '', regimenLaboral: '', tipoContrato: '', motivoContratacion: '', fechaInicio: '', indeterminado: false, meses: null, fechaFin: '', horasJornada: null, horasMensuales: null };
  editandoContratoIndex = -1; contratosEliminados: number[] = [];

  empresas: any[] = [];
  empresaActual: any = { empresa: '', fechaInicio: '', fechaFin: '', moneda: '', sueldo: null, imp5ta: false, comentario: '' };
  editandoEmpresaIndex = -1; empresasEliminadas: number[] = [];

  derechohabientes: any[] = [];
  derechohabienteActual: any = { tipoDocumento: '', numeroDocumento: '', paisEmisor: '', apellidos: '', nombres: '', fechaNacimiento: '', sexo: '', vinculoFamiliar: '', tipoDocumentoVinculo: '', numeroDocumentoVinculo: '', fechaAlta: '', estudiosActivos: false, direccion: '', tipoVia: '', nombreVia: '', numeroVia: '', departamentoUbicacion: '', interior: '', manzana: '', lote: '', kilometro: '', block: '', etapa: '', tipoZona: '', nombreZona: '', referencia: '', pais: '', departamento: '', provincia: '', distrito: '', codigoCiudad: '', telefono: '', email: '' };
  editandoDerechoIndex = -1; derechohabientesEliminados: number[] = [];
  tabDerechohabienteActivo: string = 'personales';

  catalogos: any = { paises: DATALOCAL.paises, nacionalidad: DATALOCAL.nacionalidad, departamentosPeru: DATALOCAL.departamentosPeru };
  paisesResidencia: any[] = []; departamentosResidencia: any[] = []; provinciasResidencia: any[] = []; distritosResidencia: any[] = [];
  departamentosDerecho: any[] = []; provinciasDerecho: any[] = []; distritosDerecho: any[] = [];

  // ==========================================
  // ESTRUCTURA ORGANIZACIONAL (DINÁMICA)
  // ==========================================
  nivelesOrg: any[] = []; // Columnas de la estructura (Área, Depto, etc)
  nodosOrg: any[] = [];   // Datos reales (Sistemas, Testing, etc)
  seleccionesOrg: { [idNivel: number]: number | null } = {}; // Almacena el ID seleccionado por cada Nivel

  menuSecciones = [
    { id: 'datos-personales', icono: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', titulo: 'Datos Personales' },
    { id: 'contratacion', icono: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', titulo: 'Contratación' },
    { id: 'modalidad-trabajo', icono: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', titulo: 'Modalidad de trabajo' },
    { id: 'afiliacion', icono: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', titulo: 'Afiliación' },
    { id: 'remuneracion', icono: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', titulo: 'Remuneración' },
    { id: 'rol-organizativo', icono: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', titulo: 'Rol Organizativo' },
    { id: 'educacion', icono: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222', titulo: 'Educación' },
    { id: 'datos-adicionales', icono: 'M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207', titulo: 'Datos adicionales' },
    { id: 'residencia', icono: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', titulo: 'Residencia' },
    { id: 'datos-complementarios', icono: 'M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z', titulo: 'Datos Complementarios' },
    { id: 'derechohabientes', icono: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', titulo: 'Derechohabientes' }
  ];

  private autoSaveInterval: any;
  selectedFile: File | null = null;
  baseCodeFile: string = '';

  constructor(private _dataService: DataService, private router: Router, private route: ActivatedRoute) {
    this.personalActual = this.obtenerModeloVacio();
  }

  ngOnInit(): void {
    this.paisesResidencia = LUGARES;
    this.obtenerDataGeneral();
    this.cargarEstructuraOrganizacional();
    this.cargarEmpleadosJefe();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEdicion = true;
        this.cargarEmpleado(id);
      } else {
        this.isEdicion = false;
        this.cargarBorrador();
        this.obtenerProximoCodigo();
      }
    });

    this.autoSaveInterval = setInterval(() => {
      if (!this.personalActual.Id) this.guardarBorrador();
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.autoSaveInterval) clearInterval(this.autoSaveInterval);
  }

  get esFormularioValido(): boolean {
    const p = this.personalActual;
    const v = (val: any) => val !== null && val !== undefined && val.toString().trim() !== '';

    const basicos = v(p.tipoDocumento) && v(p.numeroDocumento) && v(p.paisEmisorDocumento) &&
                    v(p.apellidoPaterno) && v(p.primerNombre) && v(p.fechaNacimiento) &&
                    v(p.nacionalidad) && v(p.indicadorDomiciliado) && v(p.sexo) && v(p.estadoCivil);
    const modalidad = v(p.tipoJornada);
    const afiliacion = v(p.regimenEssalud) && v(p.saludEps) && v(p.regimenPensionario);
    const remuneracion = v(p.unidadSalarial) && v(p.sueldo) && v(p.tipoMonedaHaberes);
    const rol = v(p.grupoNomina) && v(p.categoriaPlame) && v(p.cargo) && v(p.fechaAsignacionCargo);
    const adicionales = v(p.telefonoMovil) && v(p.emailPersonal);

    let certificadoValido = true;
    if (p.tieneCertificado5ta) certificadoValido = v(p.totalRentas);
    return !!(basicos && modalidad && afiliacion && remuneracion && rol && adicionales && certificadoValido);
  }

  obtenerModeloVacio() {
    return {
      Id: null, codigoInterno: '', codigo: '', avatar: '', tipoDocumento: '', numeroDocumento: '', paisEmisorDocumento: '', fechaExpiracionDocumento: '',
      apellidoPaterno: '', apellidoMaterno: '', primerNombre: '', segundoNombre: '', fechaNacimiento: '', nacionalidad: '', indicadorDomiciliado: '',
      sexo: '', estadoCivil: '', grupoSanguineo: '', esDonante: false, tieneDiscapacidad: false, socioNegocio: '', situacionTrabajador: '',
      tipoJornada: '', trabajaJornadaMaxima: false, trabajoAtipico: false, horarioNocturno: false, situacionEspecial: '', modalidadTrabajo: '',
      esSindicalizado: false, aplicaCuotaSindical: false, regimenEssalud: '', saludEps: '', tieneEssaludVida: false, sctrSalud: '',
      aporteSctrSalud: '', sctrPension: '', aporteSctrPension: '', descuentaSenati: false, regimenPensionario: '', cuspp: '',
      tipoComisionAfp: '', esJubilado: false, unidadSalarial: '', sueldo: null, tieneAsignacionFamiliar: false, netoFijo: null,
      periodicidadRemuneracion: '', tipoMonedaHaberes: '', tipoCuentaHaberes: '', formaPagoHaberes: '', cuentaBancariaHaberes: '',
      cuentaInterbancariaHaberes: '', entidadFinancieraHaberes: '', formaPagoCts: '', tipoMonedaCts: '', tipoCuentaCts: '',
      entidadFinancieraCts: '', cuentaBancariaCts: '', cuentaInterbancariaCts: '', exoneracion5ta: false, tieneCertificado5ta: false,
      totalRentas: null, impuestoRetenido: null, dobleTributacion: '', tipoNominaRia: '', grupoNomina: '', categoriaPlame: '',
      categoriaOcupacional: '', cargo: '', fechaAsignacionCargo: '', ocupacion: '', proyectoObra: '', lugarTrabajo: '', lugarPago: '',
      idNodoOrganizacional: null, idJefeInmediato: null, situacionEducativa: '', formacionSuperiorCompleta: '',
      indicadorEducacionCompletaPeru: false, codigoInstitucionEducativa: '', codigoCarrera: '', anioEgreso: null, telefonoCasa: '',
      telefonoMovil: '', telefonoOficina: '', anexo: '', emailPersonal: '', emailTrabajo: '', direccionCompleta: '', tipoVia: '',
      nombreVia: '', numeroVia: '', departamentoInmueble: '', interior: '', manzana: '', lote: '', kilometro: '', block: '', etapa: '',
      tipoZona: '', nombreZona: '', referencia: '', paisResidencia: '', provinciaInmueble: '', ubigeo: '', categoriaConstruccionCivil: '',
      especialidadConstruccionCivil: '', tieneMovilidad: false, tieneAfpLey27252: false, tieneAptFcjmms: false
    };
  }

  guardarBorrador() {
    localStorage.setItem('draft_personalActual', JSON.stringify(this.personalActual));
    localStorage.setItem('draft_seleccionesOrg', JSON.stringify(this.seleccionesOrg)); // Guardamos selecciones organizacionales
    localStorage.setItem('draft_contratos', JSON.stringify(this.contratos));
    localStorage.setItem('draft_empresas', JSON.stringify(this.empresas));
    localStorage.setItem('draft_derechohabientes', JSON.stringify(this.derechohabientes));
    localStorage.setItem('draft_extras', JSON.stringify({ tieneOtroEmpleador: this.tieneOtroEmpleador, fotoPerfilUrl: this.fotoPerfilUrl, jefeInmediatoSeleccionado: this.jefeInmediatoSeleccionado, proyectoSeleccionadoDesc: this.proyectoSeleccionadoDesc }));
  }

  cargarBorrador() {
    const dPersonal = localStorage.getItem('draft_personalActual');
    if (dPersonal) this.personalActual = JSON.parse(dPersonal);

    const dSelOrg = localStorage.getItem('draft_seleccionesOrg');
    if (dSelOrg) this.seleccionesOrg = JSON.parse(dSelOrg);

    const dContratos = localStorage.getItem('draft_contratos');
    if (dContratos) this.contratos = JSON.parse(dContratos);

    const dEmpresas = localStorage.getItem('draft_empresas');
    if (dEmpresas) this.empresas = JSON.parse(dEmpresas);

    const dDerecho = localStorage.getItem('draft_derechohabientes');
    if (dDerecho) this.derechohabientes = JSON.parse(dDerecho);

    const dExtras = localStorage.getItem('draft_extras');
    if (dExtras) {
      const ext = JSON.parse(dExtras);
      this.tieneOtroEmpleador = ext.tieneOtroEmpleador || false;
      this.fotoPerfilUrl = ext.fotoPerfilUrl || null;
      this.jefeInmediatoSeleccionado = ext.jefeInmediatoSeleccionado || '';
      this.proyectoSeleccionadoDesc = ext.proyectoSeleccionadoDesc || '';
    }

    if (this.personalActual.paisResidencia) {
      this.onPaisChange();
      // Autocompletar departamento y provincia desde distrito si faltan
      if (!this.personalActual.departamentoInmueble && this.personalActual.ubigeo) {
        for (const dep of this.departamentosResidencia) {
          if (dep.children) {
            const provs = Object.keys(dep.children).map(k => ({ id: k, ...dep.children[k] }));
            const foundProv = provs.find(p => p.children && p.children[this.personalActual.ubigeo]);
            if (foundProv) { this.personalActual.departamentoInmueble = dep.id; break; }
          }
        }
      }
    }
    if (this.personalActual.departamentoInmueble) {
      this.onDepartamentoChange();
      if (!this.personalActual.provinciaInmueble && this.personalActual.ubigeo) {
        const prov = this.provinciasResidencia.find(p => p.children && p.children[this.personalActual.ubigeo]);
        if (prov) this.personalActual.provinciaInmueble = prov.id;
      }
    }
    if (this.personalActual.provinciaInmueble) this.onProvinciaChange();
    if (this.personalActual.fechaNacimiento) this.calcularEdad({ target: { value: this.personalActual.fechaNacimiento } });
  }

  cargarEmpleado(id: string): void {
    this._dataService.doRequestPost('uspPersonalObtenerPorId', { data: { p_Id: id } }).subscribe({
      next: (res: any) => {
        const data = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        if (data.length > 0) {
          const b = data[0];
          this.personalActual = {
            Id: b.IdPersonal || b.Id,
            codigoInterno: b.CodigoInterno || '', codigo: b.Codigo || '',
            avatar: b.FotoPerfilUrl || b.Avatar || '',
            tipoDocumento: b.TipoDocumento || '', numeroDocumento: b.NumeroDocumento || '', paisEmisorDocumento: b.PaisEmisorDocumento || '',
            fechaExpiracionDocumento: b.FechaExpiracionDocumento ? b.FechaExpiracionDocumento.split('T')[0] : '',
            apellidoPaterno: b.ApellidoPaterno || '', apellidoMaterno: b.ApellidoMaterno || '', primerNombre: b.PrimerNombre || '', segundoNombre: b.SegundoNombre || '',
            fechaNacimiento: b.FechaNacimiento ? b.FechaNacimiento.split('T')[0] : '', nacionalidad: b.Nacionalidad || '', indicadorDomiciliado: b.IndicadorDomiciliado || '',
            sexo: b.Sexo || '', estadoCivil: b.EstadoCivil || '', grupoSanguineo: b.GrupoSanguineo || '', esDonante: !!b.EsDonante, tieneDiscapacidad: !!b.TieneDiscapacidad,
            socioNegocio: b.SocioNegocio || '', situacionTrabajador: b.SituacionTrabajador || '', tipoJornada: b.TipoJornada || '',
            trabajaJornadaMaxima: !!b.TrabajaJornadaMaxima, trabajoAtipico: !!b.TrabajoAtipico, horarioNocturno: !!b.HorarioNocturno,
            situacionEspecial: b.SituacionEspecial || '', modalidadTrabajo: b.ModalidadTrabajo || '', esSindicalizado: !!b.EsSindicalizado, aplicaCuotaSindical: !!b.AplicaCuotaSindical,
            regimenEssalud: b.RegimenEssalud || '', saludEps: b.SaludEps || '', tieneEssaludVida: !!b.TieneEssaludVida, sctrSalud: b.SctrSalud || '',
            aporteSctrSalud: b.AporteSctrSalud || '', sctrPension: b.SctrPension || '', aporteSctrPension: b.AporteSctrPension || '', descuentaSenati: !!b.DescuentaSenati,
            regimenPensionario: b.RegimenPensionario || '', cuspp: b.Cuspp || '', tipoComisionAfp: b.TipoComisionAfp || '', esJubilado: !!b.EsJubilado,
            unidadSalarial: b.UnidadSalarial || '', sueldo: b.Sueldo || null, tieneAsignacionFamiliar: !!b.TieneAsignacionFamiliar, netoFijo: b.NetoFijo || null,
            periodicidadRemuneracion: b.PeriodicidadRemuneracion || '', tipoMonedaHaberes: b.TipoMonedaHaberes || '', tipoCuentaHaberes: b.TipoCuentaHaberes || '',
            formaPagoHaberes: b.FormaPagoHaberes || '', cuentaBancariaHaberes: b.CuentaBancariaHaberes || '', cuentaInterbancariaHaberes: b.CuentaInterbancariaHaberes || '',
            entidadFinancieraHaberes: b.EntidadFinancieraHaberes || '', formaPagoCts: b.FormaPagoCts || '', tipoMonedaCts: b.TipoMonedaCts || '',
            tipoCuentaCts: b.TipoCuentaCts || '', entidadFinancieraCts: b.EntidadFinancieraCts || '', cuentaBancariaCts: b.CuentaBancariaCts || '',
            cuentaInterbancariaCts: b.CuentaInterbancariaCts || '', exoneracion5ta: !!b.Exoneracion5ta, tieneCertificado5ta: !!b.TieneCertificado5ta,
            totalRentas: b.TotalRentas || null, impuestoRetenido: b.ImpuestoRetenido || null, dobleTributacion: b.DobleTributacion || '',
            tipoNominaRia: b.TipoNominaRia || '', grupoNomina: b.GrupoNomina || '', categoriaPlame: b.CategoriaPlame || '', categoriaOcupacional: b.CategoriaOcupacional || '',
            cargo: b.Cargo || '', fechaAsignacionCargo: b.FechaAsignacionCargo ? b.FechaAsignacionCargo.split('T')[0] : '', ocupacion: b.Ocupacion || '',
            proyectoObra: b.ProyectoObra || '', lugarTrabajo: b.LugarTrabajo || '', lugarPago: b.LugarPago || '',
            idNodoOrganizacional: b.IdNodoOrganizacional || null, // CAMPO DINAMICO RECUPERADO
            idJefeInmediato: b.IdJefeInmediato || null, situacionEducativa: b.SituacionEducativa || '', formacionSuperiorCompleta: b.FormacionSuperiorCompleta || '',
            indicadorEducacionCompletaPeru: !!b.IndicadorEducacionCompletaPeru, codigoInstitucionEducativa: b.CodigoInstitucionEducativa || '',
            codigoCarrera: b.CodigoCarrera || '', anioEgreso: b.AnioEgreso || null, telefonoCasa: b.TelefonoCasa || '', telefonoMovil: b.TelefonoMovil || '',
            telefonoOficina: b.TelefonoOficina || '', anexo: b.Anexo || '', emailPersonal: b.EmailPersonal || '', emailTrabajo: b.EmailTrabajo || '',
            direccionCompleta: b.DireccionCompleta || '', tipoVia: b.TipoVia || '', nombreVia: b.NombreVia || '', numeroVia: b.NumeroVia || '',
            departamentoInmueble: b.DepartamentoInmueble || '', interior: b.Interior || '', manzana: b.Manzana || '', lote: b.Lote || '', kilometro: b.Kilometro || '',
            block: b.Block || '', etapa: b.Etapa || '', tipoZona: b.TipoZona || '', nombreZona: b.NombreZona || '', referencia: b.Referencia || '',
            paisResidencia: b.PaisResidencia || '', provinciaInmueble: b.ProvinciaInmueble || '', ubigeo: b.Ubigeo || '',
            categoriaConstruccionCivil: b.CategoriaConstruccionCivil || '', especialidadConstruccionCivil: b.EspecialidadConstruccionCivil || '',
            tieneMovilidad: !!b.TieneMovilidad, tieneAfpLey27252: !!b.TieneAfpLey27252, tieneAptFcjmms: !!b.TieneAptFcjmms
          };

          // Reconstruir árbol jerárquico visualmente
          if (this.personalActual.idNodoOrganizacional && this.nodosOrg.length > 0) {
            this.reconstruirArbolOrg(this.personalActual.idNodoOrganizacional);
          }

          if (this.personalActual.avatar && !this.personalActual.avatar.startsWith('http') && !this.personalActual.avatar.startsWith('data:')) {
            this.descargarFoto(this.personalActual.avatar);
          } else {
            this.fotoPerfilUrl = this.personalActual.avatar || null;
          }

          if (this.personalActual.paisResidencia) {
            this.onPaisChange();
            // Autocompletar departamento y provincia desde distrito si faltan
            if (!this.personalActual.departamentoInmueble && this.personalActual.ubigeo) {
              for (const dep of this.departamentosResidencia) {
                if (dep.children) {
                  const provs = Object.keys(dep.children).map(k => ({ id: k, ...dep.children[k] }));
                  const foundProv = provs.find(p => p.children && p.children[this.personalActual.ubigeo]);
                  if (foundProv) { this.personalActual.departamentoInmueble = dep.id; break; }
                }
              }
            }
          }
          if (this.personalActual.departamentoInmueble) {
            this.onDepartamentoChange();
            if (!this.personalActual.provinciaInmueble && this.personalActual.ubigeo) {
              const prov = this.provinciasResidencia.find(p => p.children && p.children[this.personalActual.ubigeo]);
              if (prov) this.personalActual.provinciaInmueble = prov.id;
            }
          }
          if (this.personalActual.provinciaInmueble) this.onProvinciaChange();
          if (this.personalActual.fechaNacimiento) this.calcularEdad({ target: { value: this.personalActual.fechaNacimiento } });

          this.actualizarDescripcionesVisuales();

          // Cargas secundarias omitidas por brevedad (se mantienen igual)...
          this._dataService.doRequestPost('uspPersonalContratoObtenerPorIdPersonal', { data: { p_IdPersonal: id } }).subscribe((r: any) => {
            const items = Array.isArray(r?.data) ? r.data : (Array.isArray(r) ? r : []);
            this.contratos = items.map((c: any) => ({ IdContrato: c.IdContrato, tipoTrabajador: c.TipoTrabajador, regimenLaboral: c.RegimenLaboral, tipoContrato: c.TipoContrato, motivoContratacion: c.MotivoContratacion, fechaInicio: c.FechaInicio ? c.FechaInicio.split('T')[0] : '', indeterminado: !!c.EsIndeterminado, meses: c.Meses || null, fechaFin: c.FechaFin ? c.FechaFin.split('T')[0] : '', horasJornada: c.HorasJornada || null, horasMensuales: c.HorasMensuales || null }));
          });
          this._dataService.doRequestPost('uspPersonalOtroEmpleadorObtenerPorIdPersonal', { data: { p_IdPersonal: id } }).subscribe((r: any) => {
            const items = Array.isArray(r?.data) ? r.data : (Array.isArray(r) ? r : []);
            this.empresas = items.map((e: any) => ({ IdOtroEmpleador: e.IdOtroEmpleador, empresa: e.Empresa, fechaInicio: e.FechaInicio ? e.FechaInicio.split('T')[0] : '', fechaFin: e.FechaFin ? e.FechaFin.split('T')[0] : '', moneda: e.Moneda, sueldo: e.Sueldo, imp5ta: !!e.AplicaImpuesto5ta, comentario: e.Comentario || '' }));
            if (this.empresas.length > 0) this.tieneOtroEmpleador = true;
          });
          this._dataService.doRequestPost('uspPersonalDerechohabienteObtenerPorIdPersonal', { data: { p_IdPersonal: id } }).subscribe((r: any) => {
            const items = Array.isArray(r?.data) ? r.data : (Array.isArray(r) ? r : []);
            this.derechohabientes = items.map((d: any) => ({ IdDerechohabiente: d.IdDerechohabiente, tipoDocumento: d.TipoDocumento, numeroDocumento: d.NumeroDocumento, paisEmisor: d.PaisEmisor, apellidos: d.Apellidos, nombres: d.Nombres, fechaNacimiento: d.FechaNacimiento ? d.FechaNacimiento.split('T')[0] : '', sexo: d.Sexo, vinculoFamiliar: d.VinculoFamiliar, tipoDocumentoVinculo: d.TipoDocumentoVinculo, numeroDocumentoVinculo: d.NumeroDocumentoVinculo, fechaAlta: d.FechaAlta ? d.FechaAlta.split('T')[0] : '', estudiosActivos: !!d.TieneEstudiosActivos, direccion: d.Direccion, tipoVia: d.TipoVia, nombreVia: d.NombreVia, numeroVia: d.NumeroVia, departamentoUbicacion: d.DepartamentoUbicacion, interior: d.Interior, manzana: d.Manzana, lote: d.Lote, kilometro: d.Kilometro, block: d.Block, etapa: d.Etapa, tipoZona: d.TipoZona, nombreZona: d.NombreZona, referencia: d.Referencia, pais: d.Pais, ubigeo: d.Ubigeo, codigoCiudad: d.CodigoCiudad, telefono: d.Telefono, email: d.Email, provincia: d.Provincia || '', distrito: d.Ubigeo, departamento: '' }));
          });
        }
      },
      error: (err) => console.error('Error al cargar empleado', err)
    });
  }

  limpiarTodo() {
    localStorage.removeItem('draft_personalActual'); localStorage.removeItem('draft_seleccionesOrg'); localStorage.removeItem('draft_contratos'); localStorage.removeItem('draft_empresas'); localStorage.removeItem('draft_derechohabientes'); localStorage.removeItem('draft_extras');
    this.personalActual = this.obtenerModeloVacio(); this.contratos = []; this.empresas = []; this.derechohabientes = []; this.contratosEliminados = []; this.empresasEliminadas = []; this.derechohabientesEliminados = [];
    this.tieneOtroEmpleador = false; this.fotoPerfilUrl = null; this.jefeInmediatoSeleccionado = ''; this.proyectoSeleccionadoDesc = ''; this.edadCalculada = null; this.seleccionesOrg = {};
    this.obtenerProximoCodigo();
    this.showSuccessModal('¡Formulario limpiado!', 'Se han borrado los datos ingresados y el borrador.');
  }

  // ==========================================
  // ESTRUCTURA ORGANIZACIONAL (NUEVA LÓGICA DINÁMICA)
  // ==========================================
  actualizarDescripcionesVisuales() {
    if (this.personalActual.proyectoObra && this.catalogos.proyectoObra) {
        const proyecto = this.catalogos.proyectoObra.find((p:any) => p.codigo === this.personalActual.proyectoObra);
        if (proyecto) this.proyectoSeleccionadoDesc = proyecto.descripcion;
    }
    if (this.personalActual.idJefeInmediato && this.empleadosJefe.length > 0) {
        const jefe = this.empleadosJefe.find(j => j.Id === this.personalActual.idJefeInmediato);
        if (jefe) this.jefeInmediatoSeleccionado = jefe.Nombre;
    }
  }

  cargarEstructuraOrganizacional(): void {
    // 1. Cargamos Nombres de las Columnas (Área, Depto, etc)
    this._dataService.doRequestPost('uspNivelOrganizacionalObtenerTodo', { data: {} }).subscribe((res: any) => {
      this.nivelesOrg = Array.isArray(res?.data) ? res.data : [];
      this.nivelesOrg.sort((a, b) => a.Nivel - b.Nivel);
    });

    // 2. Cargamos Nodos Reales
    this._dataService.doRequestPost('uspNodoOrganizacionalObtenerTodo', { data: {} }).subscribe((res: any) => {
      this.nodosOrg = Array.isArray(res?.data) ? res.data : [];
      // Si estamos editando y ya cargó el empleado, armamos el árbol retroactivo
      if (this.personalActual.idNodoOrganizacional) {
        this.reconstruirArbolOrg(this.personalActual.idNodoOrganizacional);
      }
    });
  }

  getOpcionesNivel(nivel: any, index: number): any[] {
    let result = this.nodosOrg.filter(n => n.IdNivelOrganizacional === nivel.Id);
    if (index > 0) {
      const nivelAnterior = this.nivelesOrg[index - 1];
      const padreSeleccionado = this.seleccionesOrg[nivelAnterior.Id];
      if (!padreSeleccionado) return [];
      result = result.filter(n => n.IdPadre === padreSeleccionado);
    } else {
      result = result.filter(n => n.IdPadre === null);
    }
    return result;
  }

  onNivelOrgChange(nivel: any, index: number) {
    // Si cambia un nivel, limpiamos todos los hijos que estén por debajo de él
    for (let i = index + 1; i < this.nivelesOrg.length; i++) {
      this.seleccionesOrg[this.nivelesOrg[i].Id] = null;
    }
  }

  reconstruirArbolOrg(idNodoBase: number) {
    let actualId: number | null = idNodoBase;
    while (actualId) {
      const nodo = this.nodosOrg.find(n => n.Id === actualId);
      if (nodo) {
        this.seleccionesOrg[nodo.IdNivelOrganizacional] = nodo.Id;
        actualId = nodo.IdPadre; // Subimos un nivel en el árbol
      } else {
        break;
      }
    }
  }

  // Encuentra el último nivel seleccionado para guardarlo en la Base de Datos
  obtenerNodoProfundoSeleccionado(): number | null {
    let nodoGuardar = null;
    for (const nivel of this.nivelesOrg) {
      if (this.seleccionesOrg[nivel.Id]) {
        nodoGuardar = this.seleccionesOrg[nivel.Id];
      } else {
        break; // Detener en el primer nivel vacío
      }
    }
    return nodoGuardar;
  }

  // ==========================================
  // GUARDAR DATOS A API
  // ==========================================
  guardarCambios(): void {
    if (!this.esFormularioValido) { this.showErrorModal('Formulario incompleto', 'Debe llenar todos los campos marcados con un asterisco rojo (*).'); return; }

    const isUpdate = !!this.personalActual.Id;
    const endpoint = isUpdate ? 'uspPersonalActualizar' : 'uspPersonalInsertar';

    const payloadData: any = {
      p_CodigoInterno: isUpdate ? (this.personalActual.codigoInterno || '') : '', p_Codigo: isUpdate ? (this.personalActual.codigo || '') : '', p_Avatar: this.personalActual.avatar || '',
      p_TipoDocumento: this.personalActual.tipoDocumento || '', p_NumeroDocumento: this.personalActual.numeroDocumento || '', p_PaisEmisorDocumento: this.personalActual.paisEmisorDocumento || '', p_FechaExpiracionDocumento: this.personalActual.fechaExpiracionDocumento || null,
      p_ApellidoPaterno: this.personalActual.apellidoPaterno || '', p_ApellidoMaterno: this.personalActual.apellidoMaterno || '', p_PrimerNombre: this.personalActual.primerNombre || '', p_SegundoNombre: this.personalActual.segundoNombre || '',
      p_FechaNacimiento: this.personalActual.fechaNacimiento || null, p_Nacionalidad: this.personalActual.nacionalidad || '', p_IndicadorDomiciliado: this.personalActual.indicadorDomiciliado || '', p_Sexo: this.personalActual.sexo || '', p_EstadoCivil: this.personalActual.estadoCivil || '',
      p_GrupoSanguineo: this.personalActual.grupoSanguineo || '', p_EsDonante: this.personalActual.esDonante ? 1 : 0, p_TieneDiscapacidad: this.personalActual.tieneDiscapacidad ? 1 : 0, p_SocioNegocio: this.personalActual.socioNegocio || '',
      p_SituacionTrabajador: this.personalActual.situacionTrabajador || '', p_TipoJornada: this.personalActual.tipoJornada || '', p_TrabajaJornadaMaxima: this.personalActual.trabajaJornadaMaxima ? 1 : 0, p_TrabajoAtipico: this.personalActual.trabajoAtipico ? 1 : 0, p_HorarioNocturno: this.personalActual.horarioNocturno ? 1 : 0,
      p_SituacionEspecial: this.personalActual.situacionEspecial || '', p_ModalidadTrabajo: this.personalActual.modalidadTrabajo || '', p_EsSindicalizado: this.personalActual.esSindicalizado ? 1 : 0, p_AplicaCuotaSindical: this.personalActual.aplicaCuotaSindical ? 1 : 0,
      p_RegimenEssalud: this.personalActual.regimenEssalud || '', p_SaludEps: this.personalActual.saludEps || '', p_TieneEssaludVida: this.personalActual.tieneEssaludVida ? 1 : 0, p_SctrSalud: this.personalActual.sctrSalud || '', p_AporteSctrSalud: this.personalActual.aporteSctrSalud || '',
      p_SctrPension: this.personalActual.sctrPension || '', p_AporteSctrPension: this.personalActual.aporteSctrPension || '', p_DescuentaSenati: this.personalActual.descuentaSenati ? 1 : 0, p_RegimenPensionario: this.personalActual.regimenPensionario || '',
      p_Cuspp: this.personalActual.cuspp || '', p_TipoComisionAfp: this.personalActual.tipoComisionAfp || '', p_EsJubilado: this.personalActual.esJubilado ? 1 : 0, p_UnidadSalarial: this.personalActual.unidadSalarial || '', p_Sueldo: this.personalActual.sueldo || 0,
      p_TieneAsignacionFamiliar: this.personalActual.tieneAsignacionFamiliar ? 1 : 0, p_NetoFijo: this.personalActual.netoFijo || null, p_PeriodicidadRemuneracion: this.personalActual.periodicidadRemuneracion || '', p_TipoMonedaHaberes: this.personalActual.tipoMonedaHaberes || '',
      p_TipoCuentaHaberes: this.personalActual.tipoCuentaHaberes || '', p_FormaPagoHaberes: this.personalActual.formaPagoHaberes || '', p_CuentaBancariaHaberes: this.personalActual.cuentaBancariaHaberes || '', p_CuentaInterbancariaHaberes: this.personalActual.cuentaInterbancariaHaberes || '', p_EntidadFinancieraHaberes: this.personalActual.entidadFinancieraHaberes || '',
      p_FormaPagoCts: this.personalActual.formaPagoCts || '', p_TipoMonedaCts: this.personalActual.tipoMonedaCts || '', p_TipoCuentaCts: this.personalActual.tipoCuentaCts || '', p_EntidadFinancieraCts: this.personalActual.entidadFinancieraCts || '', p_CuentaBancariaCts: this.personalActual.cuentaBancariaCts || '', p_CuentaInterbancariaCts: this.personalActual.cuentaInterbancariaCts || '',
      p_Exoneracion5ta: this.personalActual.exoneracion5ta ? 1 : 0, p_TieneCertificado5ta: this.personalActual.tieneCertificado5ta ? 1 : 0, p_TotalRentas: this.personalActual.totalRentas || null, p_ImpuestoRetenido: this.personalActual.impuestoRetenido || null, p_DobleTributacion: this.personalActual.dobleTributacion || '',
      p_TipoNominaRia: this.personalActual.tipoNominaRia || '', p_GrupoNomina: this.personalActual.grupoNomina || '', p_CategoriaPlame: this.personalActual.categoriaPlame || '', p_CategoriaOcupacional: this.personalActual.categoriaOcupacional || '', p_Cargo: this.personalActual.cargo || '', p_FechaAsignacionCargo: this.personalActual.fechaAsignacionCargo || null, p_Ocupacion: this.personalActual.ocupacion || '', p_ProyectoObra: this.personalActual.proyectoObra || '', p_LugarTrabajo: this.personalActual.lugarTrabajo || '', p_LugarPago: this.personalActual.lugarPago || '',

      p_IdNodoOrganizacional: this.obtenerNodoProfundoSeleccionado(), // SE GUARDA EL ÚLTIMO NODO VÁLIDO SELECCIONADO

      p_IdJefeInmediato: this.personalActual.idJefeInmediato || null, p_SituacionEducativa: this.personalActual.situacionEducativa || '', p_FormacionSuperiorCompleta: this.personalActual.formacionSuperiorCompleta || '', p_IndicadorEducacionCompletaPeru: this.personalActual.indicadorEducacionCompletaPeru ? 1 : 0, p_CodigoInstitucionEducativa: this.personalActual.codigoInstitucionEducativa || '', p_CodigoCarrera: this.personalActual.codigoCarrera || '', p_AnioEgreso: this.personalActual.anioEgreso || null,
      p_TelefonoCasa: this.personalActual.telefonoCasa || '', p_TelefonoMovil: this.personalActual.telefonoMovil || '', p_TelefonoOficina: this.personalActual.telefonoOficina || '', p_Anexo: this.personalActual.anexo || '', p_EmailPersonal: this.personalActual.emailPersonal || '', p_EmailTrabajo: this.personalActual.emailTrabajo || '',
      p_DireccionCompleta: this.personalActual.direccionCompleta || '', p_TipoVia: this.personalActual.tipoVia || '', p_NombreVia: this.personalActual.nombreVia || '', p_NumeroVia: this.personalActual.numeroVia || '', p_DepartamentoInmueble: this.personalActual.departamentoInmueble || '', p_ProvinciaInmueble: this.personalActual.provinciaInmueble || '', p_Interior: this.personalActual.interior || '', p_Manzana: this.personalActual.manzana || '', p_Lote: this.personalActual.lote || '', p_Kilometro: this.personalActual.kilometro || '', p_Block: this.personalActual.block || '', p_Etapa: this.personalActual.etapa || '', p_TipoZona: this.personalActual.tipoZona || '', p_NombreZona: this.personalActual.nombreZona || '', p_Referencia: this.personalActual.referencia || '', p_PaisResidencia: this.personalActual.paisResidencia || '', p_Ubigeo: this.personalActual.ubigeo || '', p_CategoriaConstruccionCivil: this.personalActual.categoriaConstruccionCivil || '', p_EspecialidadConstruccionCivil: this.personalActual.especialidadConstruccionCivil || '', p_TieneMovilidad: this.personalActual.tieneMovilidad ? 1 : 0, p_TieneAfpLey27252: this.personalActual.tieneAfpLey27252 ? 1 : 0, p_TieneAptFcjmms: this.personalActual.tieneAptFcjmms ? 1 : 0,
      p_IdUsuarioActual: 1
    };

    if (isUpdate) payloadData.p_Id = this.personalActual.Id;

    this._dataService.doRequestPost(endpoint, { data: payloadData }).subscribe({
      next: (res: any) => {
        if(!this.personalActual.Id && res?.data?.length > 0) this.personalActual.Id = res.data[0].IdPersonal;

        // El resto del guardado hijo (Contratos, OtroEmpleador, Derechohabientes) queda idéntico
        const idPers = this.personalActual.Id; const pMulti: any[] = [];
        this.contratos.forEach(c => { const pData = { p_IdPersonal: idPers, p_TipoTrabajador: c.tipoTrabajador || '', p_RegimenLaboral: c.regimenLaboral || '', p_TipoContrato: c.tipoContrato || '', p_MotivoContratacion: c.motivoContratacion || '', p_FechaInicio: c.fechaInicio || null, p_EsIndeterminado: c.indeterminado ? 1 : 0, p_Meses: c.meses || null, p_FechaFin: c.fechaFin || null, p_HorasJornada: c.horasJornada || 0, p_HorasMensuales: c.horasMensuales || 0, p_IdUsuarioActual: 1 }; if (c.IdContrato) { pMulti.push(this._dataService.doRequestPost('uspPersonalContratoActualizar', { data: { p_Id: c.IdContrato, ...pData } })); } else { pMulti.push(this._dataService.doRequestPost('uspPersonalContratoInsertar', { data: pData })); } }); this.contratosEliminados.forEach(id => { pMulti.push(this._dataService.doRequestPost('uspPersonalContratoEliminar', { data: { p_Id: id, p_IdUsuarioActual: 1 } })); });
        this.empresas.forEach(e => { const pData = { p_IdPersonal: idPers, p_Empresa: e.empresa || '', p_FechaInicio: e.fechaInicio || null, p_FechaFin: e.fechaFin || null, p_Moneda: e.moneda || '', p_Sueldo: e.sueldo || 0, p_AplicaImpuesto5ta: e.imp5ta ? 1 : 0, p_Comentario: e.comentario || '', p_IdUsuarioActual: 1 }; if (e.IdOtroEmpleador) { pMulti.push(this._dataService.doRequestPost('uspPersonalOtroEmpleadorActualizar', { data: { p_Id: e.IdOtroEmpleador, ...pData } })); } else { pMulti.push(this._dataService.doRequestPost('uspPersonalOtroEmpleadorInsertar', { data: pData })); } }); this.empresasEliminadas.forEach(id => { pMulti.push(this._dataService.doRequestPost('uspPersonalOtroEmpleadorEliminar', { data: { p_Id: id, p_IdUsuarioActual: 1 } })); });
        this.derechohabientes.forEach(d => { const pData = { p_IdPersonal: idPers, p_TipoDocumento: d.tipoDocumento || '', p_NumeroDocumento: d.numeroDocumento || null, p_PaisEmisor: d.paisEmisor || null, p_Apellidos: d.apellidos || '', p_Nombres: d.nombres || '', p_FechaNacimiento: d.fechaNacimiento || null, p_Sexo: d.sexo || null, p_VinculoFamiliar: d.vinculoFamiliar || '', p_TipoDocumentoVinculo: d.tipoDocumentoVinculo || null, p_NumeroDocumentoVinculo: d.numeroDocumentoVinculo || null, p_FechaAlta: d.fechaAlta || null, p_TieneEstudiosActivos: d.estudiosActivos ? 1 : 0, p_Direccion: d.direccion || null, p_TipoVia: d.tipoVia || null, p_NombreVia: d.nombreVia || null, p_NumeroVia: d.numeroVia || null, p_DepartamentoUbicacion: d.departamentoUbicacion || null, p_Provincia: d.provincia || null, p_Interior: d.interior || null, p_Manzana: d.manzana || null, p_Lote: d.lote || null, p_Kilometro: d.kilometro || null, p_Block: d.block || null, p_Etapa: d.etapa || null, p_TipoZona: d.tipoZona || null, p_NombreZona: d.nombreZona || null, p_Referencia: d.referencia || null, p_Pais: d.pais || null, p_Ubigeo: d.distrito || d.ubigeo || null, p_CodigoCiudad: d.codigoCiudad || null, p_Telefono: d.telefono || null, p_Email: d.email || null, p_IdUsuarioActual: 1 }; if (d.IdDerechohabiente) { pMulti.push(this._dataService.doRequestPost('uspPersonalDerechohabienteActualizar', { data: { p_Id: d.IdDerechohabiente, ...pData } })); } else { pMulti.push(this._dataService.doRequestPost('uspPersonalDerechohabienteInsertar', { data: pData })); } }); this.derechohabientesEliminados.forEach(id => { pMulti.push(this._dataService.doRequestPost('uspPersonalDerechohabienteEliminar', { data: { p_Id: id, p_IdUsuarioActual: 1 } })); });

        if (pMulti.length > 0) { forkJoin(pMulti).subscribe({ next: () => this.finalizarGuardado(isUpdate), error: (err) => { console.error('Error guardando listas:', err); this.finalizarGuardado(isUpdate); } }); } else { this.finalizarGuardado(isUpdate); }
      },
      error: (err) => { console.error('Error:', err); this.showErrorModal('Error', 'Problema al intentar guardar el empleado.'); }
    });
  }

  // Las funciones utilitarias y modales siguen aquí (abreviadas para mantenerte enfocado en los cambios)
  finalizarGuardado(isUpdate: boolean): void { this.limpiarTodo(); this.showSuccessModal('¡Guardado!', 'Actualizado correctamente.'); setTimeout(() => { this.router.navigate([isUpdate ? '../../maestro-empleado-list' : '../maestro-empleado-list'], { relativeTo: this.route }); }, 1500); }
  showSuccessModal(title: string, message: string): void { this.successTitle = title; this.successMessage = message; this.isSuccessModalOpen = true; setTimeout(() => { this.closeSuccessModal(); }, 2500); }
  closeSuccessModal(): void { this.isSuccessModalOpen = false; }
  showErrorModal(title: string, message: string): void { this.errorTitle = title; this.errorMessage = message; this.isErrorModalOpen = true; }
  closeErrorModal(): void { this.isErrorModalOpen = false; }

  // ... (Siguen intactas las funciones del resto de modales, foto, data general, etc)
  obtenerDataGeneral(): void {
    this._dataService.doRequestPost('uspMainDataObtenerGeneral', { data: null }).subscribe({
      next: (res: any) => {
        const data = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        const dataBD: any = {};
        const catalogosDesdeBD = ['grupoNomina', 'categoriaPlame', 'tipoTrabajador', 'regimenLaboral', 'tipoContrato', 'motivoContratacion', 'tipoJornada', 'situacionEspecial', 'regimenEssalud', 'saludEps', 'regimenPensionario', 'dobleTributacion', 'tipoNominaRia', 'proyectoObra', 'situacionEducativa', 'entidadFinanciera', 'empresasExternas', 'aporteSctrSalud', 'aporteSctrPension', 'especialidadCtc', 'categoriaOcupacional', 'lugarTrabajo', 'lugarPago', 'ocupacion', 'cargo', 'situacionTrabajador', 'tipoCuenta', 'sctrSalud', 'sctrPension', 'tipoDocumento', 'estadoCivil', 'grupoSanguineo', 'formacionSuperiorCompleta', 'vinculosFamiliares', 'indicadorDomiciliado', 'tipoVia', 'tipoZona', 'tipoMoneda', 'sexo', 'modalidadTrabajo', 'tipoComision', 'unidadSalarial', 'formaPagoHaberes', 'periodicidadRemuneracion', 'categoriaCtc'];
        data.forEach((item: any) => { if (item.Tipo) { const palabras = item.Tipo.trim().toLowerCase().split(' ').filter((p: string) => p !== ''); if (palabras.length > 0) { const key = palabras[0] + palabras.slice(1).map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(''); if (catalogosDesdeBD.includes(key)) { if (!dataBD[key]) { dataBD[key] = []; } dataBD[key].push({ codigo: item.Codigo, descripcion: item.Descripcion, id: item.Id }); } } } });
        this.catalogos = { ...this.catalogos, ...dataBD };
        this.actualizarDescripcionesVisuales();
      }
    });
  }

  cargarEmpleadosJefe(): void { this._dataService.doRequestPost('uspPersonalObtenerTodo', { data: {} }).subscribe({ next: (res: any) => { this.empleadosJefe = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []); } }); }
  onPaisChange() { this.departamentosResidencia = []; this.provinciasResidencia = []; this.distritosResidencia = []; const pais = this.paisesResidencia.find(p => p.ubigeo === this.personalActual.paisResidencia); if (pais && pais.children) { this.departamentosResidencia = Object.keys(pais.children).map(k => ({ id: k, ...pais.children[k] })); } }
  onDepartamentoChange() { this.provinciasResidencia = []; this.distritosResidencia = []; const dep = this.departamentosResidencia.find(d => d.id === this.personalActual.departamentoInmueble); if (dep && dep.children) { this.provinciasResidencia = Object.keys(dep.children).map(k => ({ id: k, ...dep.children[k] })); } }
  onProvinciaChange() { this.distritosResidencia = []; const prov = this.provinciasResidencia.find(p => p.id === this.personalActual.provinciaInmueble); if (prov && prov.children) { this.distritosResidencia = Object.keys(prov.children).map(k => ({ id: k, ...prov.children[k] })); } }
  calcularEdad(event: any): void { const valor = event?.target?.value || event; if (!valor) { this.edadCalculada = null; return; } const [y, m, d] = valor.split('T')[0].split('-').map(Number); const fechaNacimiento = new Date(y, m - 1, d); if (!isNaN(fechaNacimiento.getTime())) { const hoy = new Date(); let edad = hoy.getFullYear() - fechaNacimiento.getFullYear(); const mesDiff = hoy.getMonth() - fechaNacimiento.getMonth(); if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < fechaNacimiento.getDate())) { edad--; } this.edadCalculada = edad; } else { this.edadCalculada = null; } }
  onFileSelected(event: any): void { const file = event.target.files[0]; if (file) { this.selectedFile = file; const reader = new FileReader(); reader.onload = (e) => { this.fotoPerfilUrl = e.target?.result || null; }; reader.readAsDataURL(file); this.subirFoto(); } }
  subirFoto(): void { if (!this.selectedFile) return; this.isUploadingFile = true; this._dataService.uploadFile(this.selectedFile).subscribe({ next: (res) => { if (res.status && res.data) { this.baseCodeFile = res.data.baseCodeFile; this.personalActual.avatar = this.baseCodeFile; } this.isUploadingFile = false; }, error: (err) => { this.isUploadingFile = false; this.showErrorModal('Error al cargar', 'No se pudo subir la foto de perfil al servidor.'); } }); }
  descargarFoto(baseCode: string): void { this._dataService.downloadFile(baseCode).subscribe({ next: (res) => { if (res.data && res.data.bytesFile) { const extension = res.data.extension.replace('.', ''); this.fotoPerfilUrl = `data:image/${extension};base64,${res.data.bytesFile}`; } } }); }
  cambiarSeccion(id: string): void { this.seccionActiva = id; }
  getDescripcion(catalogoNombre: string, codigo: string): string { const catalogo = (this.catalogos as any)[catalogoNombre]; if (!catalogo) return codigo; const item = catalogo.find((x: any) => x.codigo === codigo); return item ? item.descripcion : codigo; }
  abrirModalJefe() { this.modalJefeAbierto = true; } cerrarModalJefe() { this.modalJefeAbierto = false; } seleccionarJefe(emp: any) { this.jefeInmediatoSeleccionado = emp.Nombre; this.personalActual.idJefeInmediato = emp.Id; this.cerrarModalJefe(); } get empleadosJefeFiltrados() { const filtrados = this.empleadosJefe.filter(e => e.Nombre?.toLowerCase().includes(this.busquedaJefe.toLowerCase()) || e.Id?.toString().includes(this.busquedaJefe)); const inicio = (this.paginaActualJefe - 1) * this.itemsPorPaginaJefe; return filtrados.slice(inicio, inicio + this.itemsPorPaginaJefe); } get totalPaginasJefe() { return Math.ceil(this.empleadosJefe.filter(e => e.Nombre?.toLowerCase().includes(this.busquedaJefe.toLowerCase()) || e.Id?.toString().includes(this.busquedaJefe)).length / this.itemsPorPaginaJefe) || 1; } paginaAnteriorJefe() { if (this.paginaActualJefe > 1) this.paginaActualJefe--; } paginaSiguienteJefe() { if (this.paginaActualJefe < this.totalPaginasJefe) this.paginaActualJefe++; }
  abrirModalProyecto() { this.modalProyectoAbierto = true; } cerrarModalProyecto() { this.modalProyectoAbierto = false; } seleccionarProyecto(proy: any) { this.proyectoSeleccionadoDesc = proy.descripcion; this.personalActual.proyectoObra = proy.codigo; this.cerrarModalProyecto(); }
  abrirModalContrato() { this.contratoActual = {}; this.editandoContratoIndex = -1; this.modalContratoAbierto = true; } cerrarModalContrato() { this.modalContratoAbierto = false; } registrarContrato() { if (this.editandoContratoIndex > -1) { this.contratos[this.editandoContratoIndex] = { ...this.contratoActual }; } else { this.contratos.push({ ...this.contratoActual }); } this.cerrarModalContrato(); } editarContrato(i: number) { this.editandoContratoIndex = i; this.contratoActual = { ...this.contratos[i] }; this.modalContratoAbierto = true; } eliminarContrato(i: number) { const id = this.contratos[i].IdContrato; if (id) this.contratosEliminados.push(id); this.contratos.splice(i, 1); }
  calcularFechaFin() { if (this.contratoActual.fechaInicio && this.contratoActual.meses) { const [y, m, d] = this.contratoActual.fechaInicio.split('-').map(Number); const f = new Date(y, m - 1 + this.contratoActual.meses, d); this.contratoActual.fechaFin = `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, '0')}-${String(f.getDate()).padStart(2, '0')}`; } }
  abrirModalEmpresa() { this.empresaActual = {}; this.editandoEmpresaIndex = -1; this.modalEmpresaAbierta = true; } cerrarModalEmpresa() { this.modalEmpresaAbierta = false; } registrarEmpresa() { if (this.editandoEmpresaIndex > -1) { this.empresas[this.editandoEmpresaIndex] = { ...this.empresaActual }; } else { this.empresas.push({ ...this.empresaActual }); } this.cerrarModalEmpresa(); } editarEmpresa(i: number) { this.editandoEmpresaIndex = i; this.empresaActual = { ...this.empresas[i] }; this.modalEmpresaAbierta = true; } eliminarEmpresa(i: number) { const id = this.empresas[i].IdOtroEmpleador; if (id) this.empresasEliminadas.push(id); this.empresas.splice(i, 1); }
  cambiarTabDerechohabiente(t: string) { this.tabDerechohabienteActivo = t; }
  obtenerProximoCodigo(): void { if (!this.personalActual.Id) { this._dataService.doRequestPost('uspPersonalObtenerProximoCodigo', { data: {} }).subscribe({ next: (res: any) => { const data = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []); if (data.length > 0) { this.personalActual.codigoInterno = data[0].CodigoInterno?.toString() || ''; this.personalActual.codigo = data[0].Codigo || ''; } } }); } }

   abrirModalDerechohabiente() {
    this.derechohabienteActual = {
      tipoDocumento: '', numeroDocumento: '', paisEmisor: '', apellidos: '', nombres: '', fechaNacimiento: '', sexo: '', vinculoFamiliar: '', tipoDocumentoVinculo: '', numeroDocumentoVinculo: '', fechaAlta: '', estudiosActivos: false, direccion: '', tipoVia: '', nombreVia: '', numeroVia: '', departamentoUbicacion: '', interior: '', manzana: '', lote: '', kilometro: '', block: '', etapa: '', tipoZona: '', nombreZona: '', referencia: '', pais: '', departamento: '', provincia: '', distrito: '', codigoCiudad: '', telefono: '', email: ''
    };
    this.departamentosDerecho = [];
    this.provinciasDerecho = [];
    this.distritosDerecho = [];
    this.editandoDerechoIndex = -1;
    this.tabDerechohabienteActivo = 'personales';
    this.modalDerechohabienteAbierto = true;
  }

  cerrarModalDerechohabiente() { this.modalDerechohabienteAbierto = false; }

  registrarDerechohabiente() {
    if (this.editandoDerechoIndex > -1) {
      this.derechohabientes[this.editandoDerechoIndex] = { ...this.derechohabienteActual };
    } else {
      this.derechohabientes.push({ ...this.derechohabienteActual });
    }
    this.cerrarModalDerechohabiente();
  }

  editarDerechohabiente(i: number) {
    this.editandoDerechoIndex = i;
    this.derechohabienteActual = { ...this.derechohabientes[i] };

    // Tomar solo el dato del ubigeo real (no el del Nro de Dpto del inmueble)
    this.derechohabienteActual.departamento = this.derechohabientes[i].departamento || '';
    this.derechohabienteActual.distrito = this.derechohabientes[i].distrito || this.derechohabientes[i].ubigeo || '';

    if (this.derechohabienteActual.pais) {
      this.onPaisDerechoChange();

      // Autocompletar departamento y provincia desde distrito si faltan
      if (!this.derechohabienteActual.departamento && this.derechohabienteActual.distrito) {
        for (const dep of this.departamentosDerecho) {
          if (dep.children) {
            const provs = Object.keys(dep.children).map(k => ({ id: k, ...dep.children[k] }));
            const foundProv = provs.find(p => p.children && p.children[this.derechohabienteActual.distrito]);
            if (foundProv) { this.derechohabienteActual.departamento = dep.id; break; }
          }
        }
      }
    }

    if (this.derechohabienteActual.departamento) {
      this.onDepartamentoDerechoChange();

      if (!this.derechohabienteActual.provincia && this.derechohabienteActual.distrito) {
        const prov = this.provinciasDerecho.find(p => p.children && p.children[this.derechohabienteActual.distrito]);
        if (prov) {
          this.derechohabienteActual.provincia = prov.id;
        }
      }
    }

    if (this.derechohabienteActual.provincia) {
      this.onProvinciaDerechoChange();
    }

    this.tabDerechohabienteActivo = 'personales';
    this.modalDerechohabienteAbierto = true;
  }

  eliminarDerechohabiente(i: number) {
    const id = this.derechohabientes[i].IdDerechohabiente;
    if (id) this.derechohabientesEliminados.push(id);
    this.derechohabientes.splice(i, 1);
  }

  onPaisDerechoChange() {
    this.departamentosDerecho = [];
    this.provinciasDerecho = [];
    this.distritosDerecho = [];
    if (!this.derechohabienteActual.pais) return;
    const pais = this.paisesResidencia.find(p => p.ubigeo === this.derechohabienteActual.pais);
    if (pais && pais.children) {
      this.departamentosDerecho = Object.keys(pais.children).map(k => ({ id: k, ...pais.children[k] }));
    }
  }

  onDepartamentoDerechoChange() {
    this.provinciasDerecho = [];
    this.distritosDerecho = [];
    if (!this.derechohabienteActual.departamento) return;
    const dep = this.departamentosDerecho.find(d => d.id === this.derechohabienteActual.departamento);
    if (dep && dep.children) {
      this.provinciasDerecho = Object.keys(dep.children).map(k => ({ id: k, ...dep.children[k] }));
    }
  }

  onProvinciaDerechoChange() {
    this.distritosDerecho = [];
    if (!this.derechohabienteActual.provincia) return;
    const prov = this.provinciasDerecho.find(p => p.id === this.derechohabienteActual.provincia);
    if (prov && prov.children) {
      this.distritosDerecho = Object.keys(prov.children).map(k => ({ id: k, ...prov.children[k] }));
    }
  }

}
