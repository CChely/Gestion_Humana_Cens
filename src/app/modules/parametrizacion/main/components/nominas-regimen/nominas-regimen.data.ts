export interface RegimenLaboral {
  CONTRACTUALES_ID: number;
  MAESTRA_ID: number;
  CODIGO: string | null;
  DESCRIPCION: string;
  ABREVIATURA?: string | null;
  PADRE_ID?: number | null;
  PADREKey?: string | null;
  MAESTRACODIGO?: string | null;
  MAESTRAKey?: string | null;
  CONTRACTUALESKey?: string | null;
  CONTRACTUAL_ID?: number | null;
  MAESTRAPERSONAL?: any;
  ListaContractuales?: any;
  FUNCIONES_PRINCIPALES?: any;
  SerialKey?: string | null;
  ESTADO?: string | null;
  USUARIO_REG?: string | null;
  FECHA_REG?: string | null;
  USUARIO_ACT?: string | null;
  FECHA_ACT?: string | null;
  FILTRO?: any;
  FLG_MASIVO?: boolean;
  FLG_MEMORIA?: boolean;
  FLG_MODIFICADO?: boolean;
  PageSize?: number;
  PageNumber?: number;
  TotalPage?: number;
}

export interface Plame {
  CONTRACTUALES_ID: number;
  MAESTRA_ID: number;
  CODIGO: string | null;
  DESCRIPCION: string;
  ABREVIATURA?: string | null;
  PADRE_ID?: number | null;
  PADREKey?: string | null;
  MAESTRACODIGO?: string | null;
  MAESTRAKey?: string | null;
  CONTRACTUALESKey?: string | null;
  CONTRACTUAL_ID?: number | null;
  MAESTRAPERSONAL?: any;
  ListaContractuales?: any;
  FUNCIONES_PRINCIPALES?: any;
  SerialKey?: string | null;
  ESTADO?: string | null;
  USUARIO_REG?: string | null;
  FECHA_REG?: string | null;
  USUARIO_ACT?: string | null;
  FECHA_ACT?: string | null;
  FILTRO?: any;
  FLG_MASIVO?: boolean;
  FLG_MEMORIA?: boolean;
  FLG_MODIFICADO?: boolean;
  PageSize?: number;
  PageNumber?: number;
  TotalPage?: number;
}

export interface TipoTrabajador {
  CONTRACTUALES_ID: number;
  MAESTRA_ID: number;
  CODIGO: string | null;
  DESCRIPCION: string;
  ABREVIATURA?: string | null;
  PADRE_ID?: number | null;
  PADREKey?: string | null;
  MAESTRACODIGO?: string | null;
  MAESTRAKey?: string | null;
  CONTRACTUALESKey?: string | null;
  CONTRACTUAL_ID?: number | null;
  MAESTRAPERSONAL?: any;
  ListaContractuales?: any;
  FUNCIONES_PRINCIPALES?: any;
  SerialKey?: string | null;
  ESTADO?: string | null;
  USUARIO_REG?: string | null;
  FECHA_REG?: string | null;
  USUARIO_ACT?: string | null;
  FECHA_ACT?: string | null;
  FILTRO?: any;
  FLG_MASIVO?: boolean;
  FLG_MEMORIA?: boolean;
  FLG_MODIFICADO?: boolean;
  PageSize?: number;
  PageNumber?: number;
  TotalPage?: number;
}

export interface NominaSubDetalle {
  id: number;
  descripcion: string;
  checked: boolean;
  activo: boolean;
}

export interface NominasRegimen {
  TIPOSPLANILLA_ID: number;
  REGIMENLABORAL_ID: number | null;
  PLAME_ID: number | null;
  ALIAS: string;
  FLG_TRABAJADOR: number;
  FLG_ESTADO: boolean;
  FLG_ESTADO_DESC: 'Activo' | 'Inactivo';
  NUM_ORDEN: number | null;
  REGIMENLABORALKey: string;
  PLAMEKey: string;
  TIPOSPLANILLADETALLEKey: string | null;
  REGIMENLABORAL: RegimenLaboral;
  PLAME: Plame;
  TIPOTRABAJADOR: TipoTrabajador;
  TIPOSPLANILLADETALLE: any;
  ListaRegimenLaborales: any;
  ListaPlames: any;
  ListaTipoTrabajador: any;
  ListaEstadoTiposPlanilla: any;
  ListaTiposPlanillaDetalle: any;
  SerialKey: string;
  ESTADO: string;
  USUARIO_REG: string;
  FECHA_REG: string;
  USUARIO_ACT: string;
  FECHA_ACT: string;
  FILTRO: any;
  FLG_MASIVO: boolean;
  FLG_MEMORIA: boolean;
  FLG_MODIFICADO: boolean;
  PageSize: number;
  PageNumber: number;
  TotalPage: number;
  
  // Custom checklist stored inside the item for demo purposes
  subNominas?: NominaSubDetalle[];
}

export interface MasterDataItem {
  Id: number;
  Tipo: 'Regimen Laboral' | 'Categoria Plame' | 'Tipo Trabajador' | string;
  Codigo: string | null;
  Descripcion: string;
}

// Mock dynamic Master Data uspMainDataObtenerGeneral response
export const MASTER_DATA_COLLECTION: MasterDataItem[] = [
  // Regímenes Laborales
  { Id: 36, Tipo: 'Regimen Laboral', Codigo: '21', Descripcion: 'CONSTRUCCION CIVIL' },
  { Id: 33, Tipo: 'Regimen Laboral', Codigo: '18', Descripcion: 'AGRARIO LEY 27360' },
  { Id: 39, Tipo: 'Regimen Laboral', Codigo: '01', Descripcion: 'PRIVADO GENERAL -DECRETO LEGISLATIVO N.° 728' },
  { Id: 34, Tipo: 'Regimen Laboral', Codigo: '19', Descripcion: 'EXPORTACION NO TRADICIONAL D. LEY 22342' },
  { Id: 35, Tipo: 'Regimen Laboral', Codigo: '20', Descripcion: 'MINERO Y METALURGICO D.S. 030-89-TR' },
  
  // Categoría PLAME
  { Id: 129, Tipo: 'Categoria Plame', Codigo: '1', Descripcion: 'Trabajador' },
  { Id: 130, Tipo: 'Categoria Plame', Codigo: '5', Descripcion: 'Modalidad formativa' },
  { Id: 128, Tipo: 'Categoria Plame', Codigo: '2', Descripcion: 'Pensionista' },
  { Id: 131, Tipo: 'Categoria Plame', Codigo: '4', Descripcion: 'Personal en Formacion' },
  
  // Tipo Trabajador
  { Id: 21, Tipo: 'Tipo Trabajador', Codigo: null, Descripcion: 'Colaborador regular' },
  { Id: 22, Tipo: 'Tipo Trabajador', Codigo: null, Descripcion: 'Practicante' },
  { Id: 23, Tipo: 'Tipo Trabajador', Codigo: null, Descripcion: 'Trabajador del régimen agrario' },
  { Id: 24, Tipo: 'Tipo Trabajador', Codigo: null, Descripcion: 'Personal de dirección' }
];

export const NOMINAS_REGIMEN_PAGINADO_DATA: NominasRegimen[] = [
  {
    TIPOSPLANILLA_ID: 0,
    REGIMENLABORAL_ID: null,
    PLAME_ID: null,
    ALIAS: 'CONST_CIVIL',
    FLG_TRABAJADOR: 0,
    FLG_ESTADO: false,
    FLG_ESTADO_DESC: 'Inactivo',
    NUM_ORDEN: null,
    REGIMENLABORALKey: 'T0qRGmswxS_xUPLi1jmigA..',
    PLAMEKey: 'QWLL_6-Mtk_DdjMZTjxDWA..',
    TIPOSPLANILLADETALLEKey: null,
    REGIMENLABORAL: {
      CONTRACTUALES_ID: 0,
      MAESTRA_ID: 0,
      CODIGO: '21',
      DESCRIPCION: 'CONSTRUCCION CIVIL'
    },
    PLAME: {
      CONTRACTUALES_ID: 0,
      MAESTRA_ID: 0,
      CODIGO: '1',
      DESCRIPCION: 'Trabajador'
    },
    TIPOTRABAJADOR: {
      CONTRACTUALES_ID: 0,
      MAESTRA_ID: 0,
      CODIGO: null,
      DESCRIPCION: 'Colaborador regular'
    },
    TIPOSPLANILLADETALLE: null,
    ListaRegimenLaborales: null,
    ListaPlames: null,
    ListaTipoTrabajador: null,
    ListaEstadoTiposPlanilla: null,
    ListaTiposPlanillaDetalle: null,
    SerialKey: 'SXnXjGS2qspSCC0sH-tfHg..',
    ESTADO: 'A',
    USUARIO_REG: 'sujeyp',
    FECHA_REG: '/Date(1711487069000)/',
    USUARIO_ACT: 'jmendoza',
    FECHA_ACT: '/Date(1769441879000)/',
    FILTRO: null,
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 3,
    subNominas: [
      { id: 1, descripcion: 'Construcción Civil', checked: true, activo: true },
      { id: 2, descripcion: 'Construcción Civil LBS', checked: true, activo: false },
      { id: 3, descripcion: 'Construcción Civil Retroactiva', checked: true, activo: false },
      { id: 4, descripcion: 'Construcción Civil sb', checked: true, activo: false }
    ]
  },
  {
    TIPOSPLANILLA_ID: 0,
    REGIMENLABORAL_ID: null,
    PLAME_ID: null,
    ALIAS: 'PRACTICANTES',
    FLG_TRABAJADOR: 1,
    FLG_ESTADO: true,
    FLG_ESTADO_DESC: 'Activo',
    NUM_ORDEN: null,
    REGIMENLABORALKey: 'AkOfQvPTdp873bFNoOjT9A..',
    PLAMEKey: 'DQufS-M8VJN3Ug4SFg-hxg..',
    TIPOSPLANILLADETALLEKey: null,
    REGIMENLABORAL: {
      CONTRACTUALES_ID: 0,
      MAESTRA_ID: 0,
      CODIGO: '01',
      DESCRIPCION: 'PRIVADO GENERAL -DECRETO LEGISLATIVO N.° 728'
    },
    PLAME: {
      CONTRACTUALES_ID: 0,
      MAESTRA_ID: 0,
      CODIGO: '5',
      DESCRIPCION: 'Modalidad formativa'
    },
    TIPOTRABAJADOR: {
      CONTRACTUALES_ID: 0,
      MAESTRA_ID: 0,
      CODIGO: null,
      DESCRIPCION: 'Practicante'
    },
    TIPOSPLANILLADETALLE: null,
    ListaRegimenLaborales: null,
    ListaPlames: null,
    ListaTipoTrabajador: null,
    ListaEstadoTiposPlanilla: null,
    ListaTiposPlanillaDetalle: null,
    SerialKey: '9k5Syc2rXHAH_a3TIPzSHQ..',
    ESTADO: 'A',
    USUARIO_REG: 'mcasapia',
    FECHA_REG: '/Date(1681849211000)/',
    USUARIO_ACT: 'jmendoza',
    FECHA_ACT: '/Date(1773690790000)/',
    FILTRO: null,
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 3,
    subNominas: [
      { id: 1, descripcion: 'Practicas Pre-Profesionales', checked: true, activo: true },
      { id: 2, descripcion: 'Practicas Profesionales', checked: true, activo: false },
      { id: 3, descripcion: 'Subvención de Capacitación', checked: false, activo: false }
    ]
  },
  {
    TIPOSPLANILLA_ID: 0,
    REGIMENLABORAL_ID: null,
    PLAME_ID: null,
    ALIAS: 'REGIMENGENERAL',
    FLG_TRABAJADOR: 0,
    FLG_ESTADO: true,
    FLG_ESTADO_DESC: 'Activo',
    NUM_ORDEN: null,
    REGIMENLABORALKey: 'AkOfQvPTdp873bFNoOjT9A..',
    PLAMEKey: 'QWLL_6-Mtk_DdjMZTjxDWA..',
    TIPOSPLANILLADETALLEKey: null,
    REGIMENLABORAL: {
      CONTRACTUALES_ID: 0,
      MAESTRA_ID: 0,
      CODIGO: '01',
      DESCRIPCION: 'PRIVADO GENERAL -DECRETO LEGISLATIVO N.° 728'
    },
    PLAME: {
      CONTRACTUALES_ID: 0,
      MAESTRA_ID: 0,
      CODIGO: '1',
      DESCRIPCION: 'Trabajador'
    },
    TIPOTRABAJADOR: {
      CONTRACTUALES_ID: 0,
      MAESTRA_ID: 0,
      CODIGO: null,
      DESCRIPCION: 'Colaborador regular'
    },
    TIPOSPLANILLADETALLE: null,
    ListaRegimenLaborales: null,
    ListaPlames: null,
    ListaTipoTrabajador: null,
    ListaEstadoTiposPlanilla: null,
    ListaTiposPlanillaDetalle: null,
    SerialKey: 'h6j62A5z-QNzZKwThBKuAQ..',
    ESTADO: 'A',
    USUARIO_REG: 'sys',
    FECHA_REG: '/Date(1632585156000)/',
    USUARIO_ACT: 'sujeyp',
    FECHA_ACT: '/Date(1719006132000)/',
    FILTRO: null,
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 3,
    subNominas: [
      { id: 1, descripcion: 'Régimen General DL 728', checked: true, activo: true },
      { id: 2, descripcion: 'Régimen General DL 728 LBS', checked: true, activo: false },
      { id: 3, descripcion: 'Régimen General DL 728 Retroactiva', checked: false, activo: false }
    ]
  }
];
