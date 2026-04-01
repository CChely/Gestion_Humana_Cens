# Especificaciones de Diseño - Dashboard (Fuse Admin System)

Este documento define los estándares visuales extraídos del módulo de Dashboard para mantener la consistencia estética en todo el proyecto.

## 1. Layout y Espaciado General
- **Padding General de la Vista:** `24px` (equivalente a `p-6` en Tailwind). En pantallas grandes puede subir a `32px` (`p-8`).
- **Gap entre Elementos (Grid/Flex):** `24px` (`gap-6`).
- **Fondo de Pantalla:** `#F1F5F9` (Slate 100) en modo claro / `#0F172A` (Slate 900) en modo oscuro.

## 2. Cards (Tarjetas de Contenedor)
- **Color de Fondo:** `#FFFFFF` (Blanco) / `#1E293B` (Slate 800 en modo oscuro).
- **Border Radius (Esquinas):** `16px` (`rounded-2xl`). Es el estándar moderno de Fuse.
- **Padding Interno:** `24px` (`p-6`).
- **Borde:** `1px solid #E2E8F0` (Slate 200). En modo oscuro: `1px solid #334155` (Slate 700).
- **Sombra (Shadow):** `shadow-sm` o `shadow` (elevación sutil de 1px a 3px).

## 3. Tipografía y Colores de Texto
- **Títulos de Cabecera (Hero/List):**
  - Tamaño: `36px` (`text-4xl`).
  - Peso: `800` (`font-extrabold`).
  - Estilo: `tracking-tight` (espaciado estrecho) y `leading-none` (interlineado 1).
  - Color: `#0F172A` (Slate 900).
- **Títulos Principales (H1):**
  - Tamaño: `30px` (`text-3xl`).
  - Peso: `700` (`font-bold`).
  - Color: `#0F172A` (Slate 900).
- **Títulos de Sección/Card (H2):**
  - Tamaño: `18px` (`text-lg`) o `20px` (`text-xl`).
  - Peso: `600` (`font-semibold`).
  - Color: `#1E293B` (Slate 800).
- **Cuerpo de Texto / Descripciones:**
  - Tamaño: `14px` (`text-sm`).
  - Color: `#64748B` (Slate 500 / Secondary text).

## 4. Botones y Acciones
- **Paleta de Colores (Fondo/Main):**
  - **Primario:** `#4F46E5` (Indigo 600) - Acciones principales.
  - **Acento (Accent 700):** `#4338CA` (Indigo 700) - Énfasis alto / `bg-accent-700`.
  - **Oscuro (Dark):** `#0F172A` (Slate 900) - Botones de utilidad en `flex items-center`.
  - **Superficie/Fondo (Basic):** `#FFFFFF` (Blanco) o Transparente.
  - **Borde (Outline):** `#D1D5DB` (Gray 300).
  - **Éxito:** `#059669` (Emerald 600) - Confirmaciones/Guardar.
  - **Peligro:** `#E11D48` (Rose 600) - Eliminar/Errores.
  - **Advertencia:** `#F59E0B` (Amber 500) - Alertas/Acciones reversibles.
  - **Información:** `#0EA5E9` (Sky 500) - Detalles/Ayuda.
  - **Secundario/Texto:** `#64748B` (Slate 500) - Texto en botones "Basic".
- **Propiedades Comunes:**
  - **Texto en Sólidos:** `#FFFFFF` (Blanco).
  - **Texto en "Basic":** `#1E293B` (Slate 800) o `#64748B` (Slate 500).
  - **Padding:** `8px 16px` (`py-2 px-4`).
  - **Border Radius Estándar:** `6px` (`rounded-md`).
  - **Border Radius Redondeado (Pill):** `9999px` (`fuse-mat-button-rounded` / `rounded-full`).
  - **Tipografía:** `14px`, `font-medium` (`font-medium`).
  - **Transición:** `all 200ms ease-in-out`.
  - **Espaciado en Grupos (space-x-3):** `12px` entre botones adyacentes.
  - **Estilo mat-flat-button:** Color sólido sin elevación (sombra).
- **Botones de Icono (IconButton):**
  - **Dimensiones:** `40x40px` o `32x32px`.
  - **Radius:** `9999px` (Circular).
  - **Hover:** Fondo sutil con opacidad (e.g., `bg-black/5` o `bg-white/10`).

## 5. Etiquetas, Badges y Estados
- **Radio:** `9999px` (`rounded-full`).
- **Padding:** `2px 10px` (`py-0.5 px-2.5`).
- **Tamaño de Fuente:** `12px` (`text-xs`).
- **Estilo Visual:** Se usa la variante "Soft" (Fondo con 10-20% de opacidad del color base y texto con el color sólido al 100%).
  - **Completado:** Fondo Emerald 100 / Texto Emerald 700.
  - **Pendiente:** Fondo Amber 100 / Texto Amber 700.
  - **Error:** Fondo Rose 100 / Texto Rose 700.

## 6. Inputs y Formularios
- **Altura:** `40px` o `44px`.
- **Radius:** `6px` (`rounded-md`).
- **Borde en Reposo:** `#D1D5DB` (Gray 300).
- **Borde en Foco:** `#4F46E5` (Indigo 600) con anillo de sombra suave.

## 7. Componentes Especializados
### Mat Button Toggle Group (Filtros de tiempo/vista)
- **Contenedor Principal:**
  - Fondo: `#E2E8F0` (Slate 200) o `#F1F5F9` (Slate 100).
  - Border Radius: `8px` (`rounded-lg`) o `9999px` (`rounded-full`) según contexto.
  - Borde: Ninguno (Appearance: Standard en Fuse suele estar personalizado sin bordes externos).
- **Botón Toggle Seleccionado:**
  - Fondo: `#FFFFFF` (Blanco).
  - Sombra: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`.
  - Color Texto: `#0F172A` (Slate 900).
- **Botón Toggle Inactivo:**
  - Fondo: Transparente.
  - Color Texto: `#64748B` (Slate 500).

## 8. Sistema de Listas (Contacts/Lists)
- **Contenedor de Lista:** `flex flex-col flex-auto overflow-y-auto`.
- **Item de Lista (Row):**
  - **Padding:** `12px 24px` (`py-3 px-6`) o `16px 32px` (`py-4 px-8`) para mayor respiro.
  - **Borde Inferior:** `1px solid #E2E8F0` (Slate 200).
  - **Estado Hover:** Fondo `#F8FAFC` (Slate 50) o `bg-hover`.
  - **Estado Seleccionado:** Fondo `#EEF2FF` (Indigo 50) o `#F1F5F9` (Slate 100).
  - **Indicador de Selección:** A veces incluye una barra vertical de `4px` en el borde izquierdo con el color `Primary 600`.
- **Tipografía en Lista:**
  - **Nombre/Título:** `font-medium`, `text-slate-900`.
  - **Subtítulo/Descripción:** `text-sm`, `text-slate-500` (Secondary).

### Divisores de Grupo (Sticky Headers)
- **Clases:** `z-10 sticky top-0 -mt-px px-6 py-1 md:px-8 border-t border-b`.
- **Tipografía:** `font-medium uppercase text-secondary`.
- **Fondo:** `#F9FAFB` (`bg-gray-50`) / En oscuro: `dark:bg-gray-900`.

## 9. Navegación Lateral (Sidebar de Contactos)
- **Ancho (Width):** `320px` (`w-80`).
- **Fondo:** `#FFFFFF` (Blanco) o un tono ligeramente distinto al fondo principal para separar áreas.
- **Cabecera de Lista / Página (Header):**
  - **Contenedor:** `flex flex-col sm:flex-row md:flex-col flex-auto justify-between`.
  - **Padding:** Vertical `32px` (`py-8`), Horizontal `24px` (`px-6`) y `32px` en escritorio (`md:px-8`).
  - **Título Principal:** Ver especificación "Hero" en sección 3.
  - **Subtítulo / Contador:** `font-medium`, `text-secondary` (Slate 500), con un ajuste fino de margen izquierdo de `2px` (`ml-0.5`).
  - **Borde:** `1px solid #E2E8F0` (`border-b`) para separar de la lista.
- **Buscador (Search):**
  - Forma: `rounded-full` (Estilo píldora).
  - Fondo: `#F1F5F9` (Slate 100).
  - Icono: `text-slate-400`.

## 10. Avatares y Multimedia
- **Tamaño Estándar:** `40x40px` (`w-10 h-10`).
- **Tamaño Grande:** `48x48px` (`w-12 h-12`).
- **Border Radius:** `9999px` (Totalmente circular).
- **Fondo por Defecto:** `#E2E8F0` (Slate 200) con iniciales en `Slate 600`.
- **Borde (Opcional):** `2px solid #FFFFFF` cuando se superponen.

## 11. Divisores (Dividers)
- **Color:** `#E2E8F0` (Slate 200) en modo claro / `#334155` (Slate 700) en modo oscuro.
- **Grosor:** `1px`.

## 12. Vistas de Detalle y Formularios Complejos
- **Estructura General:**
  - Frecuentemente utiliza `mat-card` para agrupar secciones de información o campos de formulario.
  - Layout basado en `grid` de Tailwind CSS para organizar campos en múltiples columnas (e.g., `grid grid-cols-1 gap-6 md:grid-cols-2`).
- **Campos de Formulario (`mat-form-field`):**
  - **Apariencia:** Comúnmente `appearance="fill"` o `appearance="outline"`.
  - **Altura:** `40px` o `44px` para los inputs internos.
  - **Radius:** `6px` (`rounded-md`) para los bordes de los inputs.
  - **Borde en Reposo:** `#D1D5DB` (Gray 300).
  - **Borde en Foco:** `#4F46E5` (Indigo 600) con un anillo de sombra suave.
  - **Etiquetas (Labels):** `text-secondary` (Slate 500) o `text-slate-700`.
  - **Texto de Input:** `text-slate-900`, `font-medium`.
  - **Mensajes de Ayuda/Error (`mat-hint`, `mat-error`):** `text-xs`, `text-secondary` (Slate 500) para hints, `text-rose-600` para errores.
- **Grupos de Campos (Fieldsets/Sections):**
  - **Título de Sección:** `text-lg font-semibold text-slate-800` o `text-xl font-bold`.
  - **Padding Interno:** `24px` (`p-6`) dentro de las `mat-card` o `div` contenedoras.
  - **Margen entre Grupos:** `24px` (`mb-6`) o `32px` (`mb-8`).
- **Detalles de Solo Lectura (Description Lists):**
  - **Estructura:** A menudo se usa un `div` con `flex` o `grid` para pares de "Etiqueta: Valor".
  - **Etiqueta (Label):** `text-sm font-medium text-secondary` (Slate 500).
  - **Valor (Value):** `text-base text-slate-900 font-normal`.
  - **Espaciado:** `gap-y-2` o `gap-y-4` entre filas.
- **Divisores Internos (`mat-divider`):**
  - **Color:** `#E2E8F0` (Slate 200).
  - **Grosor:** `1px`.
  - **Margen:** `my-6` o `my-8` para separar secciones dentro de un formulario o vista de detalle.
- **Áreas de Texto (`textarea`):**
  - **Altura:** `min-h-[100px]` o `min-h-[120px]`.
  - **Resizing:** `resize-y` (solo vertical).

## 13. Estructura Estándar de Componentes (Blueprint)
Todos los componentes de módulo deben seguir esta jerarquía estructural basada en `proyecto.component.html` para garantizar consistencia:

### 13.1. Contenedor Raíz
- **Clase:** `flex flex-col flex-auto`. Es el contenedor principal que ocupa todo el espacio disponible.

### 13.2. Cabecera de Página (Header)
- **Contenedor:** `flex flex-col sm:flex-row items-start sm:items-center sm:justify-between p-6 sm:py-12 md:px-8 border-b bg-card dark:bg-transparent`.
  - Utiliza `bg-card` para resaltar sobre el fondo grisáceo del layout.
  - En modo oscuro, se prefiere `dark:bg-transparent`.
- **Bloque de Título:** 
  - Título Principal: `text-4xl font-extrabold tracking-tight leading-none`.
  - Subtítulo/Descripción: `flex items-center mt-0.5 font-medium text-secondary`.
- **Bloque de Acciones (Botones):**
  - Contenedor: `mt-4 sm:mt-0`.
  - Estándar de Botón: `mat-flat-button` con color `primary`.
  - Iconografía: Usar `mat-icon` con `svgIcon` de la librería Heroicons. El texto debe tener `ml-2` para separarse del icono.

### 13.3. Cuerpo del Componente (Content)
- **Contenedor:** `p-6 md:p-8 space-y-8`.
  - El padding aumenta en pantallas medianas (`md:p-8`).
  - `space-y-8` asegura una separación vertical uniforme entre los bloques de contenido internos (cards, tablas, etc.).

### 13.4. Componentes Complementarios (Footers/Trazabilidad)
- Elementos globales como `<app-trazabilidad></app-trazabilidad>` deben ubicarse al final del archivo, **fuera** del contenedor `flex-auto` principal, para que se rendericen como una sección independiente al pie de la vista.

---
*Nota: Estos valores se basan en la implementación estándar de Fuse v15+ y Tailwind CSS.*