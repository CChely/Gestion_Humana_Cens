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

export interface PeriodoCalculo {
  PERIODOCALCULO_ID: number;
  UIT: number;
  RMV: number;
  TC: number;
  RMV_RMINERO: number;
  FLG_EDITABLE: boolean;
  PERIODOKey: string;
  PERIODODESC: string;
  PERIODO_DESDE: string;
  PERIODO_HASTA: string;
  PERIODO: Periodo;
  mostrarInputMinero: boolean;
  SerialKey: string;
  ESTADO: string;
  FLG_MASIVO: boolean;
  FLG_MEMORIA: boolean;
  FLG_MODIFICADO: boolean;
  PageSize: number;
  PageNumber: number;
  TotalPage: number;
}

export const PERIODS_DATA: PeriodoCalculo[] = [
  {
    PERIODOCALCULO_ID: 0,
    UIT: 5500,
    RMV: 1130,
    TC: 3.8,
    RMV_RMINERO: 0,
    FLG_EDITABLE: true,
    PERIODOKey: "2i7hlp_Ib706_U9-cnYs6w..",
    PERIODODESC: "05/2026",
    PERIODO_DESDE: "/Date(1777611600000)/",
    PERIODO_HASTA: "/Date(1780203600000)/",
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
    mostrarInputMinero: false,
    SerialKey: "I8FkwNbk0-Q0pbwXFV8fbQ..",
    ESTADO: "A",
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 42
  },
  {
    PERIODOCALCULO_ID: 0,
    UIT: 5500,
    RMV: 1130,
    TC: 3.8,
    RMV_RMINERO: 0,
    FLG_EDITABLE: true,
    PERIODOKey: "rMgh_1jU7pDhj-jOgLd_gQ..",
    PERIODODESC: "04/2026",
    PERIODO_DESDE: "/Date(1775019600000)/",
    PERIODO_HASTA: "/Date(1777525200000)/",
    PERIODO: {
      PERIODO_ID: 0,
      DESCRIPCION: "04/2026",
      PERIODO_DESDE: "/Date(1775019600000)/",
      PERIODO_HASTA: "/Date(1777525200000)/",
      FLG_MASIVO: false,
      FLG_MEMORIA: false,
      FLG_MODIFICADO: false,
      PageSize: 0,
      PageNumber: 0,
      TotalPage: 0
    },
    mostrarInputMinero: false,
    SerialKey: "WlUvTy2Nl4m6V7gQem5YSQ..",
    ESTADO: "A",
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 42
  },
  {
    PERIODOCALCULO_ID: 0,
    UIT: 5500,
    RMV: 1130,
    TC: 4.0,
    RMV_RMINERO: 0,
    FLG_EDITABLE: true,
    PERIODOKey: "n9N4Cr-1ICC4E1_CNHq6LQ..",
    PERIODODESC: "03/2026",
    PERIODO_DESDE: "/Date(1772341200000)/",
    PERIODO_HASTA: "/Date(1774933200000)/",
    PERIODO: {
      PERIODO_ID: 0,
      DESCRIPCION: "03/2026",
      PERIODO_DESDE: "/Date(1772341200000)/",
      PERIODO_HASTA: "/Date(1774933200000)/",
      FLG_MASIVO: false,
      FLG_MEMORIA: false,
      FLG_MODIFICADO: false,
      PageSize: 0,
      PageNumber: 0,
      TotalPage: 0
    },
    mostrarInputMinero: false,
    SerialKey: "sLWOBqvguLQ8AC3l4iEzDQ..",
    ESTADO: "A",
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 42
  },
  {
    PERIODOCALCULO_ID: 0,
    UIT: 5500,
    RMV: 1130,
    TC: 3.8,
    RMV_RMINERO: 0,
    FLG_EDITABLE: true,
    PERIODOKey: "LWmiPPKebgQVmEK0kzMICA..",
    PERIODODESC: "02/2026",
    PERIODO_DESDE: "/Date(1769922000000)/",
    PERIODO_HASTA: "/Date(1772254800000)/",
    PERIODO: {
      PERIODO_ID: 0,
      DESCRIPCION: "02/2026",
      PERIODO_DESDE: "/Date(1769922000000)/",
      PERIODO_HASTA: "/Date(1772254800000)/",
      FLG_MASIVO: false,
      FLG_MEMORIA: false,
      FLG_MODIFICADO: false,
      PageSize: 0,
      PageNumber: 0,
      TotalPage: 0
    },
    mostrarInputMinero: false,
    SerialKey: "hgTFa_oR54m51ATi1bl4hw..",
    ESTADO: "A",
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 42
  },
  {
    PERIODOCALCULO_ID: 0,
    UIT: 5500,
    RMV: 1130,
    TC: 4.0,
    RMV_RMINERO: 0,
    FLG_EDITABLE: true,
    PERIODOKey: "LIHBKB83O7Cqb-wkS2rkFA..",
    PERIODODESC: "01/2026",
    PERIODO_DESDE: "/Date(1767243600000)/",
    PERIODO_HASTA: "/Date(1769835600000)/",
    PERIODO: {
      PERIODO_ID: 0,
      DESCRIPCION: "01/2026",
      PERIODO_DESDE: "/Date(1767243600000)/",
      PERIODO_HASTA: "/Date(1769835600000)/",
      FLG_MASIVO: false,
      FLG_MEMORIA: false,
      FLG_MODIFICADO: false,
      PageSize: 0,
      PageNumber: 0,
      TotalPage: 0
    },
    mostrarInputMinero: false,
    SerialKey: "j_G6C-v19dGPui_6LF-Zpg..",
    ESTADO: "A",
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 42
  },
  {
    PERIODOCALCULO_ID: 0,
    UIT: 5350,
    RMV: 1130,
    TC: 4.0,
    RMV_RMINERO: 0,
    FLG_EDITABLE: true,
    PERIODOKey: "qoo3P8FGDPi0A1MNA_2gmw..",
    PERIODODESC: "12/2025",
    PERIODO_DESDE: "/Date(1764565200000)/",
    PERIODO_HASTA: "/Date(1767157200000)/",
    PERIODO: {
      PERIODO_ID: 0,
      DESCRIPCION: "12/2025",
      PERIODO_DESDE: "/Date(1764565200000)/",
      PERIODO_HASTA: "/Date(1767157200000)/",
      FLG_MASIVO: false,
      FLG_MEMORIA: false,
      FLG_MODIFICADO: false,
      PageSize: 0,
      PageNumber: 0,
      TotalPage: 0
    },
    mostrarInputMinero: false,
    SerialKey: "qoo3P8FGDPi0A1MNA_2gmw..",
    ESTADO: "A",
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 42
  },
  {
    PERIODOCALCULO_ID: 0,
    UIT: 5350,
    RMV: 1130,
    TC: 4.0,
    RMV_RMINERO: 0,
    FLG_EDITABLE: true,
    PERIODOKey: "ZQ5Orx0zu_s9WwjjajPhqw..",
    PERIODODESC: "11/2025",
    PERIODO_DESDE: "/Date(1761973200000)/",
    PERIODO_HASTA: "/Date(1764478800000)/",
    PERIODO: {
      PERIODO_ID: 0,
      DESCRIPCION: "11/2025",
      PERIODO_DESDE: "/Date(1761973200000)/",
      PERIODO_HASTA: "/Date(1764478800000)/",
      FLG_MASIVO: false,
      FLG_MEMORIA: false,
      FLG_MODIFICADO: false,
      PageSize: 0,
      PageNumber: 0,
      TotalPage: 0
    },
    mostrarInputMinero: false,
    SerialKey: "ZQ5Orx0zu_s9WwjjajPhqw..",
    ESTADO: "A",
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 42
  },
  {
    PERIODOCALCULO_ID: 0,
    UIT: 5350,
    RMV: 1130,
    TC: 4.0,
    RMV_RMINERO: 0,
    FLG_EDITABLE: true,
    PERIODOKey: "7DMVgb5AsHQmTaHyC4yR3g..",
    PERIODODESC: "10/2025",
    PERIODO_DESDE: "/Date(1759294800000)/",
    PERIODO_HASTA: "/Date(1761886800000)/",
    PERIODO: {
      PERIODO_ID: 0,
      DESCRIPCION: "10/2025",
      PERIODO_DESDE: "/Date(1759294800000)/",
      PERIODO_HASTA: "/Date(1761886800000)/",
      FLG_MASIVO: false,
      FLG_MEMORIA: false,
      FLG_MODIFICADO: false,
      PageSize: 0,
      PageNumber: 0,
      TotalPage: 0
    },
    mostrarInputMinero: false,
    SerialKey: "7DMVgb5AsHQmTaHyC4yR3g..",
    ESTADO: "A",
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 42
  },
  {
    PERIODOCALCULO_ID: 0,
    UIT: 5350,
    RMV: 1130,
    TC: 4.0,
    RMV_RMINERO: 0,
    FLG_EDITABLE: true,
    PERIODOKey: "6_jyA10jmX9rAwZ7l8XGiw..",
    PERIODODESC: "09/2025",
    PERIODO_DESDE: "/Date(1756702800000)/",
    PERIODO_HASTA: "/Date(1759208400000)/",
    PERIODO: {
      PERIODO_ID: 0,
      DESCRIPCION: "09/2025",
      PERIODO_DESDE: "/Date(1756702800000)/",
      PERIODO_HASTA: "/Date(1759208400000)/",
      FLG_MASIVO: false,
      FLG_MEMORIA: false,
      FLG_MODIFICADO: false,
      PageSize: 0,
      PageNumber: 0,
      TotalPage: 0
    },
    mostrarInputMinero: false,
    SerialKey: "6_jyA10jmX9rAwZ7l8XGiw..",
    ESTADO: "A",
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 42
  },
  {
    PERIODOCALCULO_ID: 0,
    UIT: 5350,
    RMV: 1130,
    TC: 4.0,
    RMV_RMINERO: 0,
    FLG_EDITABLE: true,
    PERIODOKey: "xQEgbk1OvoN-oRqIenEKQA..",
    PERIODODESC: "08/2025",
    PERIODO_DESDE: "/Date(1754024400000)/",
    PERIODO_HASTA: "/Date(1756616400000)/",
    PERIODO: {
      PERIODO_ID: 0,
      DESCRIPCION: "08/2025",
      PERIODO_DESDE: "/Date(1754024400000)/",
      PERIODO_HASTA: "/Date(1756616400000)/",
      FLG_MASIVO: false,
      FLG_MEMORIA: false,
      FLG_MODIFICADO: false,
      PageSize: 0,
      PageNumber: 0,
      TotalPage: 0
    },
    mostrarInputMinero: false,
    SerialKey: "xQEgbk1OvoN-oRqIenEKQA..",
    ESTADO: "A",
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 42
  },
  {
    PERIODOCALCULO_ID: 0,
    UIT: 5350,
    RMV: 1130,
    TC: 4.0,
    RMV_RMINERO: 0,
    FLG_EDITABLE: true,
    PERIODOKey: "mnRN2pIQ8tOBVX0a5eJZ1w..",
    PERIODODESC: "07/2025",
    PERIODO_DESDE: "/Date(1751346000000)/",
    PERIODO_HASTA: "/Date(1753938000000)/",
    PERIODO: {
      PERIODO_ID: 0,
      DESCRIPCION: "07/2025",
      PERIODO_DESDE: "/Date(1751346000000)/",
      PERIODO_HASTA: "/Date(1753938000000)/",
      FLG_MASIVO: false,
      FLG_MEMORIA: false,
      FLG_MODIFICADO: false,
      PageSize: 0,
      PageNumber: 0,
      TotalPage: 0
    },
    mostrarInputMinero: false,
    SerialKey: "mnRN2pIQ8tOBVX0a5eJZ1w..",
    ESTADO: "A",
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 42
  },
  {
    PERIODOCALCULO_ID: 0,
    UIT: 5350,
    RMV: 1130,
    TC: 4.0,
    RMV_RMINERO: 0,
    FLG_EDITABLE: true,
    PERIODOKey: "tAlbmtaebUK3FyKL-DlQsg..",
    PERIODODESC: "06/2025",
    PERIODO_DESDE: "/Date(1748754000000)/",
    PERIODO_HASTA: "/Date(1751259600000)/",
    PERIODO: {
      PERIODO_ID: 0,
      DESCRIPCION: "06/2025",
      PERIODO_DESDE: "/Date(1748754000000)/",
      PERIODO_HASTA: "/Date(1751259600000)/",
      FLG_MASIVO: false,
      FLG_MEMORIA: false,
      FLG_MODIFICADO: false,
      PageSize: 0,
      PageNumber: 0,
      TotalPage: 0
    },
    mostrarInputMinero: false,
    SerialKey: "tAlbmtaebUK3FyKL-DlQsg..",
    ESTADO: "A",
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 42
  }
];
