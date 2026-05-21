import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-trazabilidad',
  templateUrl: './trazabilidad.component.html',
  styleUrls: ['./trazabilidad.component.scss']
})
export class TrazabilidadComponent implements OnChanges {

  @Input() nombreTabla: string = '';
  @Input() idRegistro: number | null = null;

  historial: any[] = [];
  isLoading: boolean = false;

  constructor(private _dataService: DataService) { }

  ngOnChanges(changes: SimpleChanges): void {
    // Se dispara cuando cambian los inputs (al hacer clic en un registro)
    if (changes['idRegistro'] || changes['nombreTabla']) {
      if (this.idRegistro && this.nombreTabla) {
        this.cargarHistorial();
      } else {
        this.historial = [];
      }
    }
  }

  cargarHistorial(): void {
    this.isLoading = true;

    const payload = {
      data: {
        p_NombreTabla: this.nombreTabla,
        p_IdRegistro: this.idRegistro
      }
    };

    this._dataService.doRequestPost('dbo.uspHistorialObtenerPorTablaYId', payload).subscribe({
      next: (res: any) => {
        const data = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);

        // Parseamos la data y extraemos dinámicamente los cambios
        this.historial = data.map((h: any) => {
          const antiguos = h.ValoresAntiguos && h.ValoresAntiguos !== '{}' ? JSON.parse(h.ValoresAntiguos) : null;
          const nuevos = h.ValoresNuevos && h.ValoresNuevos !== '{}' ? JSON.parse(h.ValoresNuevos) : null;

          let usuarioCorreo = 'Usuario del Sistema';
          let fecha = '';
          let accionEs = '';
          let cambios: any[] = [];

          // 1. Extraer usuario (puede venir en el registro nuevo o en el antiguo si es borrado)
          const refData = nuevos || antiguos || {};
          if (refData.UsuarioInfo) {
            try {
              const uInfo = typeof refData.UsuarioInfo === 'string' ? JSON.parse(refData.UsuarioInfo) : refData.UsuarioInfo;
              if (uInfo.Correo) usuarioCorreo = uInfo.Correo;
            } catch (e) {}
          }

          // 2. Extraer Fecha, Acción y Comparar Cambios según el tipo de movimiento
          if (h.TipoMovimiento === 'INSERT') {
            accionEs = 'Creación';
            fecha = refData.FechaCreacion || '';
            if (nuevos) {
              Object.keys(nuevos).forEach(key => {
                if (!this._esCampoAuditoria(key) && nuevos[key] !== null && nuevos[key] !== '') {
                  cambios.push({ campo: key, valorNuevo: nuevos[key] });
                }
              });
            }
          } else if (h.TipoMovimiento === 'UPDATE') {
            accionEs = 'Edición';
            fecha = refData.FechaActualizacion || refData.FechaCreacion || '';
            if (antiguos && nuevos) {
              Object.keys(nuevos).forEach(key => {
                if (!this._esCampoAuditoria(key) && antiguos[key] !== nuevos[key]) {
                  cambios.push({ campo: key, valorAntiguo: antiguos[key], valorNuevo: nuevos[key] });
                }
              });
            }
          } else if (h.TipoMovimiento === 'DELETE') {
            accionEs = 'Eliminación';
            // Fijamos una fecha de ejemplo hasta que tu tabla traiga FechaEliminacion
            fecha = refData.FechaEliminacion || refData.FechaActualizacion || '';
          }

          return {
            ...h,
            AccionEs: accionEs,
            UsuarioCorreo: usuarioCorreo,
            Fecha: fecha,
            Cambios: cambios
          };
        }).filter((item: any) => {
          // Omitir las actualizaciones (UPDATE) que no tienen diferencias reales en los datos
          return !(item.TipoMovimiento === 'UPDATE' && item.Cambios.length === 0);
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar historial de trazabilidad:', err);
        this.historial = [];
        this.isLoading = false;
      }
    });
  }

  /**
   * Omite los campos de control interno para que no se muestren como "cambios"
   */
  private _esCampoAuditoria(campo: string): boolean {
    const auditoria = [
      'Id', 'UsuarioCreacion', 'FechaCreacion',
      'UsuarioActualizacion', 'FechaActualizacion',
      'UsuarioEliminacion', 'FechaEliminacion',
      'EstaEliminado', 'UsuarioInfo'
    ];
    return auditoria.includes(campo);
  }
}
