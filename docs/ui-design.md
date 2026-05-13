# FrescoMX — UI Design System

## Paleta de Colores

| Token | Hex | Uso |
|-------|-----|-----|
| Brand Background | #F0F7F0 | Fondo general, headers de cards |
| Surface White | #ffffff | Fondo de filas de tabla, inputs |
| Border / Divider | #DDE8DD | Bordes de cards, divisores de tabla |
| Text Primary | #0F1F0F | Títulos, valores importantes |
| Text Secondary | #4A6349 | Labels, texto de tabla, subtítulos |
| Text Muted | #8FAE8C | Timestamps, placeholders, hints |
| Green Confirmed BG | #E6F4EC | Badge OK, tab selector background |
| Green Confirmed Text | #1A7A3C | Texto badge OK, acciones primarias |
| Green Hover | #15612F | Hover en botones primarios |
| Amber Ambiguous BG | #FEF9C3 | Badge "Requiere confirmación" |
| Amber Ambiguous Text | #854D0E | Texto badge ambiguo |
| Amber Icon | #D97706 | Ícono de producto ambiguo |
| Error Text | #EF4444 | "Producto no reconocido" |

## Tipografía

| Rol | Font | Clase Tailwind |
|-----|------|----------------|
| Títulos / Headings | Plus Jakarta Sans | font-[family-name:var(--font-display)] |
| Body / UI | Inter | font-[family-name:var(--font-body)] (default) |

Escala usada:
- text-xs (12px): badges, labels, timestamps, uppercase headers de tabla
- text-sm (14px): body principal, botones, contenido de tabla
- text-base (16px): inputs, textarea de parseo
- text-xl+: reservado para KPIs futuros

## Componentes

Card / Panel: overflow-hidden rounded-lg border border-[#DDE8DD]
Header de card: border-b border-[#DDE8DD] bg-[#F0F7F0] px-4 py-3

Badge confirmado: inline-flex items-center rounded-full border border-[#1A7A3C]/20 bg-[#E6F4EC] px-2.5 py-0.5 text-xs font-medium text-[#1A7A3C]

Badge ambiguo: inline-flex items-center rounded-full border border-[#D97706]/20 bg-[#FEF9C3] px-2.5 py-0.5 text-xs font-medium text-[#854D0E]

Badge conteo/info: inline-flex items-center rounded-full border border-[#1A7A3C]/20 bg-[#E6F4EC] px-2.5 py-0.5 text-xs font-medium text-[#1A7A3C]

Chip sinónimo: inline-flex items-center rounded-full bg-[#F0F7F0] border border-[#DDE8DD] px-2 py-0.5 text-xs text-[#4A6349]

Botón primario: rounded-md bg-[#1A7A3C] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#15612F]

Botón secundario: rounded-md bg-white px-3 py-1.5 text-xs font-medium text-[#4A6349] ring-1 ring-inset ring-[#DDE8DD] hover:bg-[#F0F7F0]

Input: rounded-md border border-[#DDE8DD] px-3 py-1.5 text-sm text-[#0F1F0F] bg-white focus:outline-none focus:ring-1 focus:ring-[#1A7A3C]

Tab contenedor: flex gap-1 rounded-lg bg-[#E6F4EC] p-1 w-fit
Tab activo: rounded-md bg-white px-4 py-1.5 text-sm font-semibold text-[#1A7A3C] shadow-sm
Tab inactivo: rounded-md px-4 py-1.5 text-sm font-medium text-[#4A6349] hover:text-[#1A7A3C]

Tabla thead: bg-[#F0F7F0]
Tabla th: px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-[#4A6349]
Tabla tbody: divide-y divide-[#DDE8DD] bg-white
Tabla td: px-4 py-2 text-sm text-[#0F1F0F]

## Reglas de Diseño

1. Nunca usar colores fuera de la paleta definida
2. Bordes siempre con border-[#DDE8DD], nunca border-gray-*
3. Texto nunca text-gray-*, siempre los tokens de la paleta
4. Cards siempre con rounded-lg, nunca rounded-xl ni rounded-2xl
5. Espaciado interno de cards: px-4 py-3 (header), px-4 py-2 (filas)
6. Sombras: solo shadow-sm en elementos flotantes (tab activo, modales)
7. Estados hover: solo en elementos interactivos, nunca en texto estático
