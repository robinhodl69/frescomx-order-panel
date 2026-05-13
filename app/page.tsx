'use client';

import { useState, useCallback } from 'react';
import { DailyOrder, ParsedOrder, OrderStatus } from '@/lib/types';
import { buildOrderItems, loadCatalog } from '@/lib/parser';
import ParseInput from '@/components/ParseInput';
import OrderTable from '@/components/OrderTable';
import DailyOrdersTable from '@/components/DailyOrdersTable';

function formatCurrency(amount: number | null): string {
  if (amount === null) return '$—';
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function Home() {
  const [orders, setOrders] = useState<DailyOrder[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const catalog = loadCatalog();

  const calculateDailyTotal = useCallback((): number => {
    return orders.reduce((sum, order) => {
      if (order.status === 'ambiguous') return sum;
      return sum + (order.total ?? 0);
    }, 0);
  }, [orders]);

  const handleParsed = useCallback(
    (parsed: ParsedOrder) => {
      setParseError(null);

      const items = buildOrderItems(parsed.items, catalog);
      const hasAmbiguousItems = items.some((item) => item.ambiguous);
      const total = hasAmbiguousItems
        ? null
        : Math.round(items.reduce((sum, item) => sum + item.subtotal, 0) * 100) / 100;

      const status: OrderStatus = hasAmbiguousItems ? 'ambiguous' : 'confirmed';

      const newOrder: DailyOrder = {
        id: crypto.randomUUID(),
        client: parsed.cliente || 'Cliente no identificado',
        items,
        total,
        status,
        rawText: parsed.nota_ambiguedad || '',
        createdAt: new Date().toISOString(),
      };

      setOrders((prev) => [newOrder, ...prev]);
      setSelectedOrderId(newOrder.id);
    },
    [catalog]
  );

  const handleOrderChange = useCallback((updatedOrder: DailyOrder) => {
    setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
  }, []);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">FrescoMX — Panel de Pedidos</h1>
          <p className="text-sm text-gray-500">Estructura pedidos de WhatsApp automáticamente</p>
        </header>

        <section className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Nuevo Pedido</h2>
          <ParseInput
            onParsed={handleParsed}
          />
          {parseError && (
            <div className="mt-3 flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
              <span>{parseError}</span>
              <button
                onClick={() => setParseError(null)}
                className="ml-auto rounded-md bg-red-100 px-2 py-1 text-xs font-medium hover:bg-red-200"
              >
                Reintentar
              </button>
            </div>
          )}
        </section>

        {selectedOrder && (
          <section className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Detalle del Pedido</h2>
              <button
                onClick={() => setSelectedOrderId(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cerrar
              </button>
            </div>
            <OrderTable order={selectedOrder} onOrderChange={handleOrderChange} />
          </section>
        )}

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Pedidos del Día</h2>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total del día</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(calculateDailyTotal())}</p>
            </div>
          </div>
          <DailyOrdersTable
            orders={orders}
            onViewDetail={(orderId) => setSelectedOrderId(orderId)}
          />
        </section>
      </main>
    </div>
  );
}
