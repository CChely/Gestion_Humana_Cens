export interface Periodo {
  PERIODO_ID: number;
  DESCRIPCION: string;
  PERIODO_DESDE: string;
  PERIODO_HASTA: string;
  PERIODOS_ID?: any;
  ListaPeriodos?: any;
  ListaPeriodosAnios?: any;
  AGRUPADOR?: any;
  ANOS?: any;
  PERIODODETALLE_IDS?: any;
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

export interface ParametroGeneral {
  PARAMETROSGENERALES_ID: number;
  PARAMETROSGENERALESID?: any;
  PARAMETROSGENERALESKey?: string | null;
  PERIODO_ID?: any;
  APORTESIS: number | null;
  ASIGFAMILIAR: number | null;
  APORTEESSALUD: number | null;
  APORTEEPS: number | null;
  APORTEESSALUDVIDA: number | null;
  APORTESCTRSALUD?: any;
  APORTESCTRPENSION?: any;
  SENATI: number | null;
  EPSINDIVIDUAL: number | null;
  TASANODOMICILIADO: number | null;
  PERIODO_DESDE?: any;
  PERIODO_HASTA?: any;
  PERIODORECIENTE: boolean;
  PERIODOKey: string;
  PERIODO: Periodo;
  ListaPeriodos?: any;
  PORCENTAJE_VIDALEY: number | null;
  TOPEAPORTEVIDALEY: number | null;
  SerialKey: string;
  ESTADO: string;
  USUARIO_REG: string;
  FECHA_REG: string;
  USUARIO_ACT?: string;
  FECHA_ACT?: string | null;
  FILTRO?: any;
  FLG_MASIVO: boolean;
  FLG_MEMORIA: boolean;
  FLG_MODIFICADO: boolean;
  PageSize: number;
  PageNumber: number;
  TotalPage: number;
}

export const APORTES_EMPLEADOR_PAGINADO_DATA: ParametroGeneral[] = [
  {
    PARAMETROSGENERALES_ID: 0,
    PARAMETROSGENERALESID: null,
    PARAMETROSGENERALESKey: null,
    PERIODO_ID: null,
    APORTESIS: null,
    ASIGFAMILIAR: 10,
    APORTEESSALUD: 9,
    APORTEEPS: 2.25,
    APORTEESSALUDVIDA: 5,
    APORTESCTRSALUD: null,
    APORTESCTRPENSION: null,
    SENATI: null,
    EPSINDIVIDUAL: null,
    TASANODOMICILIADO: 30,
    PERIODO_DESDE: null,
    PERIODO_HASTA: null,
    PERIODORECIENTE: false,
    PERIODOKey: "2i7hlp_Ib706_U9-cnYs6w..",
    PERIODO: {
      PERIODO_ID: 0,
      DESCRIPCION: "05/2026",
      PERIODO_DESDE: "/Date(1777611600000)/",
      PERIODO_HASTA: "/Date(1780203600000)/",
      PERIODOS_ID: null,
      ListaPeriodos: null,
      ListaPeriodosAnios: null,
      AGRUPADOR: null,
      ANOS: null,
      PERIODODETALLE_IDS: null,
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
    ListaPeriodos: null,
    PORCENTAJE_VIDALEY: 15,
    TOPEAPORTEVIDALEY: null,
    SerialKey: "AejRyXZNaQ4HI7fqFHyZxg..",
    ESTADO: "A",
    USUARIO_REG: "jmendoza",
    FECHA_REG: "/Date(1769442333000)/",
    USUARIO_ACT: "jmendoza",
    FECHA_ACT: "/Date(1772466906000)/",
    FILTRO: null,
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 1
  }
];
