'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';

interface CatalogTableProps {
  products: Product[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function CatalogTable({ products }: CatalogTableProps) {
  const [query, setQuery] = useState('');

  const filtered = products.filter((product) => {
    const q = query.toLowerCase();
    return (
      product.name.toLowerCase().includes(q) ||
      product.synonyms.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="overflow-hidden rounded-lg border border-[#DDE8DD]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#DDE8DD] bg-[#F0F7F0] px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-[#0F1F0F]">Catálogo de Productos</h2>
          <span className="inline-flex items-center rounded-full border border-[#1A7A3C]/20 bg-[#E6F4EC] px-2.5 py-0.5 text-xs font-medium text-[#1A7A3C]">
            {products.length} productos
          </span>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar producto..."
          className="rounded-md border border-[#DDE8DD] bg-white px-3 py-1.5 text-sm text-[#0F1F0F] focus:outline-none focus:ring-1 focus:ring-[#1A7A3C]"
        />
      </div>

      {/* Tabla */}
      <table className="min-w-full">
        <thead className="bg-[#F0F7F0]">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-[#4A6349]">
              Producto
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-[#4A6349]">
              Unidad
            </th>
            <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-[#4A6349]">
              Precio Unit.
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#DDE8DD] bg-white">
          {filtered.map((product) => (
            <tr key={product.id}>
              <td className="px-4 py-2 text-sm font-medium text-[#0F1F0F]">
                {product.name}
              </td>
              <td className="px-4 py-2 text-sm text-[#4A6349]">{product.unit}</td>
              <td className="px-4 py-2 text-right text-sm font-medium text-[#0F1F0F]">
                {formatCurrency(product.price)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <div className="py-8 text-center text-sm text-[#8FAE8C]">
          No se encontraron productos para &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}
