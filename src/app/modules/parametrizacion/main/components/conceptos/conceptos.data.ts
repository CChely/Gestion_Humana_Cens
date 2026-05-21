export interface Plame {
  PLAME_ID: number;
  CODIGO: string;
  DESCRIPCION: string;
  DROPDOWNDISPLAY: string;
  SerialKey?: string | null;
  ESTADO?: string | null;
}

export interface ClaseConceptoTipo {
  CLASECONCEPTOTIPO_ID: number;
  CODIGO: string;
  DESCRIPCION: string;
}

export interface ClaseConcepto {
  CLASECONCEPTO_ID: number;
  CLASECONCEPTOTIPO_ID: number | null;
  CODIGO: string;
  DESCRIPCION: string;
  CLASECONCEPTOTIPO?: ClaseConceptoTipo;
}

export interface ConceptoAsociacion {
  ID: number;
  DESCRIPCION: string;
  FLG_ACTIVO: boolean;
}

export interface Concepto {
  CONCEPTO_ID: number;
  PLAME_ID: number | null;
  CLASECONCEPTO_ID: number | null;
  SECUENCIA_CALCULO: number;
  CODIGO: string;
  NOMBRE: string;
  ALIAS: string;
  NOMBREALIAS?: string | null;
  FLG_TIPO: number; // 1: Fijo, 2: Variable, 3: Otros
  FLG_DIASBASEMES: number; // 1: 30 Dias, 2: Días calendario
  FLG_ACTIVO: boolean;
  FLG_TIPO_DESC: string;
  FLG_DIASBASEMES_DESC: string;
  CONCEPTOSKey?: string | null;
  PLAMEKey?: string | null;
  CLASECONCEPTOKey?: string | null;
  PLAME?: Plame;
  CLASECONCEPTO?: ClaseConcepto;
  FLG_GUARDAREFERENCIAS: boolean;
  FLG_FECHACORTE: boolean;
  SerialKey: string;
  ESTADO: string; // "A" for Active, "I" for Inactive
  USUARIO_REG?: string;
  FECHA_REG?: string;
  USUARIO_ACT?: string;
  FECHA_ACT?: string | null;
  
  // Custom associations for multi-step Wizard
  ListaConceptoGrupos?: ConceptoAsociacion[];
  ListaConceptoAcumuladores?: ConceptoAsociacion[];
  ListaConceptoPlanillas?: ConceptoAsociacion[];
}

// Master PLAME lists for dropdown select
export const PLAME_OPTIONS: Plame[] = [
  { PLAME_ID: 1, CODIGO: "0121", DESCRIPCION: "REMUNERACIÓN O JORNAL BÁSICO", DROPDOWNDISPLAY: "0121 - REMUNERACIÓN O JORNAL BÁSICO" },
  { PLAME_ID: 2, CODIGO: "0115", DESCRIPCION: "REMUNERACIÓN DÍA DE DESCANSO Y FERIADOS", DROPDOWNDISPLAY: "0115 - REMUNERACIÓN DÍA DE DESCANSO Y FERIADOS" },
  { PLAME_ID: 3, CODIGO: "0201", DESCRIPCION: "ASIGNACIÓN FAMILIAR", DROPDOWNDISPLAY: "0201 - ASIGNACIÓN FAMILIAR" },
  { PLAME_ID: 4, CODIGO: "0704", DESCRIPCION: "TARDANZAS", DROPDOWNDISPLAY: "0704 - TARDANZAS" },
  { PLAME_ID: 5, CODIGO: "0705", DESCRIPCION: "INASISTENCIAS", DROPDOWNDISPLAY: "0705 - INASISTENCIAS" },
  { PLAME_ID: 6, CODIGO: "0311", DESCRIPCION: "BONIFICACION UNIFICADA DE CONSTRUCCIÓN", DROPDOWNDISPLAY: "0311 - BONIFICACION UNIFICADA DE CONSTRUCCIÓN" },
  { PLAME_ID: 7, CODIGO: "0306", DESCRIPCION: "BONIFICACIONES REGULARES", DROPDOWNDISPLAY: "0306 - BONIFICACIONES REGULARES" },
  { PLAME_ID: 8, CODIGO: "0401", DESCRIPCION: "GRATIFICACIONES FIESTAS PATRIAS Y NAVIDAD", DROPDOWNDISPLAY: "0401 - GRATIFICACIONES FIESTAS PATRIAS Y NAVIDAD" },
  { PLAME_ID: 9, CODIGO: "0118", DESCRIPCION: "REMUNERACIÓN POR VACACIONES TRUNCAS", DROPDOWNDISPLAY: "0118 - REMUNERACIÓN POR VACACIONES TRUNCAS" }
];

// Master Concept Classes (Clase)
export const CLASE_OPTIONS: ClaseConcepto[] = [
  { 
    CLASECONCEPTO_ID: 1, 
    CLASECONCEPTOTIPO_ID: 1, 
    CODIGO: "HCA", 
    DESCRIPCION: "Haberes con aportes",
    CLASECONCEPTOTIPO: { CLASECONCEPTOTIPO_ID: 1, CODIGO: "H", DESCRIPCION: "Haberes" }
  },
  { 
    CLASECONCEPTO_ID: 2, 
    CLASECONCEPTOTIPO_ID: 2, 
    CODIGO: "DSV", 
    DESCRIPCION: "Descuentos varios",
    CLASECONCEPTOTIPO: { CLASECONCEPTOTIPO_ID: 2, CODIGO: "D", DESCRIPCION: "Descuentos" }
  },
  { 
    CLASECONCEPTO_ID: 3, 
    CLASECONCEPTOTIPO_ID: 3, 
    CODIGO: "OTR", 
    DESCRIPCION: "Otros",
    CLASECONCEPTOTIPO: { CLASECONCEPTOTIPO_ID: 3, CODIGO: "O", DESCRIPCION: "Otros" }
  }
];

// Default master list of groups
export const DEFAULT_GROUPS: string[] = [
  "Base vida ley",
  "Imponibles y Tributables",
  "Aportes del Empleador",
  "Base de cálculo para quincena",
  "Base fija Adicional",
  "Descuentos legales",
  "Descuentos varios",
  "Exentos",
  "Extraordinario 5ta",
  "Gratificación",
  "MovVariables de 5ta",
  "Neto adicional",
  "Neto descuento",
  "No base fija Adicional para CTS",
  "No base fija Adicional para Gratificación",
  "No base fija Adicional para Proyección de 5ta",
  "No base fija Adicional para Vacaciones",
  "Otros",
  "Otros ingresos ordinarios",
  "Remuneración adicional a proyectar",
  "Subsidios"
];

// Default master list of accumulators
export const DEFAULT_ACCUMULATORS: string[] = [
  "Quinta Categoría",
  "Aporte Obligatorio SPP",
  "Aporte ONP",
  "Essalud Empleador",
  "CTS",
  "Gratificaciones",
  "Vacaciones"
];

// Default master list of planillas
export const DEFAULT_PLANILLAS: string[] = [
  "Planilla CENS-Regular",
  "Planilla CENS-Gratificaciones",
  "Pago Practicantes"
];

// Helper to generate associations list
export function getInitialAssociations(masterList: string[], activeList: string[] = []): ConceptoAsociacion[] {
  return masterList.map((desc, idx) => ({
    ID: idx + 1,
    DESCRIPCION: desc,
    FLG_ACTIVO: activeList.includes(desc)
  }));
}

// Initial mockup data of Conceptos
export const CONCEPTOS_PAGINADO_DATA: Concepto[] = [
  {
    CONCEPTO_ID: 0,
    PLAME_ID: 1,
    CLASECONCEPTO_ID: 1,
    SECUENCIA_CALCULO: 1,
    CODIGO: "000007",
    NOMBRE: "Básico",
    ALIAS: "BASE",
    FLG_TIPO: 1,
    FLG_DIASBASEMES: 1,
    FLG_ACTIVO: true,
    FLG_TIPO_DESC: "Fijo",
    FLG_DIASBASEMES_DESC: "30 Dias",
    PLAME: PLAME_OPTIONS[0],
    CLASECONCEPTO: CLASE_OPTIONS[0],
    FLG_GUARDAREFERENCIAS: false,
    FLG_FECHACORTE: false,
    SerialKey: "5b9pdrCmoqG73N1wHEYAsA..",
    ESTADO: "A",
    USUARIO_REG: "1002",
    FECHA_REG: "/Date(1640953948000)/",
    USUARIO_ACT: "wflores",
    FECHA_ACT: "/Date(1731692424000)/",
    ListaConceptoGrupos: getInitialAssociations(DEFAULT_GROUPS, ["Base vida ley", "Imponibles y Tributables"]),
    ListaConceptoAcumuladores: getInitialAssociations(DEFAULT_ACCUMULATORS, ["Quinta Categoría", "Aporte Obligatorio SPP", "Aporte ONP", "Essalud Empleador", "CTS", "Gratificaciones", "Vacaciones"]),
    ListaConceptoPlanillas: getInitialAssociations(DEFAULT_PLANILLAS, ["Planilla CENS-Regular", "Planilla CENS-Gratificaciones"])
  },
  {
    CONCEPTO_ID: 0,
    PLAME_ID: 1,
    CLASECONCEPTO_ID: 1,
    SECUENCIA_CALCULO: 2,
    CODIGO: "000112",
    NOMBRE: "Jornal Básico",
    ALIAS: "JORNAL",
    FLG_TIPO: 1,
    FLG_DIASBASEMES: 1,
    FLG_ACTIVO: true,
    FLG_TIPO_DESC: "Fijo",
    FLG_DIASBASEMES_DESC: "30 Dias",
    PLAME: PLAME_OPTIONS[0],
    CLASECONCEPTO: CLASE_OPTIONS[0],
    FLG_GUARDAREFERENCIAS: true,
    FLG_FECHACORTE: false,
    SerialKey: "0H8pn3ExXfCm36lT0YWMJg..",
    ESTADO: "A",
    USUARIO_REG: "sujeyp",
    FECHA_REG: "/Date(1715026730000)/",
    USUARIO_ACT: "sujeyp",
    FECHA_ACT: "/Date(1715026750000)/",
    ListaConceptoGrupos: getInitialAssociations(DEFAULT_GROUPS, ["Base vida ley", "Imponibles y Tributables"]),
    ListaConceptoAcumuladores: getInitialAssociations(DEFAULT_ACCUMULATORS, ["Quinta Categoría", "Aporte Obligatorio SPP"]),
    ListaConceptoPlanillas: getInitialAssociations(DEFAULT_PLANILLAS, ["Planilla CENS-Regular"])
  },
  {
    CONCEPTO_ID: 0,
    PLAME_ID: 1,
    CLASECONCEPTO_ID: 1,
    SECUENCIA_CALCULO: 3,
    CODIGO: "000170",
    NOMBRE: "Pago en descanso",
    ALIAS: "PD_CTC",
    FLG_TIPO: 1,
    FLG_DIASBASEMES: 1,
    FLG_ACTIVO: true,
    FLG_TIPO_DESC: "Fijo",
    FLG_DIASBASEMES_DESC: "30 Dias",
    PLAME: PLAME_OPTIONS[0],
    CLASECONCEPTO: CLASE_OPTIONS[0],
    FLG_GUARDAREFERENCIAS: false,
    FLG_FECHACORTE: false,
    SerialKey: "Z1T7HFXmoS3a55WSaU3IuQ..",
    ESTADO: "A",
    USUARIO_REG: "mcasapia",
    FECHA_REG: "/Date(1752296370000)/",
    ListaConceptoGrupos: getInitialAssociations(DEFAULT_GROUPS, ["Base vida ley"]),
    ListaConceptoAcumuladores: getInitialAssociations(DEFAULT_ACCUMULATORS, ["Quinta Categoría"]),
    ListaConceptoPlanillas: getInitialAssociations(DEFAULT_PLANILLAS, ["Planilla CENS-Regular"])
  },
  {
    CONCEPTO_ID: 0,
    PLAME_ID: 2,
    CLASECONCEPTO_ID: 1,
    SECUENCIA_CALCULO: 4,
    CODIGO: "000113",
    NOMBRE: "Feriado",
    ALIAS: "FERIAD",
    FLG_TIPO: 1,
    FLG_DIASBASEMES: 1,
    FLG_ACTIVO: true,
    FLG_TIPO_DESC: "Fijo",
    FLG_DIASBASEMES_DESC: "30 Dias",
    PLAME: PLAME_OPTIONS[1],
    CLASECONCEPTO: CLASE_OPTIONS[0],
    FLG_GUARDAREFERENCIAS: true,
    FLG_FECHACORTE: false,
    SerialKey: "eRC2q6H2XvsbLLFpqDcWdA..",
    ESTADO: "A",
    USUARIO_REG: "sujeyp",
    FECHA_REG: "/Date(1715026975000)/",
    USUARIO_ACT: "wflores",
    FECHA_ACT: "/Date(1727907934000)/",
    ListaConceptoGrupos: getInitialAssociations(DEFAULT_GROUPS, ["Base vida ley", "Imponibles y Tributables"]),
    ListaConceptoAcumuladores: getInitialAssociations(DEFAULT_ACCUMULATORS, ["Quinta Categoría", "Aporte Obligatorio SPP", "Essalud Empleador"]),
    ListaConceptoPlanillas: getInitialAssociations(DEFAULT_PLANILLAS, ["Planilla CENS-Regular", "Planilla CENS-Gratificaciones"])
  },
  {
    CONCEPTO_ID: 0,
    PLAME_ID: 5,
    CLASECONCEPTO_ID: 2,
    SECUENCIA_CALCULO: 5,
    CODIGO: "000168",
    NOMBRE: "Inasistencia proporcional descanso semanal",
    ALIAS: "INASDOM",
    FLG_TIPO: 3,
    FLG_DIASBASEMES: 1,
    FLG_ACTIVO: true,
    FLG_TIPO_DESC: "Otros",
    FLG_DIASBASEMES_DESC: "30 Dias",
    PLAME: PLAME_OPTIONS[4],
    CLASECONCEPTO: CLASE_OPTIONS[1],
    FLG_GUARDAREFERENCIAS: true,
    FLG_FECHACORTE: false,
    SerialKey: "XMgcetjHEqZQ2H3vSWx4jg..",
    ESTADO: "A",
    USUARIO_REG: "mcasapia",
    FECHA_REG: "/Date(1752296370000)/",
    USUARIO_ACT: "jmendoza",
    FECHA_ACT: "/Date(1761066604000)/",
    ListaConceptoGrupos: getInitialAssociations(DEFAULT_GROUPS, ["Descuentos varios", "Descuentos legales"]),
    ListaConceptoAcumuladores: getInitialAssociations(DEFAULT_ACCUMULATORS, []),
    ListaConceptoPlanillas: getInitialAssociations(DEFAULT_PLANILLAS, ["Planilla CENS-Regular"])
  },
  {
    CONCEPTO_ID: 0,
    PLAME_ID: 4,
    CLASECONCEPTO_ID: 2,
    SECUENCIA_CALCULO: 6,
    CODIGO: "000023",
    NOMBRE: "Tardanza",
    ALIAS: "TARD_HR",
    FLG_TIPO: 3,
    FLG_DIASBASEMES: 1,
    FLG_ACTIVO: true,
    FLG_TIPO_DESC: "Otros",
    FLG_DIASBASEMES_DESC: "30 Dias",
    PLAME: PLAME_OPTIONS[3],
    CLASECONCEPTO: CLASE_OPTIONS[1],
    FLG_GUARDAREFERENCIAS: false,
    FLG_FECHACORTE: false,
    SerialKey: "ZHH3WWYGqmEskuos__OG9Q..",
    ESTADO: "A",
    USUARIO_REG: "1002",
    FECHA_REG: "/Date(1643129412000)/",
    ListaConceptoGrupos: getInitialAssociations(DEFAULT_GROUPS, ["Descuentos varios"]),
    ListaConceptoAcumuladores: getInitialAssociations(DEFAULT_ACCUMULATORS, []),
    ListaConceptoPlanillas: getInitialAssociations(DEFAULT_PLANILLAS, ["Planilla CENS-Regular"])
  },
  {
    CONCEPTO_ID: 0,
    PLAME_ID: 3,
    CLASECONCEPTO_ID: 1,
    SECUENCIA_CALCULO: 7,
    CODIGO: "000004",
    NOMBRE: "Asignación Familiar",
    ALIAS: "ASIG_FAM",
    FLG_TIPO: 1,
    FLG_DIASBASEMES: 1,
    FLG_ACTIVO: true,
    FLG_TIPO_DESC: "Fijo",
    FLG_DIASBASEMES_DESC: "30 Dias",
    PLAME: PLAME_OPTIONS[2],
    CLASECONCEPTO: CLASE_OPTIONS[0],
    FLG_GUARDAREFERENCIAS: false,
    FLG_FECHACORTE: false,
    SerialKey: "wusyhE6I0GalNr8InJYf8g..",
    ESTADO: "A",
    USUARIO_REG: "1002",
    FECHA_REG: "/Date(1640953663000)/",
    ListaConceptoGrupos: getInitialAssociations(DEFAULT_GROUPS, ["Base vida ley", "Imponibles y Tributables"]),
    ListaConceptoAcumuladores: getInitialAssociations(DEFAULT_ACCUMULATORS, ["Quinta Categoría", "Aporte Obligatorio SPP", "Essalud Empleador", "CTS", "Gratificaciones", "Vacaciones"]),
    ListaConceptoPlanillas: getInitialAssociations(DEFAULT_PLANILLAS, ["Planilla CENS-Regular"])
  },
  {
    CONCEPTO_ID: 0,
    PLAME_ID: 4,
    CLASECONCEPTO_ID: 3,
    SECUENCIA_CALCULO: 7,
    CODIGO: "000196",
    NOMBRE: "Salidas tempranas",
    ALIAS: "SAL_TEMP",
    FLG_TIPO: 3,
    FLG_DIASBASEMES: 1,
    FLG_ACTIVO: true,
    FLG_TIPO_DESC: "Otros",
    FLG_DIASBASEMES_DESC: "30 Dias",
    PLAME: PLAME_OPTIONS[3],
    CLASECONCEPTO: CLASE_OPTIONS[2],
    FLG_GUARDAREFERENCIAS: false,
    FLG_FECHACORTE: false,
    SerialKey: "dgb1G5r0_IoZo_-G7pm6xw..",
    ESTADO: "A",
    USUARIO_REG: "wflores",
    FECHA_REG: "/Date(1754667365000)/",
    ListaConceptoGrupos: getInitialAssociations(DEFAULT_GROUPS, ["Otros"]),
    ListaConceptoAcumuladores: getInitialAssociations(DEFAULT_ACCUMULATORS, []),
    ListaConceptoPlanillas: getInitialAssociations(DEFAULT_PLANILLAS, ["Planilla CENS-Regular"])
  },
  {
    CONCEPTO_ID: 0,
    PLAME_ID: 1,
    CLASECONCEPTO_ID: 1,
    SECUENCIA_CALCULO: 8,
    CODIGO: "000114",
    NOMBRE: "Descanso Médico",
    ALIAS: "DM_CTC",
    FLG_TIPO: 1,
    FLG_DIASBASEMES: 1,
    FLG_ACTIVO: true,
    FLG_TIPO_DESC: "Fijo",
    FLG_DIASBASEMES_DESC: "30 Dias",
    PLAME: PLAME_OPTIONS[0],
    CLASECONCEPTO: CLASE_OPTIONS[0],
    FLG_GUARDAREFERENCIAS: true,
    FLG_FECHACORTE: false,
    SerialKey: "lKT_ZTycILWX_M84TXbzkw..",
    ESTADO: "A",
    USUARIO_REG: "sujeyp",
    FECHA_REG: "/Date(1715028088000)/",
    USUARIO_ACT: "sujeyp",
    FECHA_ACT: "/Date(1715028189000)/",
    ListaConceptoGrupos: getInitialAssociations(DEFAULT_GROUPS, ["Base vida ley", "Imponibles y Tributables"]),
    ListaConceptoAcumuladores: getInitialAssociations(DEFAULT_ACCUMULATORS, ["Essalud Empleador"]),
    ListaConceptoPlanillas: getInitialAssociations(DEFAULT_PLANILLAS, ["Planilla CENS-Regular"])
  },
  {
    CONCEPTO_ID: 0,
    PLAME_ID: 2,
    CLASECONCEPTO_ID: 1,
    SECUENCIA_CALCULO: 9,
    CODIGO: "000115",
    NOMBRE: "Descanso Dominical",
    ALIAS: "DSO",
    FLG_TIPO: 1,
    FLG_DIASBASEMES: 1,
    FLG_ACTIVO: true,
    FLG_TIPO_DESC: "Fijo",
    FLG_DIASBASEMES_DESC: "30 Dias",
    PLAME: PLAME_OPTIONS[1],
    CLASECONCEPTO: CLASE_OPTIONS[0],
    FLG_GUARDAREFERENCIAS: true,
    FLG_FECHACORTE: false,
    SerialKey: "bjv6Sda6Nd-wBbA5vxz0wg..",
    ESTADO: "A",
    USUARIO_REG: "sujeyp",
    FECHA_REG: "/Date(1715028582000)/",
    USUARIO_ACT: "sujeyp",
    FECHA_ACT: "/Date(1715034347000)/",
    ListaConceptoGrupos: getInitialAssociations(DEFAULT_GROUPS, ["Base vida ley", "Imponibles y Tributables"]),
    ListaConceptoAcumuladores: getInitialAssociations(DEFAULT_ACCUMULATORS, ["Quinta Categoría", "Aporte Obligatorio SPP"]),
    ListaConceptoPlanillas: getInitialAssociations(DEFAULT_PLANILLAS, ["Planilla CENS-Regular"])
  },
  {
    CONCEPTO_ID: 0,
    PLAME_ID: 6,
    CLASECONCEPTO_ID: 1,
    SECUENCIA_CALCULO: 10,
    CODIGO: "000116",
    NOMBRE: "Bonificación Unificada de Construcción",
    ALIAS: "BUC",
    FLG_TIPO: 1,
    FLG_DIASBASEMES: 1,
    FLG_ACTIVO: true,
    FLG_TIPO_DESC: "Fijo",
    FLG_DIASBASEMES_DESC: "30 Dias",
    PLAME: PLAME_OPTIONS[5],
    CLASECONCEPTO: CLASE_OPTIONS[0],
    FLG_GUARDAREFERENCIAS: true,
    FLG_FECHACORTE: false,
    SerialKey: "V5StY_nsnSrOxoNxa19X2w..",
    ESTADO: "A",
    USUARIO_REG: "sujeyp",
    FECHA_REG: "/Date(1715028735000)/",
    USUARIO_ACT: "sujeyp",
    FECHA_ACT: "/Date(1715034353000)/",
    ListaConceptoGrupos: getInitialAssociations(DEFAULT_GROUPS, ["Base vida ley", "Imponibles y Tributables"]),
    ListaConceptoAcumuladores: getInitialAssociations(DEFAULT_ACCUMULATORS, ["Quinta Categoría", "Aporte Obligatorio SPP", "Essalud Empleador"]),
    ListaConceptoPlanillas: getInitialAssociations(DEFAULT_PLANILLAS, ["Planilla CENS-Regular"])
  },
  {
    CONCEPTO_ID: 0,
    PLAME_ID: 2,
    CLASECONCEPTO_ID: 1,
    SECUENCIA_CALCULO: 11,
    CODIGO: "000082",
    NOMBRE: "Primero de Mayo",
    ALIAS: "PRI_MAYO",
    FLG_TIPO: 1,
    FLG_DIASBASEMES: 1,
    FLG_ACTIVO: true,
    FLG_TIPO_DESC: "Fijo",
    FLG_DIASBASEMES_DESC: "30 Dias",
    PLAME: PLAME_OPTIONS[1],
    CLASECONCEPTO: CLASE_OPTIONS[0],
    FLG_GUARDAREFERENCIAS: false,
    FLG_FECHACORTE: false,
    SerialKey: "ZusvMoXrJ06EuLjQDHa6tw..",
    ESTADO: "A",
    USUARIO_REG: "jmendoza",
    FECHA_REG: "/Date(1693237512000)/",
    USUARIO_ACT: "sujeyp",
    FECHA_ACT: "/Date(1716321673000)/",
    ListaConceptoGrupos: getInitialAssociations(DEFAULT_GROUPS, ["Base vida ley", "Imponibles y Tributables"]),
    ListaConceptoAcumuladores: getInitialAssociations(DEFAULT_ACCUMULATORS, ["Quinta Categoría", "Aporte Obligatorio SPP", "Essalud Empleador"]),
    ListaConceptoPlanillas: getInitialAssociations(DEFAULT_PLANILLAS, ["Planilla CENS-Regular", "Planilla CENS-Gratificaciones"])
  },
  {
    CONCEPTO_ID: 0,
    PLAME_ID: 7,
    CLASECONCEPTO_ID: 1,
    SECUENCIA_CALCULO: 12,
    CODIGO: "000172",
    NOMBRE: "Otras Bonificaciones Der_Hab (MJ)",
    ALIAS: "BON_DERECH",
    FLG_TIPO: 1,
    FLG_DIASBASEMES: 1,
    FLG_ACTIVO: true,
    FLG_TIPO_DESC: "Fijo",
    FLG_DIASBASEMES_DESC: "30 Dias",
    PLAME: PLAME_OPTIONS[6],
    CLASECONCEPTO: CLASE_OPTIONS[0],
    FLG_GUARDAREFERENCIAS: false,
    FLG_FECHACORTE: false,
    SerialKey: "uX22P3HmoKj22M_W9YPLwA..",
    ESTADO: "A",
    USUARIO_REG: "sujeyp",
    FECHA_REG: "/Date(1715028975000)/",
    ListaConceptoGrupos: getInitialAssociations(DEFAULT_GROUPS, ["Base vida ley", "Imponibles y Tributables"]),
    ListaConceptoAcumuladores: getInitialAssociations(DEFAULT_ACCUMULATORS, ["Quinta Categoría", "Aporte Obligatorio SPP"]),
    ListaConceptoPlanillas: getInitialAssociations(DEFAULT_PLANILLAS, ["Planilla CENS-Regular"])
  }
];
