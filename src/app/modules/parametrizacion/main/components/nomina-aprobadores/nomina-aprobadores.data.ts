export interface TipoDocumento {
  TIPODOCUMENTO_ID: number;
  DESCRIPCION: string | null;
  ABREVIATURA: string;
  DIGITOS: number | null;
  ES_NUMERICO: boolean | null;
}

export interface NominaAprobador {
  NOMINAAPROBADORES_ID: number;
  FLG_VIGENTE: boolean;
  NOMBRES: string | null;
  APELLIDOS: string | null;
  TIPODOCUMENTO_ID: number | null;
  NUMDOCUMENTO: string;
  TIPODOCUMENTOKey: string;
  TIPODOCUMENTO: TipoDocumento;
  NOMBRECOMPLETO: string;
  AVATARTRABAJADOR: string;
  ESTADO: string;
  USUARIO_REG: string;
  FECHA_REG: string;
  USUARIO_ACT: string;
  FECHA_ACT: string;
  SerialKey: string;
}

export const TIPO_DOCUMENTO_OPTIONS: TipoDocumento[] = [
  {
    TIPODOCUMENTO_ID: 1,
    DESCRIPCION: 'DOCUMENTO NACIONAL DE IDENTIDAD',
    ABREVIATURA: 'DNI',
    DIGITOS: 8,
    ES_NUMERICO: true
  },
  {
    TIPODOCUMENTO_ID: 2,
    DESCRIPCION: 'CARNÉ DE EXTRANJERÍA',
    ABREVIATURA: 'CE',
    DIGITOS: 9,
    ES_NUMERICO: false
  },
  {
    TIPODOCUMENTO_ID: 3,
    DESCRIPCION: 'REGISTRO ÚNICO DE CONTRIBUYENTES',
    ABREVIATURA: 'RUC',
    DIGITOS: 11,
    ES_NUMERICO: true
  },
  {
    TIPODOCUMENTO_ID: 4,
    DESCRIPCION: 'PASAPORTE',
    ABREVIATURA: 'PAS',
    DIGITOS: 12,
    ES_NUMERICO: false
  }
];

export const NOMINA_APROBADORES_MOCK: NominaAprobador[] = [
  {
    NOMINAAPROBADORES_ID: 0,
    FLG_VIGENTE: false,
    NOMBRES: 'LUISA',
    APELLIDOS: 'MARTINEZ',
    TIPODOCUMENTO_ID: 1,
    NUMDOCUMENTO: '56890011',
    TIPODOCUMENTOKey: 'nZdUDxu1R2DBTZB_AmRsfw..',
    TIPODOCUMENTO: {
      TIPODOCUMENTO_ID: 0,
      DESCRIPCION: null,
      ABREVIATURA: 'DNI',
      DIGITOS: null,
      ES_NUMERICO: null
    },
    NOMBRECOMPLETO: 'LUISA MARTINEZ',
    AVATARTRABAJADOR: 'LM',
    ESTADO: 'A',
    USUARIO_REG: 'jmendoza',
    FECHA_REG: '/Date(1729725781000)/',
    USUARIO_ACT: 'jmendoza',
    FECHA_ACT: '/Date(1769442773000)/',
    SerialKey: 'nZdUDxu1R2DBTZB_AmRsfw..'
  },
  {
    NOMINAAPROBADORES_ID: 0,
    FLG_VIGENTE: true,
    NOMBRES: 'JEYSER',
    APELLIDOS: 'MENDOZA FERNANDEZ',
    TIPODOCUMENTO_ID: 1,
    NUMDOCUMENTO: '13467890',
    TIPODOCUMENTOKey: 'nZdUDxu1R2DBTZB_AmRsfw..',
    TIPODOCUMENTO: {
      TIPODOCUMENTO_ID: 0,
      DESCRIPCION: null,
      ABREVIATURA: 'DNI',
      DIGITOS: null,
      ES_NUMERICO: null
    },
    NOMBRECOMPLETO: 'JEYSER  MENDOZA FERNANDEZ',
    AVATARTRABAJADOR: 'JM',
    ESTADO: 'A',
    USUARIO_REG: 'jmendoza',
    FECHA_REG: '/Date(1760366332000)/',
    USUARIO_ACT: 'jmendoza',
    FECHA_ACT: '/Date(1773692123000)/',
    SerialKey: 'kEAENfROYI22y2N_iEcxow..'
  },
  {
    NOMINAAPROBADORES_ID: 0,
    FLG_VIGENTE: false,
    NOMBRES: 'DANIEL',
    APELLIDOS: 'REYES',
    TIPODOCUMENTO_ID: 1,
    NUMDOCUMENTO: '89898080',
    TIPODOCUMENTOKey: 'nZdUDxu1R2DBTZB_AmRsfw..',
    TIPODOCUMENTO: {
      TIPODOCUMENTO_ID: 0,
      DESCRIPCION: null,
      ABREVIATURA: 'DNI',
      DIGITOS: null,
      ES_NUMERICO: null
    },
    NOMBRECOMPLETO: 'DANIEL REYES',
    AVATARTRABAJADOR: 'DR',
    ESTADO: 'A',
    USUARIO_REG: 'jmendoza',
    FECHA_REG: '/Date(1774454622000)/',
    USUARIO_ACT: 'jmendoza',
    FECHA_ACT: '/Date(1774454636000)/',
    SerialKey: 'yffGoKuwPg2b5qJMnIBJ8w..'
  }
];
