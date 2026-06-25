/**
 * Evento enviado por el backend cuando los permisos de un rol cambian.
 */
export interface PermissionUpdateEvent {
    /** Tipo de evento; siempre "PERMISSIONS_UPDATED" para este flujo. */
    type: 'PERMISSIONS_UPDATED';

    /** Identificador del rol cuyos permisos fueron modificados. */
    roleId: number;

    /** Nombre descriptivo del rol. */
    roleName: string;

    /** Fecha/hora del cambio en formato ISO 8601 (UTC). */
    timestamp: string;
}
