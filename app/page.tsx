'use client';

import { useState, useCallback } from 'react';
import { DailyOrder, ParsedOrder, OrderStatus } from '@/lib/types';
import { buildOrderItems, loadCatalog } from '@/lib/parser';
import ParseInput from '@/components/ParseInput';
import OrderTable from '@/components/OrderTable';
import DailyOrdersTable from '@/components/DailyOrdersTable';
import CatalogTable from '@/components/CatalogTable';

function formatCurrency(amount: number | null): string {
  if (amount === null) return '$—';
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return date.toLocaleDateString('es-MX', options);
}

export default function Home() {
  const [orders, setOrders] = useState<DailyOrder[]>([]);
  const [activeTab, setActiveTab] = useState<'catalogo' | 'nuevo' | 'pedidos'>('catalogo');
  const [lastParsedOrder, setLastParsedOrder] = useState<DailyOrder | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const catalog = loadCatalog();

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
      setLastParsedOrder(newOrder);
    },
    [catalog]
  );

  const handleOrderChange = useCallback((updatedOrder: DailyOrder) => {
    setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
    setLastParsedOrder((prev) => (prev?.id === updatedOrder.id ? updatedOrder : prev));
  }, []);

  const handleRetry = () => {
    setParseError(null);
    const textarea = document.getElementById('whatsapp-message') as HTMLTextAreaElement;
    if (textarea) {
      textarea.focus();
    }
  };

  const today = new Date();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="sticky top-0 h-screen w-52 border-r border-[#DDE8DD] bg-[#F0F7F0] p-4">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-lg font-semibold text-[#1A7A3C] font-[family-name:var(--font-display)]">
            <span>🥦</span>
            <span>FrescoMX</span>
          </div>
          <p className="mt-1 text-xs text-[#8FAE8C]">{formatDate(today)}</p>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('catalogo')}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
              activeTab === 'catalogo'
                ? 'bg-[#E6F4EC] font-semibold text-[#1A7A3C]'
                : 'text-[#4A6349] hover:bg-[#E6F4EC] hover:text-[#1A7A3C]'
            }`}
          >
            Catálogo
          </button>
          <button
            onClick={() => setActiveTab('nuevo')}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
              activeTab === 'nuevo'
                ? 'bg-[#E6F4EC] font-semibold text-[#1A7A3C]'
                : 'text-[#4A6349] hover:bg-[#E6F4EC] hover:text-[#1A7A3C]'
            }`}
          >
            Nuevo Pedido
          </button>
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
              activeTab === 'pedidos'
                ? 'bg-[#E6F4EC] font-semibold text-[#1A7A3C]'
                : 'text-[#4A6349] hover:bg-[#E6F4EC] hover:text-[#1A7A3C]'
            }`}
          >
            Pedidos del Día
          </button>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-8">
        {activeTab === 'catalogo' && (
          <div>
            <CatalogTable products={catalog} />
          </div>
        )}

        {activeTab === 'nuevo' && (
          <div className="flex min-h-full items-center justify-center">
            <div className="mx-auto max-w-2xl w-full">
              <div className="rounded-xl border border-[#DDE8DD] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-[#0F1F0F] font-[family-name:var(--font-display)]">Nuevo Pedido</h2>
                <ParseInput onParsed={handleParsed} />

                {/* Feedback post-parseo */}
                {lastParsedOrder && !parseError && (
                  <div className="mt-4">
                    {lastParsedOrder.status === 'confirmed' ? (
                      <div className="rounded-lg border border-[#1A7A3C]/20 bg-[#E6F4EC] p-3 text-sm text-[#1A7A3C]">
                        ✅ Pedido de {lastParsedOrder.client} creado — {formatCurrency(lastParsedOrder.total)}
                      </div>
                    ) : (
                      <div className="rounded-lg border border-[#D97706]/20 bg-[#FFFBEB] p-3 text-sm text-[#D97706]">
                        <p>⚠️ Pedido de {lastParsedOrder.client} tiene items que requieren confirmación</p>
                        <button
                          onClick={() => setActiveTab('pedidos')}
                          className="mt-1 text-sm font-medium text-[#1A7A3C] underline"
                        >
                          Ver en Pedidos del Día →
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {parseError && (
                  <div className="mt-4 rounded-lg border border-[#EF4444]/20 bg-[#FEF2F2] p-3 text-sm text-[#EF4444]">
                    <p>❌ {parseError}</p>
                    <button
                      onClick={handleRetry}
                      className="mt-1 text-sm font-medium text-[#EF4444] underline"
                    >
                      Intentar de nuevo
                    </button>
                  </div>
                )}

                {/* OrderTable del último pedido parseado */}
                {lastParsedOrder && (
                  <div className="mt-6">
                    <OrderTable order={lastParsedOrder} onOrderChange={handleOrderChange} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pedidos' && (
          <div>
            <DailyOrdersTable orders={orders} onOrderChange={handleOrderChange} />
          </div>
        )}
      </main>
    </div>
  );
}
