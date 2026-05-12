/**
 * Tipos del dominio FrescoMX
 * Basados en data/catalog.json y el esquema de respuesta de OpenAI (docs/design.md)
 */

/** Catálogo completo cargado desde data/catalog.json */
export interface Catalog {
  products: Product[];
}

/** Producto del catálogo */
export interface Product {
  id: string;
  name: string;
  synonyms: string[];
  price: number;
  unit: string;
  description?: string;
}

/** Item parseado por OpenAI (respuesta cruda de la API) */
export interface ParsedItem {
  producto_id: string | null;
  nombre: string;
  cantidad: number;
  unidad: string;
  precio_unitario: number;
  subtotal: number;
  ambiguo: boolean;
}

/** Respuesta estructurada de OpenAI tras parsear el mensaje */
export interface ParsedOrder {
  cliente: string;
  items: ParsedItem[];
  pedido_ambiguo: boolean;
  nota_ambiguedad: string | null;
}

/** Item en la tabla de pedidos (después de matching contra catálogo) */
export interface OrderItem {
  productId: string | null;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
  ambiguous: boolean;
}

/** Estados posibles de un pedido en la tabla del día */
export type OrderStatus = 'confirmed' | 'ambiguous' | 'pending';

/** Pedido en la tabla del día */
export interface DailyOrder {
  id: string;
  client: string;
  items: OrderItem[];
  total: number | null;
  status: OrderStatus;
  rawText: string;
  /** ISO 8601 string (e.g. "2024-01-15T10:30:00Z") — serializable across API and client */
  createdAt: string;
}
