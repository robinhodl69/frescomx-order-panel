# tasks.md — FrescoMX Order Panel

Checklist de avance commit a commit.
Actualizar estado al completar cada tarea antes de avanzar a la siguiente.

Estados: [ ] pendiente · [~] en progreso · [x] completado

***

## Setup y documentación

- [x] `chore: project setup Next.js 16 + TypeScript + Tailwind + OpenAI`
- [x] `docs: add spec-driven files (AGENTS, requirements, design, tasks)`

***

## Tarea 1 — Catálogo de productos
**Archivo:** `data/catalog.json`
- [x] 15 productos con id, nombre, sinónimos, precio MXN y unidad
- [x] Sinónimos reales: jitomate ≈ tomate ≈ tomate saladette
- [x] `feat: product catalog with 15 items and synonyms`

## Tarea 2 — Tipos TypeScript
**Archivo:** `lib/types.ts`
- [x] `Product` — estructura del catálogo
- [x] `OrderItem` — item parseado con flag de ambigüedad
- [x] `ParsedOrder` — respuesta de OpenAI con cliente e items
- [x] `DailyOrder` — pedido en la tabla del día con estado
- [x] `feat: TypeScript domain types`

## Tarea 3 — Lógica de matching contra catálogo
**Archivo:** `lib/parser.ts`
- [x] Match por nombre oficial y sinónimos (case insensitive)
- [x] Retorna `producto_id: null` si no hay match en catálogo
- [x] Calcula subtotal por item (cantidad × precio_unitario)
- [x] `feat: catalog matcher logic`

## Tarea 4 — API route de parseo con OpenAI
**Archivo:** `app/api/parse/route.ts`
- [x] Recibe `{ text, catalog }` por POST
- [x] Prompt estructurado que retorna JSON con cliente, items, `pedido_ambiguo`, `nota_ambiguedad`
- [x] Maneja items ambiguos con `ambiguo: true` y `producto_id: null`
- [x] Responde 500 con mensaje descriptivo si OpenAI falla
- [x] `feat: OpenAI parse API route`

## Tarea 5 — Componente de entrada de texto
**Archivo:** `components/ParseInput.tsx`
- [x] Textarea para pegar mensaje crudo de WhatsApp
- [x] Botón "Parsear pedido" con estado de loading
- [x] Validación inline si el campo está vacío
- [x] `feat: parse input component`

## Tarea 5b — Componente tabla de pedidos diarios
**Archivo:** `components/DailyOrdersTable.tsx`
- [x] Tabla con columnas: Cliente, Productos, Total, Status, Acciones
- [x] Empty state: "No hay pedidos registrados hoy"
- [x] Badges visuales por status (confirmed/ambiguous/pending)
- [x] Highlight sutil para filas ambiguas
- [x] `feat: daily orders tabla component`

## Tarea 6 — Tabla de pedidos editable
**Archivo:** `components/OrderTable.tsx`
- [x] Columnas: cliente, producto, cantidad, unidad, precio unitario, subtotal, estado
- [x] Edición inline de cantidad y unidad
- [x] Recálculo automático de subtotal al editar
- [x] Badge visual para items ambiguos ("⚠ Requiere confirmación")
- [x] Totales bloqueados `$—` para pedidos completamente ambiguos
- [x] Fallback para producto no reconocido: nombre tal como llegó + precio $0 + badge
- [x] `feat: order table with editable rows and ambiguity flags`

## Tarea 7 — Página principal
**Archivo:** `app/page.tsx`
- [x] Estado global de pedidos del día (`useState`)
- [x] Integra `ParseInput` + `OrderTable`
- [x] Total por pedido en MXN
- [x] Total agregado del día (excluye pedidos ambiguos sin resolver)
- [x] Formato de moneda `$X,XXX.XX MXN`
- [x] Estado de error con botón de reintentar si API falla
- [x] `feat: main page with daily totals and error handling`

## Tarea 8 — Instrucciones para el Agente
**Archivo:** `AGENTS.md` (fuente de verdad)
- [x] Stack, constraints y flujo de trabajo documentados
- [x] Regla de no hacer commits sin aprobación
- [x] Nota: archivo `.github/copilot-instructions.md` eliminado — no se usa GitHub Copilot
- [x] `chore: consolidate agent instructions into AGENTS.md`

***

## Entrega final

- [ ] `docs: README final` — stack, setup local, variables de entorno, decisiones, trade-offs, URL demo
- [ ] Deploy en Vercel y URL pública funcionando
- [ ] Grabar Loom máx 10 min: herramientas usadas, decisiones, qué haría diferente
- [ ] Enviar a admin@trazo.pro: URL demo + URL repo + URL Loom antes de las 23:59
