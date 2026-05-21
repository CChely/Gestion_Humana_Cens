import { Component } from '@angular/core';

interface EmployeeType {
  id: number;
  name: string;
}

interface SalaryStructure {
  id: string;
  name: string;
  type: string;
  useWorkedDays: boolean;
  country: string;
  reportName: string;
  rules: string[];
}

interface SalaryRule {
  id: string;
  name: string;
  code: string;
  category: 'Básico' | 'Bruto' | 'Subsidio' | 'Bonificación' | 'Deducción' | 'Retención' | 'Neto' | 'Contribución de la empresa';
  sequence: number;
  debitAccount: string;
  creditAccount: string;
  pythonCode: string;
  isActive: boolean;
}

interface AFP {
  id: string;
  name: string;
  aporte: number;
  seguro: number;
  comision: number;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  // Estado de navegación activo
  activeTab: string = 'periodoCalculo';

  // Notificaciones Toast del Padre (si es necesario)
  toastMessage: string | null = null;
  toastType: 'success' | 'error' = 'success';

  // Parámetros y variables generales de nómina
  smv: number = 1025;
  uit: number = 5200;
  asigFamiliarPct: number = 10;
  essaludPct: number = 9;

  // Tasas de Pensiones Oficiales
  onpPct: number = 13;
  afps: AFP[] = [
    { id: 'integra', name: 'AFP Integra', aporte: 10, seguro: 1.70, comision: 1.55 },
    { id: 'prima', name: 'AFP Prima', aporte: 10, seguro: 1.70, comision: 1.60 },
    { id: 'profuturo', name: 'AFP Profuturo', aporte: 10, seguro: 1.70, comision: 1.69 },
    { id: 'habitat', name: 'AFP Habitat', aporte: 10, seguro: 1.70, comision: 1.47 }
  ];

  // Clasificación de Empleados obtenidos de las capturas CENS-Odoo
  employeeTypes: EmployeeType[] = [
    { id: 8, name: 'Practicante' },
    { id: 5, name: 'Intermitente' },
    { id: 2, name: 'Plazo Indefinido' },
    { id: 3, name: 'Plazo Fijo o Determinado' },
    { id: 1, name: 'LOCACIÓN DE SERVICIOS 4ta-CAT' },
    { id: 6, name: 'Practicas Profesionales' },
    { id: 7, name: 'Servicio Específico' },
    { id: 4, name: 'Tiempo Parcial' }
  ];

  // Estructuras salariales
  structures: SalaryStructure[] = [
    {
      id: 'cens_regular',
      name: 'Planilla CENS-Regular',
      type: 'Nómina CENS - Regular',
      useWorkedDays: true,
      country: 'Global',
      reportName: 'Recibo de nómina',
      rules: ['BASIC_RULE', 'ASIG_FAMIL_RULE', 'VALES_RULE', 'GROSS_RULE', 'PENSION_RULE', 'QUINTA_RULE', 'JUDICIAL_RULE', 'NET_RULE', 'ESSALUD_RULE']
    },
    {
      id: 'cens_grati',
      name: 'Planilla CENS-Gratificaciones',
      type: 'Nómina CENS - Regular',
      useWorkedDays: true,
      country: 'Global',
      reportName: 'GRATI-12-2022',
      rules: ['BASIC_RULE', 'ASIG_FAMIL_RULE', 'GROSS_RULE', 'NET_RULE']
    },
    {
      id: 'cens_practicante',
      name: 'Pago Practicantes',
      type: 'Nómina CENS - Practicantes',
      useWorkedDays: true,
      country: 'Global',
      reportName: 'Recibo de nómina - NONE',
      rules: ['BASIC_RULE', 'NET_RULE']
    }
  ];

  selectedStructureId: string = 'cens_regular';

  // Reglas predeterminadas
  rules: SalaryRule[] = [
    {
      id: 'BASIC_RULE',
      name: 'Salario básico total',
      code: 'BASIC',
      category: 'Básico',
      sequence: 1,
      debitAccount: '6211000',
      creditAccount: '4111000',
      pythonCode: 'result = (WAGE / 30) * DAYS',
      isActive: true
    },
    {
      id: 'ASIG_FAMIL_RULE',
      name: 'Asignación Familiar',
      code: 'ASIGN_FAMIL',
      category: 'Básico',
      sequence: 2,
      debitAccount: '6211100',
      creditAccount: '4111000',
      pythonCode: 'result = ASIG_FAM',
      isActive: true
    },
    {
      id: 'VALES_RULE',
      name: 'Vale de Alimentación',
      code: 'VALED_ALIME',
      category: 'Bonificación',
      sequence: 3,
      debitAccount: '6211113',
      creditAccount: '4111000',
      pythonCode: 'result = VALES',
      isActive: true
    },
    {
      id: 'GROSS_RULE',
      name: 'Bruto',
      code: 'GROSS',
      category: 'Bruto',
      sequence: 10,
      debitAccount: '',
      creditAccount: '',
      pythonCode: 'result = BASIC + ASIGN_FAMIL + VALED_ALIME',
      isActive: true
    },
    {
      id: 'PENSION_RULE',
      name: 'Fondo Jubilación / AFP',
      code: 'AFP',
      category: 'Deducción',
      sequence: 20,
      debitAccount: '6211000',
      creditAccount: '4170000',
      pythonCode: 'result = GROSS * PENSION',
      isActive: true
    },
    {
      id: 'QUINTA_RULE',
      name: 'Renta de 5ta.Cat.',
      code: 'RENTA_5TACT',
      category: 'Deducción',
      sequence: 25,
      debitAccount: '4111000',
      creditAccount: '4017300',
      pythonCode: 'result = ((GROSS * 14) - (UIT * 7)) * 0.08 / 12 if ((GROSS * 14) > (UIT * 7)) else 0',
      isActive: true
    },
    {
      id: 'JUDICIAL_RULE',
      name: 'Retención Judicial (Alimentos)',
      code: 'RETEN_JUDIC',
      category: 'Retención',
      sequence: 30,
      debitAccount: '4111000',
      creditAccount: '4191000',
      pythonCode: 'result = RET_JUDIC',
      isActive: true
    },
    {
      id: 'NET_RULE',
      name: 'Salario neto',
      code: 'NET',
      category: 'Neto',
      sequence: 99,
      debitAccount: '4111000',
      creditAccount: '1041000',
      pythonCode: 'result = GROSS - AFP - RENTA_5TACT - RETEN_JUDIC',
      isActive: true
    },
    {
      id: 'ESSALUD_RULE',
      name: 'EsSalud',
      code: 'ESSALUD',
      category: 'Contribución de la empresa',
      sequence: 100,
      debitAccount: '6271000',
      creditAccount: '4031000',
      pythonCode: 'result = GROSS * 0.09',
      isActive: true
    }
  ];

  selectedRuleId: string = 'BASIC_RULE';

  // Parámetros del simulador (Sandbox)
  simSalary: number = 3500;
  simDays: number = 30;
  simHasChildren: boolean = true;
  simPensionType: string = 'integra';
  simEmployeeTypeId: number = 2;
  simVales: number = 200;
  simRetJudicial: number = 150;

  // Propiedad calculada de Asignación Familiar
  get calculatedAsigFamiliar(): number {
    return (this.smv * this.asigFamiliarPct) / 100;
  }

  // Obtiene la regla activa actualmente seleccionada
  get activeRule(): SalaryRule | undefined {
    return this.rules.find(r => r.id === this.selectedRuleId);
  }

  getRuleCodeById(id: string): string {
    const r = this.rules.find(x => x.id === id);
    return r ? r.code : id;
  }

  getSelectedStructureName(): string {
    const s = this.structures.find(x => x.id === this.selectedStructureId);
    return s ? s.name : '';
  }

  getSelectedEmployeeTypeName(): string {
    const t = this.employeeTypes.find(x => x.id === this.simEmployeeTypeId);
    return t ? t.name : 'No asignado';
  }

  // Obtiene el porcentaje de pensión consolidado del trabajador según tipo de régimen
  get activePensionPct(): number {
    if (this.simPensionType === 'onp') {
      return this.onpPct;
    }
    const afp = this.afps.find(x => x.id === this.simPensionType);
    return afp ? (afp.aporte + afp.seguro + afp.comision) : 0;
  }

  // Evaluador dinámico de nómina que actúa como un "computed" clásico en Angular 15
  get computedPayrollLines(): any[] {
    const structure = this.structures.find(s => s.id === this.selectedStructureId);
    if (!structure) return [];

    const activeRules = this.rules
      .filter(r => structure.rules.includes(r.id) && r.isActive)
      .sort((a, b) => a.sequence - b.sequence);

    const context: Record<string, number> = {
      WAGE: this.simSalary,
      DAYS: this.simDays,
      SMV: this.smv,
      UIT: this.uit,
      ASIG_FAM: this.simHasChildren ? this.calculatedAsigFamiliar : 0,
      VALES: this.simVales,
      RET_JUDIC: this.simRetJudicial,
      PENSION: this.activePensionPct / 100,
    };

    const results: any[] = [];

    for (const rule of activeRules) {
      const calculatedValue = this.evaluateFormula(rule.pythonCode, context);
      context[rule.code] = calculatedValue;

      results.push({
        code: rule.code,
        name: rule.name,
        category: rule.category,
        value: calculatedValue,
        debitAccount: rule.debitAccount,
        creditAccount: rule.creditAccount
      });
    }

    return results;
  }

  getNetSalaryValue(): number {
    const lines = this.computedPayrollLines;
    const netLine = lines.find(l => l.category === 'Neto');
    if (netLine) return netLine.value;
    const basic = lines.find(l => l.code === 'BASIC')?.value || 0;
    const fam = lines.find(l => l.code === 'ASIGN_FAMIL')?.value || 0;
    return basic + fam;
  }

  // Intérprete matemático seguro con soporte condicional inline estilo Python
  evaluateFormula(codeLine: string, context: Record<string, number>): number {
    try {
      let expression = codeLine.trim();

      if (expression.includes('result =')) {
        expression = expression.split('result =')[1];
      }

      expression = expression.split('\n').map(line => line.split('#')[0]).join(' ');

      const sortedKeys = Object.keys(context).sort((a, b) => b.length - a.length);
      for (const token of sortedKeys) {
        const regex = new RegExp('\\b' + token + '\\b', 'g');
        expression = expression.replace(regex, context[token].toString());
      }

      if (expression.includes('if') && expression.includes('else')) {
        const match = expression.match(/(.+)\s+if\s+(.+)\s+else\s+(.+)/);
        if (match) {
          const ifTrueVal = match[1].trim();
          const condition = match[2].trim();
          const ifFalseVal = match[3].trim();
          expression = `(${condition}) ? (${ifTrueVal}) : (${ifFalseVal})`;
        }
      }

      const sanitized = expression.replace(/[^0-9+\-*/().?:\s>=<!&|]/g, '');
      const compiledFunc = Function('"use strict"; return (' + sanitized + ')');
      const val = compiledFunc();
      return isNaN(val) ? 0 : Number(val);
    } catch (e) {
      return 0;
    }
  }

  // Eventos de mutación de inputs
  updateRuleField(ruleId: string, field: string, event: Event) {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const val = field === 'sequence' ? parseInt(target.value) || 0 : target.value;
    this.rules = this.rules.map(r => r.id === ruleId ? { ...r, [field]: val } : r);
  }

  updateAFPField(afpId: string, field: 'aporte' | 'seguro' | 'comision', event: Event) {
    const val = this.parseNumber(event);
    this.afps = this.afps.map(a => a.id === afpId ? { ...a, [field]: val } : a);
  }

  createNewStructure() {
    const newId = 'custom_' + Date.now();
    const newStruct: SalaryStructure = {
      id: newId,
      name: 'Nueva Planilla CENS-Personalizada',
      type: 'Nómina CENS - Regular',
      useWorkedDays: true,
      country: 'Global',
      reportName: 'Recibo de nómina - NUEVO',
      rules: ['BASIC_RULE', 'GROSS_RULE', 'NET_RULE']
    };
    this.structures = [...this.structures, newStruct];
    this.selectedStructureId = newId;
  }

  addNewRule() {
    const newId = 'rule_' + Date.now();
    const newRule: SalaryRule = {
      id: newId,
      name: 'Nueva Regla Adicional',
      code: 'REG_NUEVA',
      category: 'Bonificación',
      sequence: 5,
      debitAccount: '6211115',
      creditAccount: '4111000',
      pythonCode: 'result = WAGE * 0.05',
      isActive: true
    };
    this.rules = [...this.rules, newRule];
    this.selectedRuleId = newId;

    // Auto-vincular a la estructura seleccionada
    this.structures = this.structures.map(s => {
      if (s.id === this.selectedStructureId) {
        return { ...s, rules: [...s.rules, newId] };
      }
      return s;
    });
  }

  deleteRule(ruleId: string) {
    this.rules = this.rules.filter(r => r.id !== ruleId);
    this.structures = this.structures.map(s => ({
      ...s,
      rules: s.rules.filter(id => id !== ruleId)
    }));
    if (this.rules.length > 0) {
      this.selectedRuleId = this.rules[0].id;
    }
  }

  addEmployeeType() {
    const nextId = Math.max(...this.employeeTypes.map(x => x.id)) + 1;
    this.employeeTypes = [...this.employeeTypes, { id: nextId, name: 'Nuevo Tipo de Contrato' }];
  }

  deleteEmployeeType(id: number) {
    this.employeeTypes = this.employeeTypes.filter(t => t.id !== id);
  }

  // Utilitarios de lectura segura
  parseNumber(event: Event): number {
    const input = event.target as HTMLInputElement;
    return input.value ? parseFloat(input.value) : 0;
  }

  parseString(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  parseNum(event: Event): number {
    return parseInt((event.target as HTMLInputElement).value) || 0;
  }

  parseBoolean(event: Event): boolean {
    return (event.target as HTMLInputElement).checked;
  }

  // Control de submenús colapsables
  expandedMenus: { [key: string]: boolean } = {
    nomina: true,
    calculo: false,
    general: false
  };

  toggleSubmenu(menu: string): void {
    this.expandedMenus[menu] = !this.expandedMenus[menu];
  }
}
