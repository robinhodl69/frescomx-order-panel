# UI Design — FrescoMX Panel de Pedidos

## Referencia visual
Estilo similar a Spinneys grocery dashboard: limpio, profesional, fondo mint suave, verde como color primario. Sin gradientes, sin sombras agresivas, sin decoración innecesaria.

## Paleta de colores

| Token | Hex | Uso |
|---|---|---|
| bg | #F0F7F0 | Fondo general (mint muy suave) |
| surface | #FFFFFF | Cards, panels, modals |
| border | #DDE8DD | Bordes de cards e inputs |
| primary | #1A7A3C | Botones, nav activo, links |
| primary-hover | #15612F | Hover de botón primary |
| primary-light | #E6F4EC | Badge confirmado bg, nav activo bg |
| text-primary | #0F1F0F | Títulos y datos importantes |
| text-secondary | #4A6349 | Labels, subtítulos |
| text-muted | #8FAE8C | Placeholder, metadata |
| amber | #D97706 | Badge Ambiguo texto |
| amber-bg | #FFFBEB | Badge Ambiguo fondo |
| red | #EF4444 | Error texto |
| red-bg | #FEF2F2 | Error fondo |

## Layout general

Sidebar w-52 fijo a la izquierda con fondo #F0F7F0 y border-right #DDE8DD. Contenido principal a la derecha con fondo #F0F7F0. El sidebar contiene: logo emoji 🥦 + texto FrescoMX en #1A7A3C font-semibold, fecha actual debajo en text-xs text-[#8FAE8C], y los dos nav items: Nuevo Pedido y Pedidos del Día.

## Sidebar

- Fondo: #F0F7F0, border-right: #DDE8DD
- Logo: emoji 🥦 + texto "FrescoMX" en #1A7A3C, font-semibold
- Fecha actual debajo del logo: text-xs text-[#8FAE8C]
- Nav items: rounded-lg px-3 py-2 text-sm font-medium text-[#4A6349]
- Nav hover: bg-[#E6F4EC] text-[#1A7A3C]
- Nav activo: bg-[#E6F4EC] text-[#1A7A3C] font-semibold

## Pestaña — Nuevo Pedido

Card centrada max-w-2xl mx-auto con fondo #FFFFFF, border #DDE8DD, rounded-xl.
- Título: "Nuevo Pedido" text-lg font-semibold text-[#0F1F0F]
- Label textarea: "Mensaje de WhatsApp" text-sm font-semibold text-[#4A6349]
- Textarea: bg-white border border-[#DDE8DD] rounded-lg text-[#0F1F0F] placeholder:text-[#8FAE8C] focus:border-[#1A7A3C] focus:ring-2 focus:ring-[#1A7A3C]/10
- Placeholder text: "Ej: Buenas, para mañana mándame 10 kg jitomate, 5 cajas aguacate. Soy Marco del Rincón Oaxaqueño."
- Botón "Parsear pedido": bg-[#1A7A3C] hover:bg-[#15612F] text-white rounded-lg px-4 py-2.5 font-medium

### Feedback post-parseo (inline, debajo del botón)

Pedido confirmado: banner bg-[#E6F4EC] border border-[#1A7A3C]/20 rounded-lg p-3 con ícono ✅ y texto "Pedido de {cliente} creado — ${total}"

Pedido ambiguo: banner bg-[#FFFBEB] border border-[#D97706]/20 rounded-lg p-3 con ícono ⚠️ y texto "Pedido de {cliente} tiene items que requieren confirmación" y CTA "Ver en Pedidos del Día →" en text-[#1A7A3C] font-medium underline

Error o no reconocido: banner bg-[#FEF2F2] border border-[#EF4444]/20 rounded-lg p-3 con ícono ❌ y mensaje de error, con CTA "Intentar de nuevo" que limpia el textarea y pone foco.

## Pestaña — Pedidos del Día

### KPI bar (top)
3 cards en fila: Total del día, Confirmados, Ambiguos.
- Card: bg-white rounded-xl border border-[#DDE8DD] p-4
- Número: text-2xl font-bold text-[#0F1F0F]
- Label: text-xs text-[#8FAE8C] uppercase tracking-wide

### Tabla de pedidos
- Header: bg-[#F0F7F0] text-xs font-semibold text-[#4A6349] uppercase tracking-wide
- Filas: border-b border-[#DDE8DD] hover:bg-[#F0F7F0] cursor-pointer transition-colors
- Click en fila expande detalle inline en acordeón — eliminar el botón "Ver detalle" separado
- Columnas: CLIENTE | PRODUCTOS | TOTAL | STATUS

### Empty state
Ícono 📋 centrado, texto "No hay pedidos hoy", subtexto "Pega un mensaje de WhatsApp en Nuevo Pedido para comenzar." Todo en text-[#8FAE8C].

## Componentes — Badges

Confirmado: bg #E6F4EC, texto #1A7A3C, border #1A7A3C/20
Ambiguo: bg #FFFBEB, texto #D97706, border #D97706/20
Requiere confirmación: bg #FEF9C3, texto #854D0E, border #D97706/20
Producto no reconocido: bg #FEF2F2, texto #EF4444, border #EF4444/20
Todos: rounded-full px-2.5 py-0.5 text-xs font-medium border

## Tipografía

- Font: Inter (ya incluido con Tailwind/Next.js)
- Títulos de sección: text-lg font-semibold text-[#0F1F0F]
- Labels: text-sm font-semibold text-[#4A6349]
- Body y tabla: text-sm text-[#0F1F0F]
- Muted y metadata: text-xs text-[#8FAE8C]

## Reglas generales

- Sin gradientes en botones ni backgrounds
- Sin sombras agresivas — solo shadow-sm donde sea necesario
- Border-radius consistente: rounded-lg para inputs y botones, rounded-xl para cards
- Spacing base 4px — usar escala de Tailwind (p-2, p-4, p-6)
- No usar azul en ningún componente — verde es el único color de acento
