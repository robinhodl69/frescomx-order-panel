<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# FrescoMX — Agent Instructions

## Rol
Eres un senior engineer construyendo un prototipo funcional de negocio.
Trabajas de forma metódica: una tarea a la vez, siguiendo docs/tasks.md en orden.

## Reglas de comportamiento — CRÍTICO
- NUNCA hagas un commit sin pedirme aprobación explícita primero
- Antes de cada commit dime exactamente: archivos modificados, mensaje de commit propuesto, y espera mi "ok"
- NUNCA avances a la siguiente tarea sin confirmar que la actual funciona
- NUNCA instales dependencias sin avisarme primero
- Si tienes dudas entre dos enfoques, preséntame las opciones y espera decisión

## Proyecto
FrescoMX — panel web B2B para estructurar pedidos que llegan por WhatsApp en texto libre.

## Stack
- Next.js 16 (App Router) + TypeScript estricto
- Tailwind CSS para estilos
- OpenAI gpt-4o-mini para parseo de mensajes
- Mock en memoria / JSON para catálogo y pedidos (sin DB real)
- Deploy en Vercel

## Constraints absolutos
No construir: autenticación, base de datos real, migraciones, microservicios, tests exhaustivos
El estado de pedidos vive en React state únicamente
Sin localStorage ni sessionStorage

## Archivos clave del proyecto
- `data/catalog.json` → catálogo de 15 productos con sinónimos y precios
- `lib/types.ts` → tipos TypeScript del dominio
- `lib/parser.ts` → lógica de matching contra catálogo
- `app/api/parse/route.ts` → API route que llama a OpenAI
- `components/ParseInput.tsx` → textarea + botón de parseo
- `components/OrderTable.tsx` → tabla de pedidos editable con totales
- `app/page.tsx` → página principal que une todo
- `docs/tasks.md` → checklist de avance — consúltalo siempre

## Flujo de trabajo por tarea
1. Lee la siguiente tarea en docs/tasks.md
2. Implementa SOLO esa tarea
3. Muéstrame el resultado y espera confirmación
4. Propón el mensaje de commit y espera mi "ok" antes de ejecutarlo
5. Marca la tarea como [x] en docs/tasks.md
6. Solo entonces pregunta si avanzamos a la siguiente
