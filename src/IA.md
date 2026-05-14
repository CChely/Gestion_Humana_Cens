# 📘 Buenas Prácticas de Desarrollo en SQL Server

## 📌 Introducción
Este documento describe las mejores prácticas para el diseño y desarrollo de bases de datos en SQL Server, incluyendo tablas, procedimientos almacenados, vistas e índices. El objetivo es mejorar la mantenibilidad, rendimiento y escalabilidad del sistema.

---

reglas_base_de_datos_v2.1.md
11 KB
Leonardo Burgos — 15:54
# Documentación de *PermisosSP*

Esta documentación describe las tablas y procedimientos almacenados
que gestionan los permisos de procedimientos dentro del sistema.
Se muestra la estructura de las tablas, las restricciones y
la relación entre ellas, además de los procedimientos de inserción y

autorizacion_consultas_sp_rol.md
7 KB
﻿
# 📘 Buenas Prácticas de Desarrollo en SQL Server

## 📌 Introducción
Este documento describe las mejores prácticas para el diseño y desarrollo de bases de datos en SQL Server, incluyendo tablas, procedimientos almacenados, vistas e índices. El objetivo es mejorar la mantenibilidad, rendimiento y escalabilidad del sistema.

---

## 🧱 1. Diseño de Tablas

## 📘 Buenas Prácticas de Desarrollo en SQL Server (Convención en Español)

### 📌 Introducción

El enfoque prioriza:

* Claridad
* Consistencia
* Auditoría
* Compatibilidad técnica
* Nombres de campos en español

---

## 🧱 1. Convención de Nombres en Español

### ✅ Reglas generales

* Usar **PascalCase** (recomendado)
* Todo en español
* Nombres descriptivos

#### ✔️ Correcto

* `NombreEmpleado`
* `FechaCreacion`
* `Salario`

#### ❌ Incorrecto

* `nombre_empleado` (si no es el estándar definido)
* `NomEmp` (abreviación innecesaria)
* `CreatedAt` (mezcla de idiomas)

---

### ⚠️ Restricción de caracteres (MUY IMPORTANTE)

Para evitar errores y problemas de compatibilidad:

#### ❌ NO usar:

* Tildes: `á, é, í, ó, ú`
* Ñ: `ñ`
* Espacios
* Caracteres especiales: `@, #, $, %, &, /, ()`

#### ✔️ Usar solo:

* Letras (A-Z, a-z)
* Números (0-9)

#### Ejemplos:

| Incorrecto       | Correcto        |
| ---------------- | --------------- |
| `Dirección`      | `Direccion`     |
| `Año`            | `Anio`          |
| `Fecha Creación` | `FechaCreacion` |

---

## 🧱 2. Estructura Estándar de Tablas

### 🎯 Componentes obligatorios

Toda tabla debe tener:

1. Clave primaria
2. Campos de negocio
3. Campos de control (auditoría)

---

### 📌 Ejemplo profesional

```sql
CREATE TABLE Empleado (
    Id INT IDENTITY(1,1) PRIMARY KEY,

    -- Campos de negocio
    Nombre VARCHAR(150) NOT NULL,
    Correo VARCHAR(150) NOT NULL,
    Salario DECIMAL(10,2) NOT NULL,

    -- Auditoría
    EstaEliminado BIT NOT NULL DEFAULT 0
);
```

---

## 🔍 3. Campos de Auditoría (Obligatorios)

### 📌 Definición

| Campo                  | Descripción                     |
| ---------------------- | ------------------------------- |
| EstaEliminado          | Indicador lógico de eliminación |

---

## ⚠️ 4. Eliminación Lógica (Soft Delete)

Nunca eliminar físicamente los datos.

```sql
UPDATE Empleado
SET 
    EstaEliminado = 1,
    UsuarioEliminacion = @IdUsuario,
    FechaEliminacion = GETDATE()
WHERE Id = @Id;
```

---

## ⚙️ 5. Tipos de Datos Recomendados

| Uso             | Tipo recomendado |
| --------------- | ---------------- |
| Identificadores | INT              |
| Texto corto     | VARCHAR          |
| Texto largo     | VARCHAR(MAX)     |
| Fechas          | DATETIME2        |
| Booleanos       | BIT              |
| Monetarios      | DECIMAL          |

---

## ⚡ 6. Reglas Clave

### ✅ Evitar NULL innecesarios

Solo permitir NULL cuando sea requerido.

### ✅ Usar valores por defecto

```sql
EstaEliminado BIT DEFAULT 0
```

### ✅ Restricciones

```sql
ALTER TABLE Empleado
ADD CONSTRAINT UQ_Empleado_Correo UNIQUE (Correo);
```

### ✅ Claves foráneas

⚠️ **IMPORTANTE**: Los campos de auditoría (UsuarioCreacion, UsuarioActualizacion, UsuarioEliminacion) **NUNCA** deben tener claves foráneas. Estos campos son de control interno y no deben constreñir la integridad referencial.

```sql
-- ✅ CORRECTO: Relación con campos de negocio
ALTER TABLE Empleado
ADD CONSTRAINT FK_Empleado_Departamento
FOREIGN KEY (IdDepartamento) REFERENCES Departamento(Id);

-- ❌ INCORRECTO: NO usar claves foráneas en campos de auditoría
-- ALTER TABLE Empleado
-- ADD CONSTRAINT FK_Empleado_Usuario
-- FOREIGN KEY (UsuarioCreacion) REFERENCES Usuario(Id);
```

## ⚙️ Triggers de seguimiento

#### 📘 Reglas de Formato:

* Todo el código debe estar en Español.
* Usar SET NOCOUNT ON al inicio del bloque.
* Respetar la restricción de no usar tildes ni eñes en variables o lógica interna.

#### 📘 Lógica de Inserción en Historial:

* NombreTabla: Debe ser un string fijo con el nombre de la tabla.
* TipoOperacion: Detectar si es 'INSERT', 'UPDATE' o 'DELETE'.
* IdRegistroAfectado: Obtener el ID del registro impactado.
* ValoresAnteriores: Capturar los datos de la tabla virtual deleted en formato JSON (FOR JSON PATH, WITHOUT_ARRAY_WRAPPER).
* ValoresNuevos: Capturar los datos de la tabla virtual inserted en formato JSON.
* TerminalUsuario: Usar la función HOST_NAME() para capturar el nombre del equipo.

#### 📘 Soporte Multi-fila: 
 * El trigger debe ser capaz de procesar inserciones o actualizaciones masivas (usando un INSERT INTO ... SELECT desde las tablas virtuales).

### 📌 Ejemplo

Si lo aplicas a una tabla llamada Producto, el resultado se vería así (cumpliendo tus reglas de VARCHAR(MAX) y PascalCase):

``` sql
CREATE TRIGGER dbo.trgProductoHistorial
ON dbo.Producto
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.Historial (
        NombreTabla,
        IdRegistroAfectado,
        TipoOperacion,
        ValoresAnteriores,
        ValoresNuevos,
        TerminalUsuario
    )
    SELECT 
        'Producto',
        ISNULL(i.Id, d.Id),
        CASE 
            WHEN EXISTS (SELECT 1 FROM inserted) AND EXISTS (SELECT 1 FROM deleted) THEN 'UPDATE'
            WHEN EXISTS (SELECT 1 FROM inserted) THEN 'INSERT'
            ELSE 'DELETE'
        END,
        (SELECT 
            d.*,
            (SELECT u.Correo, u.Nombres, u.Avatar 
                FROM dbo.Usuario u 
                WHERE u.Id = d.UsuarioCreacion 
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS UsuarioInfo
         FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        (SELECT 
            i.*,
            (SELECT u.Correo, u.Nombres, u.Avatar 
                FROM dbo.Usuario u 
                WHERE u.Id = i.UsuarioCreacion 
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS UsuarioInfo
         FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        HOST_NAME()
    FROM inserted i
    FULL OUTER JOIN deleted d ON i.Id = d.Id;
END
```

#### ⚠️ Consideraciones según tus reglas:

* Campos NULL: Tu tabla Historial permite NULL en los campos de valores, lo cual es correcto según tu regla de "Solo permitir NULL cuando sea requerido", ya que un INSERT no tiene valores anteriores y un DELETE no tiene valores nuevos.
* JSON: El uso de VARCHAR(MAX) para los campos de valores es la recomendación oficial de tu documento para texto largo.
* Seguridad: Al usar HOST_NAME(), cumples con llenar el campo TerminalUsuario automáticamente sin que el programador tenga que enviarlo manualmente en cada procedimiento almacenado.

---

## ⚙️ 2. Procedimientos Almacenados

### 📌 Convención de Nombres

| Tipo               | Prefijo | Ejemplo                           |
| ------------------ | ------- | --------------------------------- |
| Procedimiento CRUD | `usp`   | `uspEmpleadoInsertar`             |
| Procedimiento Query| `usp`   | `uspEmpleadoObtenerPorId`         |
| Procedimiento Update | `usp` | `uspEmpleadoActualizar`           |
| Procedimiento Delete | `usp` | `uspEmpleadoEliminar`             |
| Esquema por defecto | `dbo.` | `dbo.uspEmpleadoInsertar`         |
| Esquema personalizado | `personal.` | `personal.uspEmpleadoInsertar` |

### ✅ Buenas prácticas principales

- **Evitar SELECT \*** (indicar siempre los campos específicos)
- **Usar SET NOCOUNT ON** al inicio
- **Usar esquemas explícitos** (dbo. o esquema específico)
- **Renombrar campos en SELECT** por seguridad (usar alias)
- **Parámetros distintos a nombres de columnas** (usar prefijo @p_)
- **Nombrar en español** siguiendo convención PascalCase
- **Documentar parámetros y propósito**

### ❌ INCORRECTO

```sql
CREATE PROCEDURE dbo.usp_GetUserById
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT Id, Nombre, Correo
    FROM Empleado
    WHERE Id = @UserId;
END
```

**Problemas:**
- Nombre mezcla inglés y español (`usp_Get` vs `ById`)
- Parámetro `@UserId` mezcla idiomas
- Nombres de campos expuestos directamente (seguridad)
- No sigue convención: `uspEmpleadoObtenerPorId`
- Sin alias en SELECT

### ✅ CORRECTO

```sql
CREATE PROCEDURE dbo.uspEmpleadoObtenerPorId
    @p_IdEmpleado INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Renombrar campos para mayor seguridad
    SELECT 
        Id AS EmpleadoId,
        Nombre AS NombreCompleto,
        Correo AS CorreoElectronico,
        FechaCreacion AS FechaRegistro
    FROM dbo.Empleado
    WHERE Id = @p_IdEmpleado
        AND EstaEliminado = 0;
END
```

### ✅ CORRECTO (INSERT)

```sql
CREATE PROCEDURE dbo.uspEmpleadoInsertar
    @p_Nombre VARCHAR(150),
    @p_Correo VARCHAR(150),
    @p_Salario DECIMAL(10,2),
    @p_IdUsuarioActual INT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO dbo.Empleado (
        Nombre,
        Correo,
        Salario,
        UsuarioCreacion,
        FechaCreacion,
        EstaEliminado
    )
    VALUES (
        @p_Nombre,
        @p_Correo,
        @p_Salario,
        @p_IdUsuarioActual,
        GETDATE(),
        0
    );
    
    SELECT SCOPE_IDENTITY() AS EmpleadoId;
END
```

### ✅ CORRECTO (UPDATE)

```sql
CREATE PROCEDURE personal.uspEmpleadoActualizar
    @p_IdEmpleado INT,
    @p_Nombre VARCHAR(150),
    @p_Correo VARCHAR(150),
    @p_Salario DECIMAL(10,2),
    @p_IdUsuarioActual INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE personal.Empleado
    SET 
        Nombre = @p_Nombre,
        Correo = @p_Correo,
        Salario = @p_Salario,
        UsuarioActualizacion = @p_IdUsuarioActual,
        FechaActualizacion = GETDATE()
    WHERE Id = @p_IdEmpleado
        AND EstaEliminado = 0;
END
```

### ✅ CORRECTO (DELETE - Soft Delete)

```sql
CREATE PROCEDURE personal.uspEmpleadoEliminar
    @p_IdEmpleado INT,
    @p_IdUsuarioActual INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE personal.Empleado
    SET 
        EstaEliminado = 1,
        UsuarioEliminacion = @p_IdUsuarioActual,
        FechaEliminacion = GETDATE()
    WHERE Id = @p_IdEmpleado
        AND EstaEliminado = 0;
END
```

---

**Problemas:**
- Nombre con guiones bajos (no sigue convención `vwEmpleadosActivos`)
- SELECT * expone toda la estructura
- Sin esquema explícito
- Sin alias en campos
- Sin JOIN a tablas relacionadas
```
