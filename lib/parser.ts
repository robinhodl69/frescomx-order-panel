import { Product, OrderItem, ParsedItem } from './types';
import catalogData from '../data/catalog.json';

/**
 * Carga el catálogo desde data/catalog.json
 */
export function loadCatalog(): Product[] {
  return catalogData.products;
}

/**
 * Normaliza un string para comparación:
 * - minúsculas
 * - elimina acentos
 * - trim
 */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Busca un producto en el catálogo por nombre o sinónimos.
 * Match case-insensitive y sin acentos.
 * Retorna undefined si no hay match.
 */
export function findProductByName(input: string, catalog: Product[]): Product | undefined {
  const normalizedInput = normalize(input);

  return catalog.find((product) => {
    // Match contra nombre oficial
    if (normalize(product.name) === normalizedInput) return true;

    // Match contra sinónimos
    return product.synonyms.some((synonym) => normalize(synonym) === normalizedInput);
  });
}

/**
 * Calcula el subtotal de un item.
 * Redondea a 2 decimales.
 */
export function calculateSubtotal(quantity: number, unitPrice: number): number {
  return Math.round(quantity * unitPrice * 100) / 100;
}

/**
 * Construye los OrderItems a partir de los items parseados por OpenAI,
 * haciendo match contra el catálogo para obtener precios y flags de ambigüedad.
 *
 * Si OpenAI ya identificó el producto (producto_id !== null), lo usa directamente.
 * Si no, intenta hacer match por nombre contra el catálogo.
 * Si aún no hay match, deja productId en null y unitPrice en 0.
 */
export function buildOrderItems(parsedItems: ParsedItem[], catalog: Product[]): OrderItem[] {
  return parsedItems.map((parsed) => {
    // Si OpenAI ya identificó el producto, buscarlo por id
    let matchedProduct: Product | undefined;

    if (parsed.producto_id) {
      matchedProduct = catalog.find((p) => p.id === parsed.producto_id);
    }

    // Si no hay match por id, intentar por nombre
    if (!matchedProduct) {
      matchedProduct = findProductByName(parsed.nombre, catalog);
    }

    // Si hay match, usar datos del catálogo; si no, dejar como no reconocido
    const productId = matchedProduct?.id ?? null;
    const unitPrice = matchedProduct?.price ?? 0;
    const unit = matchedProduct?.unit ?? parsed.unidad;

    // Un item es ambiguo si OpenAI lo marcó como ambiguo
    // O si no hay match en el catálogo (productId es null)
    const ambiguous = parsed.ambiguo || productId === null;

    const subtotal = ambiguous && productId === null
      ? 0
      : calculateSubtotal(parsed.cantidad, unitPrice);

    return {
      productId,
      name: matchedProduct?.name ?? parsed.nombre,
      quantity: parsed.cantidad,
      unit,
      unitPrice,
      subtotal,
      ambiguous,
    };
  });
}
