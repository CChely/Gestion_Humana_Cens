export interface PeriodoDetalle {
  PERIODO_ID: number;
  DESCRIPCION: string;
  PERIODO_DESDE: string;
  PERIODO_HASTA: string;
  PERIODOS_ID: number | null;
  ListaPeriodos: any;
  ListaPeriodosAnios: any;
  AGRUPADOR: any;
  ANOS: any;
  PERIODODETALLE_IDS: any;
  SerialKey: string | null;
  ESTADO: string | null;
  USUARIO_REG: string | null;
  FECHA_REG: string | null;
  USUARIO_ACT: string | null;
  FECHA_ACT: string | null;
  FILTRO: any;
  FLG_MASIVO: boolean;
  FLG_MEMORIA: boolean;
  FLG_MODIFICADO: boolean;
  PageSize: number;
  PageNumber: number;
  TotalPage: number;
}

export interface TasaQuintaCat {
  TASASQUINTACAT_ID: number;
  PERIODODESDE_ID: number | null;
  PERIODOHASTA_ID: number | null;
  FLG_VIGENCIA: boolean;
  PERIODODESDEKey: string;
  PERIODOHASTAKey: string;
  EJERCICIO: string;
  FECHADESDE: string;
  FECHAHASTA: string;
  UIT: number | null;
  PERIODODESDE: PeriodoDetalle;
  PERIODOHASTA: PeriodoDetalle;
  ListaTasasDetalle: any;
  TASASQUINTACATDETALLE: any;
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

export interface TasaQuintaCatDetalle {
  TASASQUINTACATDETALLE_ID: number | null;
  TASASQUINTACAT_ID: number | null;
  UITDESDE: number;
  UITHASTA: number | null;
  TASA: number;
  TASASQUINTACATKey: string;
  TASASQUINTACAT: any;
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

export const TASAS_IMPUESTO_PAGINADO_DATA: TasaQuintaCat[] = [
  {
    TASASQUINTACAT_ID: 0,
    PERIODODESDE_ID: null,
    PERIODOHASTA_ID: null,
    FLG_VIGENCIA: false,
    PERIODODESDEKey: "rR0Q1NAFtjq7G9M0wGaU_Q..",
    PERIODOHASTAKey: "Pfgj2ImQK5tMTaNbVogfWg..",
    EJERCICIO: "2021",
    FECHADESDE: "/Date(1609477200000)/",
    FECHAHASTA: "/Date(1640926800000)/",
    UIT: null,
    PERIODODESDE: {
      PERIODO_ID: 0,
      DESCRIPCION: "01/2021",
      PERIODO_DESDE: "/Date(1609477200000)/",
      PERIODO_HASTA: "/Date(1612069200000)/",
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
    PERIODOHASTA: {
      PERIODO_ID: 0,
      DESCRIPCION: "12/2021",
      PERIODO_DESDE: "/Date(1638334800000)/",
      PERIODO_HASTA: "/Date(1640926800000)/",
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
    ListaTasasDetalle: null,
    TASASQUINTACATDETALLE: null,
    SerialKey: "8Kt4lpcJVrtWAtjO_OKZOg..",
    ESTADO: "A",
    USUARIO_REG: "jjromero88",
    FECHA_REG: "/Date(1640189268000)/",
    USUARIO_ACT: "",
    FECHA_ACT: null,
    FILTRO: null,
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 6
  },
  {
    TASASQUINTACAT_ID: 0,
    PERIODODESDE_ID: null,
    PERIODOHASTA_ID: null,
    FLG_VIGENCIA: true,
    PERIODODESDEKey: "7frJs7ZYVKI5V6qcyDHhtA..",
    PERIODOHASTAKey: "jxT4p1Fpc0UPKeDVz8d5QQ..",
    EJERCICIO: "2022",
    FECHADESDE: "/Date(1641013200000)/",
    FECHAHASTA: "/Date(1672462800000)/",
    UIT: null,
    PERIODODESDE: {
      PERIODO_ID: 0,
      DESCRIPCION: "01/2022",
      PERIODO_DESDE: "/Date(1641013200000)/",
      PERIODO_HASTA: "/Date(1643605200000)/",
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
    PERIODOHASTA: {
      PERIODO_ID: 0,
      DESCRIPCION: "12/2022",
      PERIODO_DESDE: "/Date(1669870800000)/",
      PERIODO_HASTA: "/Date(1672462800000)/",
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
    ListaTasasDetalle: null,
    TASASQUINTACATDETALLE: null,
    SerialKey: "v_kUqDr3-BRu6HPzxToMrg..",
    ESTADO: "A",
    USUARIO_REG: "jjromero88",
    FECHA_REG: "/Date(1640189863000)/",
    USUARIO_ACT: "jjromero88",
    FECHA_ACT: "/Date(1640191419000)/",
    FILTRO: null,
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 6
  },
  {
    TASASQUINTACAT_ID: 0,
    PERIODODESDE_ID: null,
    PERIODOHASTA_ID: null,
    FLG_VIGENCIA: false,
    PERIODODESDEKey: "vooXD8-fyDj_YGjv5RmPdg..",
    PERIODOHASTAKey: "2c4BNNCW00a2FxbOB2cSgQ..",
    EJERCICIO: "2023",
    FECHADESDE: "/Date(1672549200000)/",
    FECHAHASTA: "/Date(1703998800000)/",
    UIT: 4950,
    PERIODODESDE: {
      PERIODO_ID: 0,
      DESCRIPCION: "01/2023",
      PERIODO_DESDE: "/Date(1672549200000)/",
      PERIODO_HASTA: "/Date(1675141200000)/",
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
    PERIODOHASTA: {
      PERIODO_ID: 0,
      DESCRIPCION: "12/2023",
      PERIODO_DESDE: "/Date(1701406800000)/",
      PERIODO_HASTA: "/Date(1703998800000)/",
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
    ListaTasasDetalle: null,
    TASASQUINTACATDETALLE: null,
    SerialKey: "cEiGaRbxM-m5-L1oND72hA..",
    ESTADO: "A",
    USUARIO_REG: "jmendoza",
    FECHA_REG: "/Date(1730300421000)/",
    USUARIO_ACT: "",
    FECHA_ACT: null,
    FILTRO: null,
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 6
  },
  {
    TASASQUINTACAT_ID: 0,
    PERIODODESDE_ID: null,
    PERIODOHASTA_ID: null,
    FLG_VIGENCIA: false,
    PERIODODESDEKey: "DQufS-M8VJN3Ug4SFg-hxg..",
    PERIODOHASTAKey: "qyU_Ms5iN2qvoTy1k6i26w..",
    EJERCICIO: "2024",
    FECHADESDE: "/Date(1704085200000)/",
    FECHAHASTA: "/Date(1735621200000)/",
    UIT: 5150,
    PERIODODESDE: {
      PERIODO_ID: 0,
      DESCRIPCION: "01/2024",
      PERIODO_DESDE: "/Date(1704085200000)/",
      PERIODO_HASTA: "/Date(1706677200000)/",
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
    PERIODOHASTA: {
      PERIODO_ID: 0,
      DESCRIPCION: "12/2024",
      PERIODO_DESDE: "/Date(1733029200000)/",
      PERIODO_HASTA: "/Date(1735621200000)/",
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
    ListaTasasDetalle: null,
    TASASQUINTACATDETALLE: null,
    SerialKey: "V8JmoL2sEFVhQTB3uM8glw..",
    ESTADO: "A",
    USUARIO_REG: "bacuna",
    FECHA_REG: "/Date(1742254281000)/",
    USUARIO_ACT: "",
    FECHA_ACT: null,
    FILTRO: null,
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 6
  },
  {
    TASASQUINTACAT_ID: 0,
    PERIODODESDE_ID: null,
    PERIODOHASTA_ID: null,
    FLG_VIGENCIA: false,
    PERIODODESDEKey: "RdD2dqupWtXQmW2oxhDu5A..",
    PERIODOHASTAKey: "IXpMfMAHiRoa5JmMGU8jZg..",
    EJERCICIO: "2025",
    FECHADESDE: "/Date(1735707600000)/",
    FECHAHASTA: "/Date(1767157200000)/",
    UIT: 5350,
    PERIODODESDE: {
      PERIODO_ID: 0,
      DESCRIPCION: "01/2025",
      PERIODO_DESDE: "/Date(1735707600000)/",
      PERIODO_HASTA: "/Date(1738299600000)/",
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
    PERIODOHASTA: {
      PERIODO_ID: 0,
      DESCRIPCION: "12/2025",
      PERIODO_DESDE: "/Date(1764565200000)/",
      PERIODO_HASTA: "/Date(1767157200000)/",
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
    ListaTasasDetalle: null,
    TASASQUINTACATDETALLE: null,
    SerialKey: "eTY3jNnh3Hz_CW0bUL_9bQ..",
    ESTADO: "A",
    USUARIO_REG: "bacuna",
    FECHA_REG: "/Date(1742254019000)/",
    USUARIO_ACT: "",
    FECHA_ACT: null,
    FILTRO: null,
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 6
  },
  {
    TASASQUINTACAT_ID: 0,
    PERIODODESDE_ID: null,
    PERIODOHASTA_ID: null,
    FLG_VIGENCIA: false,
    PERIODODESDEKey: "LIHBKB83O7Cqb-wkS2rkFA..",
    PERIODOHASTAKey: "4BTx9DejUvn0HyEsminzSg..",
    EJERCICIO: "2026",
    FECHADESDE: "/Date(1767243600000)/",
    FECHAHASTA: "/Date(1798693200000)/",
    UIT: 5500,
    PERIODODESDE: {
      PERIODO_ID: 0,
      DESCRIPCION: "01/2026",
      PERIODO_DESDE: "/Date(1767243600000)/",
      PERIODO_HASTA: "/Date(1769835600000)/",
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
    PERIODOHASTA: {
      PERIODO_ID: 0,
      DESCRIPCION: "12/2026",
      PERIODO_DESDE: "/Date(1796101200000)/",
      PERIODO_HASTA: "/Date(1798693200000)/",
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
    ListaTasasDetalle: null,
    TASASQUINTACATDETALLE: null,
    SerialKey: "HeBf2Z429tmGAyzObi9DaA..",
    ESTADO: "A",
    USUARIO_REG: "jmendoza",
    FECHA_REG: "/Date(1769441800000)/",
    USUARIO_ACT: "",
    FECHA_ACT: null,
    FILTRO: null,
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 6
  }
];

export const TASAS_IMPUESTO_DETALLE_DATA: TasaQuintaCatDetalle[] = [
  // Brackets for 2021 (SerialKey: 8Kt4lpcJVrtWAtjO_OKZOg..)
  {
    TASASQUINTACATDETALLE_ID: null,
    TASASQUINTACAT_ID: null,
    UITDESDE: 0,
    UITHASTA: 5,
    TASA: 8,
    TASASQUINTACATKey: "8Kt4lpcJVrtWAtjO_OKZOg..",
    TASASQUINTACAT: null,
    SerialKey: "h6j62A5z-QNzZKwThBKuAQ..",
    ESTADO: "A",
    USUARIO_REG: "jjromero88",
    FECHA_REG: "/Date(1640189268000)/",
    USUARIO_ACT: "",
    FECHA_ACT: null,
    FILTRO: null,
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 0
  },
  {
    TASASQUINTACATDETALLE_ID: null,
    TASASQUINTACAT_ID: null,
    UITDESDE: 5,
    UITHASTA: 20,
    TASA: 14,
    TASASQUINTACATKey: "8Kt4lpcJVrtWAtjO_OKZOg..",
    TASASQUINTACAT: null,
    SerialKey: "8Kt4lpcJVrtWAtjO_OKZOg..",
    ESTADO: "A",
    USUARIO_REG: "jjromero88",
    FECHA_REG: "/Date(1640189268000)/",
    USUARIO_ACT: "",
    FECHA_ACT: null,
    FILTRO: null,
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 0
  },
  {
    TASASQUINTACATDETALLE_ID: null,
    TASASQUINTACAT_ID: null,
    UITDESDE: 20,
    UITHASTA: 35,
    TASA: 17,
    TASASQUINTACATKey: "8Kt4lpcJVrtWAtjO_OKZOg..",
    TASASQUINTACAT: null,
    SerialKey: "v_kUqDr3-BRu6HPzxToMrg..",
    ESTADO: "A",
    USUARIO_REG: "jjromero88",
    FECHA_REG: "/Date(1640189268000)/",
    USUARIO_ACT: "",
    FECHA_ACT: null,
    FILTRO: null,
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 0
  },
  {
    TASASQUINTACATDETALLE_ID: null,
    TASASQUINTACAT_ID: null,
    UITDESDE: 35,
    UITHASTA: 45,
    TASA: 20,
    TASASQUINTACATKey: "8Kt4lpcJVrtWAtjO_OKZOg..",
    TASASQUINTACAT: null,
    SerialKey: "wusyhE6I0GalNr8InJYf8g..",
    ESTADO: "A",
    USUARIO_REG: "jjromero88",
    FECHA_REG: "/Date(1640189268000)/",
    USUARIO_ACT: "",
    FECHA_ACT: null,
    FILTRO: null,
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 0
  },
  {
    TASASQUINTACATDETALLE_ID: null,
    TASASQUINTACAT_ID: null,
    UITDESDE: 45,
    UITHASTA: null,
    TASA: 30,
    TASASQUINTACATKey: "8Kt4lpcJVrtWAtjO_OKZOg..",
    TASASQUINTACAT: null,
    SerialKey: "iEyyxwTPEeunCaSBetHpwQ..",
    ESTADO: "A",
    USUARIO_REG: "jjromero88",
    FECHA_REG: "/Date(1640189268000)/",
    USUARIO_ACT: "",
    FECHA_ACT: null,
    FILTRO: null,
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 0
  },

  // Brackets for 2022 (SerialKey: v_kUqDr3-BRu6HPzxToMrg..)
  { UITDESDE: 0, UITHASTA: 5, TASA: 8, TASASQUINTACATKey: "v_kUqDr3-BRu6HPzxToMrg..", SerialKey: "d1-2022", ESTADO: "A", USUARIO_REG: "jjromero88", FECHA_REG: "/Date(1640189863000)/", TASASQUINTACATDETALLE_ID: null, TASASQUINTACAT_ID: null, TASASQUINTACAT: null, FECHA_ACT: null, FILTRO: null, FLG_MASIVO: false, FLG_MEMORIA: false, FLG_MODIFICADO: false, PageSize: 0, PageNumber: 0, TotalPage: 0, USUARIO_ACT: "" },
  { UITDESDE: 5, UITHASTA: 20, TASA: 14, TASASQUINTACATKey: "v_kUqDr3-BRu6HPzxToMrg..", SerialKey: "d2-2022", ESTADO: "A", USUARIO_REG: "jjromero88", FECHA_REG: "/Date(1640189863000)/", TASASQUINTACATDETALLE_ID: null, TASASQUINTACAT_ID: null, TASASQUINTACAT: null, FECHA_ACT: null, FILTRO: null, FLG_MASIVO: false, FLG_MEMORIA: false, FLG_MODIFICADO: false, PageSize: 0, PageNumber: 0, TotalPage: 0, USUARIO_ACT: "" },
  { UITDESDE: 20, UITHASTA: 35, TASA: 17, TASASQUINTACATKey: "v_kUqDr3-BRu6HPzxToMrg..", SerialKey: "d3-2022", ESTADO: "A", USUARIO_REG: "jjromero88", FECHA_REG: "/Date(1640189863000)/", TASASQUINTACATDETALLE_ID: null, TASASQUINTACAT_ID: null, TASASQUINTACAT: null, FECHA_ACT: null, FILTRO: null, FLG_MASIVO: false, FLG_MEMORIA: false, FLG_MODIFICADO: false, PageSize: 0, PageNumber: 0, TotalPage: 0, USUARIO_ACT: "" },
  { UITDESDE: 35, UITHASTA: 45, TASA: 20, TASASQUINTACATKey: "v_kUqDr3-BRu6HPzxToMrg..", SerialKey: "d4-2022", ESTADO: "A", USUARIO_REG: "jjromero88", FECHA_REG: "/Date(1640189863000)/", TASASQUINTACATDETALLE_ID: null, TASASQUINTACAT_ID: null, TASASQUINTACAT: null, FECHA_ACT: null, FILTRO: null, FLG_MASIVO: false, FLG_MEMORIA: false, FLG_MODIFICADO: false, PageSize: 0, PageNumber: 0, TotalPage: 0, USUARIO_ACT: "" },
  { UITDESDE: 45, UITHASTA: null, TASA: 30, TASASQUINTACATKey: "v_kUqDr3-BRu6HPzxToMrg..", SerialKey: "d5-2022", ESTADO: "A", USUARIO_REG: "jjromero88", FECHA_REG: "/Date(1640189863000)/", TASASQUINTACATDETALLE_ID: null, TASASQUINTACAT_ID: null, TASASQUINTACAT: null, FECHA_ACT: null, FILTRO: null, FLG_MASIVO: false, FLG_MEMORIA: false, FLG_MODIFICADO: false, PageSize: 0, PageNumber: 0, TotalPage: 0, USUARIO_ACT: "" },

  // Brackets for 2023 (SerialKey: cEiGaRbxM-m5-L1oND72hA..)
  { UITDESDE: 0, UITHASTA: 5, TASA: 8, TASASQUINTACATKey: "cEiGaRbxM-m5-L1oND72hA..", SerialKey: "d1-2023", ESTADO: "A", USUARIO_REG: "jmendoza", FECHA_REG: "/Date(1730300421000)/", TASASQUINTACATDETALLE_ID: null, TASASQUINTACAT_ID: null, TASASQUINTACAT: null, FECHA_ACT: null, FILTRO: null, FLG_MASIVO: false, FLG_MEMORIA: false, FLG_MODIFICADO: false, PageSize: 0, PageNumber: 0, TotalPage: 0, USUARIO_ACT: "" },
  { UITDESDE: 5, UITHASTA: 20, TASA: 14, TASASQUINTACATKey: "cEiGaRbxM-m5-L1oND72hA..", SerialKey: "d2-2023", ESTADO: "A", USUARIO_REG: "jmendoza", FECHA_REG: "/Date(1730300421000)/", TASASQUINTACATDETALLE_ID: null, TASASQUINTACAT_ID: null, TASASQUINTACAT: null, FECHA_ACT: null, FILTRO: null, FLG_MASIVO: false, FLG_MEMORIA: false, FLG_MODIFICADO: false, PageSize: 0, PageNumber: 0, TotalPage: 0, USUARIO_ACT: "" },
  { UITDESDE: 20, UITHASTA: 35, TASA: 17, TASASQUINTACATKey: "cEiGaRbxM-m5-L1oND72hA..", SerialKey: "d3-2023", ESTADO: "A", USUARIO_REG: "jmendoza", FECHA_REG: "/Date(1730300421000)/", TASASQUINTACATDETALLE_ID: null, TASASQUINTACAT_ID: null, TASASQUINTACAT: null, FECHA_ACT: null, FILTRO: null, FLG_MASIVO: false, FLG_MEMORIA: false, FLG_MODIFICADO: false, PageSize: 0, PageNumber: 0, TotalPage: 0, USUARIO_ACT: "" },
  { UITDESDE: 35, UITHASTA: 45, TASA: 20, TASASQUINTACATKey: "cEiGaRbxM-m5-L1oND72hA..", SerialKey: "d4-2023", ESTADO: "A", USUARIO_REG: "jmendoza", FECHA_REG: "/Date(1730300421000)/", TASASQUINTACATDETALLE_ID: null, TASASQUINTACAT_ID: null, TASASQUINTACAT: null, FECHA_ACT: null, FILTRO: null, FLG_MASIVO: false, FLG_MEMORIA: false, FLG_MODIFICADO: false, PageSize: 0, PageNumber: 0, TotalPage: 0, USUARIO_ACT: "" },
  { UITDESDE: 45, UITHASTA: null, TASA: 30, TASASQUINTACATKey: "cEiGaRbxM-m5-L1oND72hA..", SerialKey: "d5-2023", ESTADO: "A", USUARIO_REG: "jmendoza", FECHA_REG: "/Date(1730300421000)/", TASASQUINTACATDETALLE_ID: null, TASASQUINTACAT_ID: null, TASASQUINTACAT: null, FECHA_ACT: null, FILTRO: null, FLG_MASIVO: false, FLG_MEMORIA: false, FLG_MODIFICADO: false, PageSize: 0, PageNumber: 0, TotalPage: 0, USUARIO_ACT: "" },

  // Brackets for 2024 (SerialKey: V8JmoL2sEFVhQTB3uM8glw..)
  { UITDESDE: 0, UITHASTA: 5, TASA: 8, TASASQUINTACATKey: "V8JmoL2sEFVhQTB3uM8glw..", SerialKey: "d1-2024", ESTADO: "A", USUARIO_REG: "bacuna", FECHA_REG: "/Date(1742254281000)/", TASASQUINTACATDETALLE_ID: null, TASASQUINTACAT_ID: null, TASASQUINTACAT: null, FECHA_ACT: null, FILTRO: null, FLG_MASIVO: false, FLG_MEMORIA: false, FLG_MODIFICADO: false, PageSize: 0, PageNumber: 0, TotalPage: 0, USUARIO_ACT: "" },
  { UITDESDE: 5, UITHASTA: 20, TASA: 14, TASASQUINTACATKey: "V8JmoL2sEFVhQTB3uM8glw..", SerialKey: "d2-2024", ESTADO: "A", USUARIO_REG: "bacuna", FECHA_REG: "/Date(1742254281000)/", TASASQUINTACATDETALLE_ID: null, TASASQUINTACAT_ID: null, TASASQUINTACAT: null, FECHA_ACT: null, FILTRO: null, FLG_MASIVO: false, FLG_MEMORIA: false, FLG_MODIFICADO: false, PageSize: 0, PageNumber: 0, TotalPage: 0, USUARIO_ACT: "" },
  { UITDESDE: 20, UITHASTA: 35, TASA: 17, TASASQUINTACATKey: "V8JmoL2sEFVhQTB3uM8glw..", SerialKey: "d3-2024", ESTADO: "A", USUARIO_REG: "bacuna", FECHA_REG: "/Date(1742254281000)/", TASASQUINTACATDETALLE_ID: null, TASASQUINTACAT_ID: null, TASASQUINTACAT: null, FECHA_ACT: null, FILTRO: null, FLG_MASIVO: false, FLG_MEMORIA: false, FLG_MODIFICADO: false, PageSize: 0, PageNumber: 0, TotalPage: 0, USUARIO_ACT: "" },
  { UITDESDE: 35, UITHASTA: 45, TASA: 20, TASASQUINTACATKey: "V8JmoL2sEFVhQTB3uM8glw..", SerialKey: "d4-2024", ESTADO: "A", USUARIO_REG: "bacuna", FECHA_REG: "/Date(1742254281000)/", TASASQUINTACATDETALLE_ID: null, TASASQUINTACAT_ID: null, TASASQUINTACAT: null, FECHA_ACT: null, FILTRO: null, FLG_MASIVO: false, FLG_MEMORIA: false, FLG_MODIFICADO: false, PageSize: 0, PageNumber: 0, TotalPage: 0, USUARIO_ACT: "" },
  { UITDESDE: 45, UITHASTA: null, TASA: 30, TASASQUINTACATKey: "V8JmoL2sEFVhQTB3uM8glw..", SerialKey: "d5-2024", ESTADO: "A", USUARIO_REG: "bacuna", FECHA_REG: "/Date(1742254281000)/", TASASQUINTACATDETALLE_ID: null, TASASQUINTACAT_ID: null, TASASQUINTACAT: null, FECHA_ACT: null, FILTRO: null, FLG_MASIVO: false, FLG_MEMORIA: false, FLG_MODIFICADO: false, PageSize: 0, PageNumber: 0, TotalPage: 0, USUARIO_ACT: "" },

  // Brackets for 2025 (SerialKey: eTY3jNnh3Hz_CW0bUL_9bQ..)
  { UITDESDE: 0, UITHASTA: 5, TASA: 8, TASASQUINTACATKey: "eTY3jNnh3Hz_CW0bUL_9bQ..", SerialKey: "d1-2025", ESTADO: "A", USUARIO_REG: "bacuna", FECHA_REG: "/Date(1742254019000)/", TASASQUINTACATDETALLE_ID: null, TASASQUINTACAT_ID: null, TASASQUINTACAT: null, FECHA_ACT: null, FILTRO: null, FLG_MASIVO: false, FLG_MEMORIA: false, FLG_MODIFICADO: false, PageSize: 0, PageNumber: 0, TotalPage: 0, USUARIO_ACT: "" },
  { UITDESDE: 5, UITHASTA: 20, TASA: 14, TASASQUINTACATKey: "eTY3jNnh3Hz_CW0bUL_9bQ..", SerialKey: "d2-2025", ESTADO: "A", USUARIO_REG: "bacuna", FECHA_REG: "/Date(1742254019000)/", TASASQUINTACATDETALLE_ID: null, TASASQUINTACAT_ID: null, TASASQUINTACAT: null, FECHA_ACT: null, FILTRO: null, FLG_MASIVO: false, FLG_MEMORIA: false, FLG_MODIFICADO: false, PageSize: 0, PageNumber: 0, TotalPage: 0, USUARIO_ACT: "" },
  { UITDESDE: 20, UITHASTA: 35, TASA: 17, TASASQUINTACATKey: "eTY3jNnh3Hz_CW0bUL_9bQ..", SerialKey: "d3-2025", ESTADO: "A", USUARIO_REG: "bacuna", FECHA_REG: "/Date(1742254019000)/", TASASQUINTACATDETALLE_ID: null, TASASQUINTACAT_ID: null, TASASQUINTACAT: null, FECHA_ACT: null, FILTRO: null, FLG_MASIVO: false, FLG_MEMORIA: false, FLG_MODIFICADO: false, PageSize: 0, PageNumber: 0, TotalPage: 0, USUARIO_ACT: "" },
  { UITDESDE: 35, UITHASTA: 45, TASA: 20, TASASQUINTACATKey: "eTY3jNnh3Hz_CW0bUL_9bQ..", SerialKey: "d4-2025", ESTADO: "A", USUARIO_REG: "bacuna", FECHA_REG: "/Date(1742254019000)/", TASASQUINTACATDETALLE_ID: null, TASASQUINTACAT_ID: null, TASASQUINTACAT: null, FECHA_ACT: null, FILTRO: null, FLG_MASIVO: false, FLG_MEMORIA: false, FLG_MODIFICADO: false, PageSize: 0, PageNumber: 0, TotalPage: 0, USUARIO_ACT: "" },
  { UITDESDE: 45, UITHASTA: null, TASA: 30, TASASQUINTACATKey: "eTY3jNnh3Hz_CW0bUL_9bQ..", SerialKey: "d5-2025", ESTADO: "A", USUARIO_REG: "bacuna", FECHA_REG: "/Date(1742254019000)/", TASASQUINTACATDETALLE_ID: null, TASASQUINTACAT_ID: null, TASASQUINTACAT: null, FECHA_ACT: null, FILTRO: null, FLG_MASIVO: false, FLG_MEMORIA: false, FLG_MODIFICADO: false, PageSize: 0, PageNumber: 0, TotalPage: 0, USUARIO_ACT: "" },

  // Brackets for 2026 (SerialKey: HeBf2Z429tmGAyzObi9DaA..)
  { UITDESDE: 0, UITHASTA: 5, TASA: 8, TASASQUINTACATKey: "HeBf2Z429tmGAyzObi9DaA..", SerialKey: "d1-2026", ESTADO: "A", USUARIO_REG: "jmendoza", FECHA_REG: "/Date(1769441800000)/", TASASQUINTACATDETALLE_ID: null, TASASQUINTACAT_ID: null, TASASQUINTACAT: null, FECHA_ACT: null, FILTRO: null, FLG_MASIVO: false, FLG_MEMORIA: false, FLG_MODIFICADO: false, PageSize: 0, PageNumber: 0, TotalPage: 0, USUARIO_ACT: "" },
  { UITDESDE: 5, UITHASTA: 20, TASA: 14, TASASQUINTACATKey: "HeBf2Z429tmGAyzObi9DaA..", SerialKey: "d2-2026", ESTADO: "A", USUARIO_REG: "jmendoza", FECHA_REG: "/Date(1769441800000)/", TASASQUINTACATDETALLE_ID: null, TASASQUINTACAT_ID: null, TASASQUINTACAT: null, FECHA_ACT: null, FILTRO: null, FLG_MASIVO: false, FLG_MEMORIA: false, FLG_MODIFICADO: false, PageSize: 0, PageNumber: 0, TotalPage: 0, USUARIO_ACT: "" },
  { UITDESDE: 20, UITHASTA: 35, TASA: 17, TASASQUINTACATKey: "HeBf2Z429tmGAyzObi9DaA..", SerialKey: "d3-2026", ESTADO: "A", USUARIO_REG: "jmendoza", FECHA_REG: "/Date(1769441800000)/", TASASQUINTACATDETALLE_ID: null, TASASQUINTACAT_ID: null, TASASQUINTACAT: null, FECHA_ACT: null, FILTRO: null, FLG_MASIVO: false, FLG_MEMORIA: false, FLG_MODIFICADO: false, PageSize: 0, PageNumber: 0, TotalPage: 0, USUARIO_ACT: "" },
  { UITDESDE: 35, UITHASTA: 45, TASA: 20, TASASQUINTACATKey: "HeBf2Z429tmGAyzObi9DaA..", SerialKey: "d4-2026", ESTADO: "A", USUARIO_REG: "jmendoza", FECHA_REG: "/Date(1769441800000)/", TASASQUINTACATDETALLE_ID: null, TASASQUINTACAT_ID: null, TASASQUINTACAT: null, FECHA_ACT: null, FILTRO: null, FLG_MASIVO: false, FLG_MEMORIA: false, FLG_MODIFICADO: false, PageSize: 0, PageNumber: 0, TotalPage: 0, USUARIO_ACT: "" },
  { UITDESDE: 45, UITHASTA: null, TASA: 30, TASASQUINTACATKey: "HeBf2Z429tmGAyzObi9DaA..", SerialKey: "d5-2026", ESTADO: "A", USUARIO_REG: "jmendoza", FECHA_REG: "/Date(1769441800000)/", TASASQUINTACATDETALLE_ID: null, TASASQUINTACAT_ID: null, TASASQUINTACAT: null, FECHA_ACT: null, FILTRO: null, FLG_MASIVO: false, FLG_MEMORIA: false, FLG_MODIFICADO: false, PageSize: 0, PageNumber: 0, TotalPage: 0, USUARIO_ACT: "" }
];
