export interface ParametricaCampo {
  PARAMETRICASCAMPO_ID: number;
  CODIGO: string;
  TABLA: string;
  COLUMNA: string;
  FLG_OBLIGATORIO: boolean;
  FLG_MANTENIMIENTO: boolean;
  FLG_CARGAMASIVA: boolean;
  NUM_ORDEN: number;
  ESTADO: string;
  USUARIO_REG: string;
  FECHA_REG: string;
  USUARIO_ACT: string | null;
  FECHA_ACT: string | null;
  SerialKey: string;
  
  // Auxiliary properties for API representation matching the screenshot
  PageSize?: number;
  PageNumber?: number;
  TotalPage?: number;
  FLG_MASIVO?: boolean;
  FLG_MEMORIA?: boolean;
  FLG_MODIFICADO?: boolean;
  FILTRO?: string | null;
}

export const CAMPOS_ADICIONALES_MOCK: ParametricaCampo[] = [
  {
    PARAMETRICASCAMPO_ID: 1,
    CODIGO: "000001",
    TABLA: "Mantenimiento trabajador",
    COLUMNA: "Prima Textil",
    FLG_OBLIGATORIO: false,
    FLG_MANTENIMIENTO: false,
    FLG_CARGAMASIVA: true,
    NUM_ORDEN: 1,
    ESTADO: "A",
    USUARIO_REG: "sys",
    FECHA_REG: "/Date(1779250000000)/",
    USUARIO_ACT: null,
    FECHA_ACT: null,
    SerialKey: "key_campo_001..",
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    FILTRO: null,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 1
  },
  {
    PARAMETRICASCAMPO_ID: 2,
    CODIGO: "000002",
    TABLA: "Mantenimiento trabajador",
    COLUMNA: "Categoría Construcción Civil",
    FLG_OBLIGATORIO: false,
    FLG_MANTENIMIENTO: false,
    FLG_CARGAMASIVA: true,
    NUM_ORDEN: 2,
    ESTADO: "A",
    USUARIO_REG: "sys",
    FECHA_REG: "/Date(1779250100000)/",
    USUARIO_ACT: null,
    FECHA_ACT: null,
    SerialKey: "key_campo_002..",
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    FILTRO: null,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 1
  },
  {
    PARAMETRICASCAMPO_ID: 3,
    CODIGO: "000003",
    TABLA: "Mantenimiento trabajador",
    COLUMNA: "Especialidad Construcción Civil",
    FLG_OBLIGATORIO: false,
    FLG_MANTENIMIENTO: false,
    FLG_CARGAMASIVA: true,
    NUM_ORDEN: 3,
    ESTADO: "A",
    USUARIO_REG: "sys",
    FECHA_REG: "/Date(1779250200000)/",
    USUARIO_ACT: null,
    FECHA_ACT: null,
    SerialKey: "key_campo_003..",
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    FILTRO: null,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 1
  },
  {
    PARAMETRICASCAMPO_ID: 4,
    CODIGO: "000004",
    TABLA: "Mantenimiento trabajador",
    COLUMNA: "Movilidad",
    FLG_OBLIGATORIO: false,
    FLG_MANTENIMIENTO: false,
    FLG_CARGAMASIVA: true,
    NUM_ORDEN: 4,
    ESTADO: "A",
    USUARIO_REG: "sys",
    FECHA_REG: "/Date(1779250300000)/",
    USUARIO_ACT: null,
    FECHA_ACT: null,
    SerialKey: "key_campo_004..",
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    FILTRO: null,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 1
  },
  {
    PARAMETRICASCAMPO_ID: 5,
    CODIGO: "000005",
    TABLA: "Mantenimiento trabajador",
    COLUMNA: "AFP Ley",
    FLG_OBLIGATORIO: false,
    FLG_MANTENIMIENTO: false,
    FLG_CARGAMASIVA: true,
    NUM_ORDEN: 5,
    ESTADO: "A",
    USUARIO_REG: "sys",
    FECHA_REG: "/Date(1779250400000)/",
    USUARIO_ACT: null,
    FECHA_ACT: null,
    SerialKey: "key_campo_005..",
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    FILTRO: null,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 1
  },
  {
    PARAMETRICASCAMPO_ID: 6,
    CODIGO: "000006",
    TABLA: "Mantenimiento trabajador",
    COLUMNA: "APT FCJ",
    FLG_OBLIGATORIO: false,
    FLG_MANTENIMIENTO: false,
    FLG_CARGAMASIVA: true,
    NUM_ORDEN: 6,
    ESTADO: "A",
    USUARIO_REG: "sys",
    FECHA_REG: "/Date(1779250500000)/",
    USUARIO_ACT: null,
    FECHA_ACT: null,
    SerialKey: "key_campo_006..",
    FLG_MASIVO: false,
    FLG_MEMORIA: false,
    FLG_MODIFICADO: false,
    FILTRO: null,
    PageSize: 0,
    PageNumber: 0,
    TotalPage: 1
  }
];
