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
- [ ] 15 productos con id, nombre, sinónimos, precio MXN y unidad
- [ ] Sinónimos reales: jitomate ≈ tomate ≈ tomate saladette
- [ ] `feat: product catalog with 15 items and synonyms`

## Tarea 2 — Tipos TypeScript
**Archivo:** `lib/types.ts`
- [ ] `Product` — estructura del catálogo
- [ ] `OrderItem` — item parseado con flag de ambigüedad
- [ ] `ParsedOrder` — respuesta de OpenAI con cliente e items
- [ ] `DailyOrder` — pedido en la tabla del día con estado
- [ ] `feat: TypeScript domain types`

## Tarea 3 — Lógica de matching contra catálogo
**Archivo:** `lib/parser.ts`
- [ ] Match por nombre oficial y sinónimos (case insensitive)
- [ ] Retorna `producto_id: null` si no hay match en catálogo
- [ ] Calcula subtotal por item (cantidad × precio_unitario)
- [ ] `feat: catalog matcher logic`

## Tarea 4 — API route de parseo con OpenAI
**Archivo:** `app/api/parse/route.ts`
- [ ] Recibe `{ text, catalog }` por POST
- [ ] Prompt estructurado que retorna JSON con cliente, items, `pedido_ambiguo`, `nota_ambiguedad`
- [ ] Maneja items ambiguos con `ambiguo: true` y `producto_id: null`
- [ ] Responde 500 con mensaje descriptivo si OpenAI falla
- [ ] `feat: OpenAI parse API route`

## Tarea 5 — Componente de entrada de texto
**Archivo:** `components/ParseInput.tsx`
- [ ] Textarea para pegar mensaje crudo de WhatsApp
- [ ] Botón "Parsear pedido" con estado de loading
- [ ] Validación inline si el campo está vacío
- [ ] `feat: parse input component`

## Tarea 6 — Tabla de pedidos editable
**Archivo:** `components/OrderTable.tsx`
- [ ] Columnas: cliente, producto, cantidad, unidad, precio unitario, subtotal, estado
- [ ] Edición inline de cantidad y unidad
- [ ] Recálculo automático de subtotal al editar
- [ ] Badge visual para items ambiguos ("⚠ Requiere confirmación")
- [ ] Totales bloqueados `$—` para pedidos completamente ambiguos
- [ ] Fallback para producto no reconocido: nombre tal como llegó + precio $0 + badge
- [ ] `feat: order table with editable rows and ambiguity flags`

## Tarea 7 — Página principal
**Archivo:** `app/page.tsx`
- [ ] Estado global de pedidos del día (`useState`)
- [ ] Integra `ParseInput` + `OrderTable`
- [ ] Total por pedido en MXN
- [ ] Total agregado del día (excluye pedidos ambiguos sin resolver)
- [ ] Formato de moneda `$X,XXX.XX MXN`
- [ ] Estado de error con botón de reintentar si API falla
- [ ] `feat: main page with daily totals and error handling`

## Tarea 8 — Instrucciones para Copilot
**Archivo:** `.github/copilot-instructions.md`
- [ ] Stack, constraints y flujo de trabajo documentados
- [ ] Regla de no hacer commits sin aprobación
- [ ] `chore: copilot instructions`

***

## Entrega final

- [ ] `docs: README final` — stack, setup local, variables de entorno, decisiones, trade-offs, URL demo
- [ ] Deploy en Vercel y URL pública funcionando
- [ ] Grabar Loom máx 10 min: herramientas usadas, decisiones, qué haría diferente
- [ ] Enviar a admin@trazo.pro: URL demo + URL repo + URL Loom antes de las 23:59
