export interface IncrementoSalarialRecord {
  VARIACIONJORNAL_ID: number;
  CATEGORIACONSTRUCCIONCIVIL_ID: number;
  JORNALDIARIO: number;
  APLICA_DESDE: string;
  APLICA_HASTA: string | null;
  APLICA_TODOS: boolean;
  MOTIVOELIMINACIONKey: string | null;
  MOTIVOELIMINACION_ID: number;
  OBSERVACIONELIMINACION: string | null;
  VARIACIONJORNALKey: string | null;
  CATEGORIACONSTRUCCIONCIVILKey: string;
  ListaCategorias: any[] | null;
  ListaMotivoEliminacionIncremento: any[] | null;
  ListaAplicaTodos: any[] | null;
  CATEGORIA: string;
  APLICATODOS: string;
  ES_ULTIMO: boolean;
  JORNALFORMAT: string;
  EDITAR: boolean;
  SerialKey: string;
  ESTADO: string;
  USUARIO_REG: string;
  FECHA_REG: string;
  USUARIO_ACT: string | null;
  FECHA_ACT: string | null;
  FILTRO: string | null;
  FLG_MASIVO: boolean;
  FLG_MEMORIA: boolean;
  FLG_MODIFICADO: boolean;
  PageSize: number;
  PageNumber: number;
  TotalPage: number;
}

export const INCREMENTOS_MOCK: IncrementoSalarialRecord[] = [
  {
    VARIACIONJORNAL_ID: 0,
    CATEGORIACONSTRUCCIONCIVIL_ID: 0,
    JORNALDIARIO: 120,
    APLICA_DESDE: "/Date(1779253200000)/", // 20/05/2026
    APLICA_HASTA: null,
    APLICA_TODOS: true,
    MOTIVOELIMINACIONKey: null,
    MOTIVOELIMINACION_ID: 0,
    OBSERVACIONELIMINACION: null,
    VARIACIONJORNALKey: null,
    CATEGORIACONSTRUCCIONCIVILKey: "-hIzW7JlxJnDP8YcJ8QeEw..",
    ListaCategorias: null,
    ListaMotivoEliminacionIncremento: null,
    ListaAplicaTodos: null,
    CATEGORIA: "Oficial",
    APLICATODOS: "Si",
    ES_ULTIMO: true,
    JORNALFORMAT: "S/ 120.00",
    EDITAR: false,
    SerialKey: "K5cSdbYG4Tq-8igfzE_lNg..",
    ESTADO: "A",
    USUARIO_REG: "jmendoza",
    FECHA_REG: "/Date(1779331975000)/",
    USUARIO_ACT: null,
    FECHA_ACT: null,
    FILTRO: null,
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 1
  },
  {
    VARIACIONJORNAL_ID: 0,
    CATEGORIACONSTRUCCIONCIVIL_ID: 1,
    JORNALDIARIO: 150,
    APLICA_DESDE: "/Date(1778821200000)/", // 15/05/2026
    APLICA_HASTA: null,
    APLICA_TODOS: true,
    MOTIVOELIMINACIONKey: null,
    MOTIVOELIMINACION_ID: 0,
    OBSERVACIONELIMINACION: null,
    VARIACIONJORNALKey: null,
    CATEGORIACONSTRUCCIONCIVILKey: "-hIzW7JlxJnDP8YcJ8Qoper..",
    ListaCategorias: null,
    ListaMotivoEliminacionIncremento: null,
    ListaAplicaTodos: null,
    CATEGORIA: "Operario",
    APLICATODOS: "Si",
    ES_ULTIMO: true,
    JORNALFORMAT: "S/ 150.00",
    EDITAR: false,
    SerialKey: "K5cSdbYG4Tq-operario..",
    ESTADO: "A",
    USUARIO_REG: "sys",
    FECHA_REG: "/Date(1778907600000)/",
    USUARIO_ACT: null,
    FECHA_ACT: null,
    FILTRO: null,
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 1
  },
  {
    VARIACIONJORNAL_ID: 0,
    CATEGORIACONSTRUCCIONCIVIL_ID: 2,
    JORNALDIARIO: 95,
    APLICA_DESDE: "/Date(1778389200000)/", // 10/05/2026
    APLICA_HASTA: null,
    APLICA_TODOS: true,
    MOTIVOELIMINACIONKey: null,
    MOTIVOELIMINACION_ID: 0,
    OBSERVACIONELIMINACION: null,
    VARIACIONJORNALKey: null,
    CATEGORIACONSTRUCCIONCIVILKey: "-hIzW7JlxJnDP8YcJ8Qpeon..",
    ListaCategorias: null,
    ListaMotivoEliminacionIncremento: null,
    ListaAplicaTodos: null,
    CATEGORIA: "Peón",
    APLICATODOS: "Si",
    ES_ULTIMO: true,
    JORNALFORMAT: "S/ 95.00",
    EDITAR: false,
    SerialKey: "K5cSdbYG4Tq-peon..",
    ESTADO: "A",
    USUARIO_REG: "sys",
    FECHA_REG: "/Date(1778475600000)/",
    USUARIO_ACT: null,
    FECHA_ACT: null,
    FILTRO: null,
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 1
  },
  {
    VARIACIONJORNAL_ID: 0,
    CATEGORIACONSTRUCCIONCIVIL_ID: 0,
    JORNALDIARIO: 110,
    APLICA_DESDE: "/Date(1735689600000)/", // 01/01/2025
    APLICA_HASTA: "/Date(1779166800000)/", // 19/05/2026
    APLICA_TODOS: true,
    MOTIVOELIMINACIONKey: null,
    MOTIVOELIMINACION_ID: 0,
    OBSERVACIONELIMINACION: null,
    VARIACIONJORNALKey: null,
    CATEGORIACONSTRUCCIONCIVILKey: "-hIzW7JlxJnDP8YcJ8QeEw..",
    ListaCategorias: null,
    ListaMotivoEliminacionIncremento: null,
    ListaAplicaTodos: null,
    CATEGORIA: "Oficial",
    APLICATODOS: "Si",
    ES_ULTIMO: false,
    JORNALFORMAT: "S/ 110.00",
    EDITAR: false,
    SerialKey: "K5cSdbYG4Tq-oficial-old..",
    ESTADO: "A",
    USUARIO_REG: "sys",
    FECHA_REG: "/Date(1735776000000)/",
    USUARIO_ACT: null,
    FECHA_ACT: null,
    FILTRO: null,
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 1
  },
  {
    VARIACIONJORNAL_ID: 0,
    CATEGORIACONSTRUCCIONCIVIL_ID: 1,
    JORNALDIARIO: 140,
    APLICA_DESDE: "/Date(1735689600000)/", // 01/01/2025
    APLICA_HASTA: "/Date(1778734800000)/", // 14/05/2026
    APLICA_TODOS: true,
    MOTIVOELIMINACIONKey: null,
    MOTIVOELIMINACION_ID: 0,
    OBSERVACIONELIMINACION: null,
    VARIACIONJORNALKey: null,
    CATEGORIACONSTRUCCIONCIVILKey: "-hIzW7JlxJnDP8YcJ8Qoper..",
    ListaCategorias: null,
    ListaMotivoEliminacionIncremento: null,
    ListaAplicaTodos: null,
    CATEGORIA: "Operario",
    APLICATODOS: "Si",
    ES_ULTIMO: false,
    JORNALFORMAT: "S/ 140.00",
    EDITAR: false,
    SerialKey: "K5cSdbYG4Tq-oper-old..",
    ESTADO: "A",
    USUARIO_REG: "sys",
    FECHA_REG: "/Date(1735776000000)/",
    USUARIO_ACT: null,
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
