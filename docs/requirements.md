# requirements.md — FrescoMX Order Panel

## Contexto
Panel web B2B para estructurar pedidos que llegan por WhatsApp en lenguaje natural.
Operadora: distribuidora de frutas y verduras con 40 clientes en CDMX.
Hipótesis a validar: eliminar transcripción manual y reducir errores de captura.

***

## User Stories — Notación EARS

### Parseo de mensajes

**US-01 · Input de texto libre**
WHEN un operador pega un mensaje de WhatsApp en el campo de input
THE SYSTEM SHALL aceptar el texto tal como llega, sin formato ni preprocesamiento manual

**US-02 · Parseo con AI**
WHEN el operador presiona "Parsear pedido"
THE SYSTEM SHALL enviar el texto a OpenAI y retornar un objeto estructurado con:
cliente, lista de items (producto_id, nombre, cantidad, unidad, precio_unitario, subtotal),
flag de ambigüedad y nota explicativa

**US-03 · Matching contra catálogo**
WHEN el AI identifica un producto en el mensaje
THE SYSTEM SHALL hacer match contra el catálogo de 15 productos usando nombre oficial y sinónimos
(jitomate ≈ tomate ≈ tomate saladette)

**US-04 · Pedido parcialmente ambiguo**
WHEN el mensaje contiene items claros y uno ambiguo (ej: "lo de siempre de limón")
THE SYSTEM SHALL parsear los items claros con normalidad
AND marcar únicamente el item ambiguo con flag visual de advertencia

**US-05 · Pedido completamente ambiguo**
WHEN el mensaje no contiene ningún producto identificable (ej: "manden lo de siempre porfa")
THE SYSTEM SHALL agregar el pedido a la tabla con estado "Requiere confirmación"
AND mostrar el cliente identificado si existe en el mensaje
AND bloquear el cálculo de totales para ese pedido hasta resolución

***

### Vista de pedidos del día

**US-06 · Tabla de pedidos**
WHEN existen pedidos parseados en la sesión
THE SYSTEM SHALL mostrar una tabla con columnas: cliente, producto, cantidad, unidad, precio unitario, subtotal, estado

**US-07 · Edición de items**
WHEN el operador hace clic en cantidad o unidad de un item
THE SYSTEM SHALL permitir editar el valor inline
AND recalcular subtotal y total del pedido automáticamente al confirmar el cambio

**US-08 · Total por pedido**
WHEN un pedido tiene al menos un item sin ambigüedad
THE SYSTEM SHALL mostrar el total estimado en pesos MXN sumando todos los subtotales del pedido

**US-09 · Total agregado del día**
WHEN existen dos o más pedidos en la sesión
THE SYSTEM SHALL mostrar el total agregado del día sumando únicamente los pedidos sin ambigüedad pendiente

***

### Catálogo

**US-10 · Catálogo mockeado**
WHEN el sistema inicia
THE SYSTEM SHALL cargar automáticamente el catálogo desde data/catalog.json
con 15 productos incluyendo id, nombre, sinónimos, precio y unidad

***

### Edge cases

**US-11 · Producto no encontrado en catálogo**
WHEN el AI identifica un producto que no existe en el catálogo
THE SYSTEM SHALL agregar el item con nombre tal como llegó, precio en cero y flag de "producto no reconocido"

**US-12 · Mensaje vacío**
WHEN el operador presiona "Parsear" con el campo vacío
THE SYSTEM SHALL mostrar un mensaje de validación inline y no llamar a la API

**US-13 · Error de API**
WHEN la llamada a OpenAI falla por cualquier razón
THE SYSTEM SHALL mostrar un mensaje de error visible con opción de reintentar, sin romper el estado actual de la tabla

***

## Casos de prueba incluidos en el ejercicio

| # | Input | Comportamiento esperado |
|---|-------|------------------------|
| Ejemplo 1 | "Buenas, para mañana mándame 10 kg jitomate, 5 cajas aguacate hass maduros, 2 manojos cilantro y lo de siempre de limón. Soy Marco del Rincón Oaxaqueño." | 3 items parseados + 1 item ambiguo (limón "lo de siempre") |
| Ejemplo 2 | "hola lalo, urgente: 3kg cebolla morada, 1 caja chile poblano, 8 piezas piña. Hotel Mítico" | 3 items parseados correctamente, totales calculados |
| Ejemplo 3 · Borde | "manden lo de siempre porfa, gracias. Cocina Norte" | Pedido completo marcado como ambiguo, cliente identificado, totales bloqueados |

***

## Fuera de alcance (explícito)

- Autenticación de usuarios
- Base de datos persistente
- Integración real con WhatsApp
- Historial entre sesiones
- Tests exhaustivos
- Deploy de producción robusto
