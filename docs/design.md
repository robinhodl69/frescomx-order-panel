# design.md — FrescoMX Order Panel

## Problema a resolver

FrescoMX pierde 2 horas diarias transcribiendo mensajes de WhatsApp a Excel.
Los pedidos llegan en lenguaje natural, desordenado y con sinónimos inconsistentes.

Hipótesis a validar: un panel que parsee automáticamente esos mensajes con AI
elimina la transcripción manual y reduce errores de captura.

***

## Stack elegido

| Tecnología | Elección | Alternativa descartada | Razón |
|---|---|---|---|
| Framework | Next.js 16 (App Router) | Vite + Hono separados | Frontend + backend en un repo, deploy en Vercel con un comando, sin configurar servidor separado |
| Lenguaje | TypeScript estricto | JavaScript | Tipado del dominio desde el inicio, evita errores en parseo de respuestas AI |
| Estilos | Tailwind CSS | CSS modules / styled-components | Velocidad de prototipado, sin archivos extra |
| AI | OpenAI gpt-4o-mini | gpt-4o / Claude | Suficiente para parseo de texto corto, menor latencia, menor costo |
| Estado | React state (useState) | SQLite / localStorage | El ejercicio pide mock en memoria, sin persistencia entre sesiones |
| Catálogo | JSON estático (data/catalog.json) | DB real / API externa | Cero configuración, suficiente para 15 productos en prototipo |
| Deploy | Vercel | Netlify / Railway | Integración nativa con Next.js, deploy automático desde GitHub |

***

## Arquitectura — Flujo end-to-end

```
Operador pega mensaje de WhatsApp
        │
        ▼
[ParseInput.tsx]
Textarea + botón "Parsear pedido"
        │
        ▼ POST /api/parse  { text, catalog }
[app/api/parse/route.ts]
API Route de Next.js
        │
        ▼
[OpenAI gpt-4o-mini]
Prompt estructurado → JSON con items, cliente, ambigüedad
        │
        ▼
[lib/parser.ts]
Match de productos contra catalog.json usando nombre + sinónimos
Cálculo de subtotales
        │
        ▼
[React state en app/page.tsx]
Array de pedidos del día en memoria
        │
        ▼
[OrderTable.tsx]
Tabla editable con items, totales por pedido y total del día
```

***

## Decisiones técnicas clave

### 1. Prompt a OpenAI
El prompt envía el mensaje crudo + el catálogo completo serializado como JSON.
Le instruye retornar siempre este esquema:

```json
{
  "cliente": "string",
  "items": [
    {
      "producto_id": "string | null",
      "nombre": "string",
      "cantidad": number,
      "unidad": "string",
      "precio_unitario": number,
      "subtotal": number,
      "ambiguo": false
    }
  ],
  "pedido_ambiguo": false,
  "nota_ambiguedad": "string | null"
}
```

Si un item es ambiguo, `producto_id` es null y `ambiguo: true`.
Si el pedido completo es irresoluble, `pedido_ambiguo: true`.

### 2. Manejo del Ejemplo 3 — "manden lo de siempre"
Decisión deliberada: no ignorar ni romper.
El pedido se agrega a la tabla con estado **"Requiere confirmación"**.
El cliente se extrae si existe en el mensaje.
Los totales de ese pedido se muestran como **$—** hasta que el operador edite o elimine.
Esto valida la hipótesis del negocio: el panel captura todos los pedidos, ambiguos incluidos.

### 3. Edición inline
Los campos cantidad y unidad son editables directamente en la tabla.
Al editar, el subtotal y total se recalculan en cliente sin llamada adicional a la API.

### 4. Sin persistencia intencional
El estado vive únicamente en React state.
Al recargar la página, los pedidos se pierden.
Decisión consciente para mantener el alcance del prototipo.

***

## Estructura de archivos

```
frescomx-order-panel/
├── app/
│   ├── page.tsx                  # Página principal, estado global de pedidos
│   ├── layout.tsx                # Layout base Next.js
│   └── api/
│       └── parse/
│           └── route.ts          # POST endpoint — llama a OpenAI
├── components/
│   ├── ParseInput.tsx            # Textarea + botón parsear
│   └── OrderTable.tsx            # Tabla de pedidos editable con totales
├── data/
│   └── catalog.json              # 15 productos con sinónimos y precios
├── lib/
│   ├── types.ts                  # Tipos TypeScript del dominio
│   └── parser.ts                 # Lógica de matching contra catálogo
├── docs/
│   ├── requirements.md           # User stories en EARS
│   ├── design.md                 # Este archivo
│   └── tasks.md                  # Checklist de commits
└── AGENTS.md                     # Instrucciones para OpenCode (fuente de verdad del agente)
```

***

## Qué se descartó explícitamente

| Feature | Razón del descarte |
|---|---|
| Autenticación | Fuera de alcance según el brief, añade complejidad sin valor para la hipótesis |
| Base de datos real (SQLite/Postgres) | Mock en memoria es suficiente para validar el flujo |
| Integración real con WhatsApp | No requerida, el input manual simula el caso de uso |
| Historial entre sesiones | Sin DB, sin persistencia — decisión consciente de scope |
| Tests exhaustivos | Prototipo de validación, no producción |
| Microservicios / backend separado | Over-engineering para este alcance |

***

## Qué haría diferente con más tiempo

1. **Persistencia ligera** — SQLite con Drizzle para historial del día sin perder datos al recargar
2. **Webhook de WhatsApp** — integración real con Twilio o Meta API para eliminar el paso manual de copiar/pegar
3. **Resolución asistida de ambigüedades** — modal que muestre el historial del cliente para inferir "lo de siempre"
4. **Exportación a Excel** — el equipo ya usa Excel, una exportación directa reduciría fricción de adopción
5. **Tests de integración** — cubrir los 3 ejemplos del ejercicio como casos de prueba automatizados
