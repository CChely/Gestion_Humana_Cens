export interface Periodo {
  PERIODO_ID: number;
  DESCRIPCION: string;
  PERIODO_DESDE: string;
  PERIODO_HASTA: string;
  FLG_MASIVO: boolean;
  FLG_MEMORIA: boolean;
  FLG_MODIFICADO: boolean;
  PageSize: number;
  PageNumber: number;
  TotalPage: number;
}

export interface RegimenPensionario {
  REMUNERATIVOS_ID: number;
  MAESTRA_ID: number;
  CODIGO: string;
  DESCRIPCION: string;
  MAESTRACODIGO?: string | null;
  MAESTRAKey?: string | null;
  MAESTRAPERSONAL?: any;
  SOCIO_NEGOCIO?: any;
  REMUNERATIVOS_IDs?: any;
  FLG_ACTIVO: boolean;
  SerialKey?: string | null;
  ESTADO?: string | null;
  USUARIO_REG?: string | null;
  FECHA_REG?: string | null;
  USUARIO_ACT?: string | null;
  FECHA_ACT?: string | null;
  FILTRO?: any;
  FLG_MASIVO: boolean;
  FLG_MEMORIA: boolean;
  FLG_MODIFICADO: boolean;
  PageSize: number;
  PageNumber: number;
  TotalPage: number;
}

export interface TasasTarifasAfp {
  TASASTARIFASAFP_ID: number;
  TASASTARIFASAFPS_ID: number | null;
  AFP_ID: number | null;
  AFPS_ID: number | null;
  PERIODO_ID: number | null;
  PERIODODEVENGUE: string;
  COMISIONFIJA: number | null;
  CSOBREFLUJO: number;
  CMIXSOBREFLUJO: number;
  CMIXANUALSOBRESALDO: number;
  PRIMASEGUROS: number;
  APORTEOBLIGATORIO: number;
  REMUNERACIONMAXIMA: number;
  AFPKey: string;
  AFPSKey: string | null;
  PERIODOKey: string;
  TASASTARIFASAFPKey: string | null;
  PERIODORECIENTE: boolean;
  REGIMENPENSIONARIO: RegimenPensionario;
  PERIODO: Periodo;
  ListaRegimenPensionario: any;
  ListaPeriodos: any;
  SerialKey: string;
  ESTADO: string;
  USUARIO_REG: string;
  FECHA_REG: string;
  USUARIO_ACT: string;
  FECHA_ACT: string | null;
  FILTRO: any;
  FLG_MASIVO: boolean;
  FLG_MEMORIA: boolean;
  FLG_MODIFICADO: boolean;
  PageSize: number;
  PageNumber: number;
  TotalPage: number;
}

export const COMISIONES_SP_DATA: TasasTarifasAfp[] = [
  {
    TASASTARIFASAFP_ID: 0,
    TASASTARIFASAFPS_ID: null,
    AFP_ID: null,
    AFPS_ID: null,
    PERIODO_ID: null,
    PERIODODEVENGUE: "05/2026",
    COMISIONFIJA: null,
    CSOBREFLUJO: 0,
    CMIXSOBREFLUJO: 0,
    CMIXANUALSOBRESALDO: 0,
    PRIMASEGUROS: 0,
    APORTEOBLIGATORIO: 13,
    REMUNERACIONMAXIMA: 0,
    AFPKey: "NxDc0d8ItSnc9Fq1cmIw-g..",
    AFPSKey: null,
    PERIODOKey: "2i7hlp_Ib706_U9-cnYs6w..",
    TASASTARIFASAFPKey: null,
    PERIODORECIENTE: false,
    REGIMENPENSIONARIO: {
      REMUNERATIVOS_ID: 0,
      MAESTRA_ID: 0,
      CODIGO: "02",
      DESCRIPCION: "SISTEMA NACIONAL DE PENSIONES - ONP",
      MAESTRACODIGO: null,
      MAESTRAKey: null,
      MAESTRAPERSONAL: null,
      SOCIO_NEGOCIO: null,
      REMUNERATIVOS_IDs: null,
      FLG_ACTIVO: false,
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
    PERIODO: {
      PERIODO_ID: 0,
      DESCRIPCION: "05/2026",
      PERIODO_DESDE: "/Date(1777611600000)/",
      PERIODO_HASTA: "/Date(1780203600000)/",
      FLG_MASIVO: false,
      FLG_MEMORIA: false,
      FLG_MODIFICADO: false,
      PageSize: 0,
      PageNumber: 0,
      TotalPage: 0
    },
    ListaRegimenPensionario: null,
    ListaPeriodos: null,
    SerialKey: "V5eGcl3MPDKooh9OkEoXMg..",
    ESTADO: "A",
    USUARIO_REG: "jmendoza",
    FECHA_REG: "/Date(1760365568000)/",
    USUARIO_ACT: "",
    FECHA_ACT: null,
    FILTRO: null,
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 1
  }
];
