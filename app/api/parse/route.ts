import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import catalogData from '../../../data/catalog.json';
import type { ParsedOrder } from '../../../lib/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

/**
 * Prompt estructurado para OpenAI.
 * Envía el mensaje crudo + el catálogo completo.
 * Instruye a retornar siempre JSON válido con el esquema ParsedOrder.
 */
function buildPrompt(text: string): string {
  const catalogJSON = JSON.stringify(catalogData.products, null, 2);

  return `Eres un asistente experto en procesar pedidos de frutas y verduras que llegan por WhatsApp en lenguaje natural.

Tu tarea es analizar el siguiente mensaje y extraer:
1. El nombre del cliente (si aparece en el mensaje)
2. Una lista de productos pedidos con cantidad y unidad
3. Identificar si hay ambigüedades

CATÁLOGO DE PRODUCTOS DISPONIBLES:
${catalogJSON}

REGLAS IMPORTANTES:
- Usa EXACTAMENTE los ids del catálogo para producto_id cuando reconozcas un producto.
- Si un producto NO está en el catálogo o NO tienes certeza de cuál es, producto_id DEBE ser null. NUNCA inventes un id.
- producto_id es null en estos casos: producto desconocido, cantidad ambigua ("lo de siempre", "lo usual"), o sinónimo que no reconozcas del catálogo.
- Marca ambiguo: true cuando la cantidad o el producto no estén claros (ej: "lo de siempre", "manda lo de siempre").
- Si TODO el mensaje es ambiguo (no hay productos claros), marca pedido_ambiguo: true.
- precio_unitario debe ser el precio del catálogo para productos reconocidos, o 0 si no está en catálogo.
- subtotal = cantidad × precio_unitario.
- La unidad debe ser la del catálogo para productos reconocidos.

MENSAJE A PARSEAR:
"""
${text}
"""

Responde ÚNICAMENTE con un objeto JSON válido que siga este esquema exacto:
{
  "cliente": "nombre del cliente o string vacío",
  "items": [
    {
      "producto_id": "id_del_catalogo o null",
      "nombre": "nombre del producto tal como aparece en el mensaje",
      "cantidad": 0,
      "unidad": "kg|pieza|manojo",
      "precio_unitario": 0,
      "subtotal": 0,
      "ambiguo": false
    }
  ],
  "pedido_ambiguo": false,
  "nota_ambiguedad": "explicación de la ambigüedad o null"
}`;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Validar API key
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: 'OPENAI_API_KEY no está configurada. Verifica tu archivo .env.local' },
        { status: 500 }
      );
    }

    // 2. Parsear body
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return Response.json(
        { error: 'El campo "text" es requerido y no puede estar vacío' },
        { status: 400 }
      );
    }

    // 3. Llamar a OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Eres un parser de pedidos de frutas y verduras. Responde SIEMPRE en JSON válido.',
        },
        {
          role: 'user',
          content: buildPrompt(text.trim()),
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return Response.json(
        { error: 'OpenAI no retornó contenido válido' },
        { status: 500 }
      );
    }

    // 4. Parsear respuesta
    let parsed: ParsedOrder;
    try {
      parsed = JSON.parse(content);
    } catch {
      return Response.json(
        { error: 'OpenAI retornó una respuesta con formato inválido' },
        { status: 500 }
      );
    }

    // 5. Validar estructura mínima
    if (!parsed.items || !Array.isArray(parsed.items)) {
      return Response.json(
        { error: 'La respuesta de OpenAI no contiene items válidos' },
        { status: 500 }
      );
    }

    return Response.json(parsed);
  } catch (error) {
    console.error('Error en /api/parse:', error);

    const message =
      error instanceof Error ? error.message : 'Error desconocido al procesar el pedido';

    return Response.json(
      { error: message },
      { status: 500 }
    );
  }
}
