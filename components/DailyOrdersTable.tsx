'use client';

import { useState } from 'react';
import { DailyOrder, OrderStatus } from '@/lib/types';
import OrderTable from './OrderTable';

interface DailyOrdersTableProps {
  orders: DailyOrder[];
  onOrderChange?: (updatedOrder: DailyOrder) => void;
}

function formatCurrency(amount: number | null): string {
  if (amount === null) return '—';
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(amount);
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const config: Record<OrderStatus, { label: string; classes: string }> = {
    confirmed: {
      label: 'Confirmado',
      classes: 'bg-[#E6F4EC] text-[#1A7A3C] border-[#1A7A3C]/20',
    },
    ambiguous: {
      label: 'Ambiguo',
      classes: 'bg-[#FFFBEB] text-[#D97706] border-[#D97706]/20',
    },
    pending: {
      label: 'Pendiente',
      classes: 'bg-[#E6F4EC] text-[#1A7A3C] border-[#1A7A3C]/20',
    },
  };

  const { label, classes } = config[status];

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
}

export default function DailyOrdersTable({ orders, onOrderChange }: DailyOrdersTableProps) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const confirmedCount = orders.filter((o) => o.status === 'confirmed').length;
  const ambiguousCount = orders.filter((o) => o.status === 'ambiguous').length;
  const dailyTotal = orders.reduce((sum, order) => {
    if (order.status === 'ambiguous') return sum;
    return sum + (order.total ?? 0);
  }, 0);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="mb-3 text-4xl">📋</span>
        <p className="text-sm font-medium text-[#4A6349]">No hay pedidos hoy</p>
        <p className="text-xs text-[#8FAE8C]">Pega un mensaje de WhatsApp en Nuevo Pedido para comenzar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#DDE8DD] bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-[#8FAE8C]">Total del día</p>
          <p className="text-2xl font-bold text-[#0F1F0F]">{formatCurrency(dailyTotal)}</p>
        </div>
        <div className="rounded-xl border border-[#DDE8DD] bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-[#8FAE8C]">Confirmados</p>
          <p className="text-2xl font-bold text-[#1A7A3C]">{confirmedCount}</p>
        </div>
        <div className="rounded-xl border border-[#DDE8DD] bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-[#8FAE8C]">Ambiguos</p>
          <p className="text-2xl font-bold text-[#D97706]">{ambiguousCount}</p>
        </div>
      </div>

      {/* Tabla de pedidos */}
      <div className="overflow-hidden rounded-xl border border-[#DDE8DD] bg-white shadow-sm">
        <table className="min-w-full">
          <thead className="bg-[#F0F7F0]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#4A6349]">
                Cliente
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#4A6349]">
                Productos
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#4A6349]">
                Total
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#4A6349]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <>
                <tr
                  key={order.id}
                  onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                  className="cursor-pointer border-b border-[#DDE8DD] transition-colors hover:bg-[#F0F7F0]"
                >
                  <td className="px-4 py-3 text-sm font-medium text-[#0F1F0F]">
                    {order.client || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#0F1F0F]">
                    <ul className="space-y-1">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1">
                          <span className="font-medium">{item.quantity}</span>
                          <span className="text-[#4A6349]">{item.unit}</span>
                          <span>{item.name}</span>
                          {item.ambiguous && (
                            <span className="ml-1 text-[#D97706]" title="Requiere confirmación">
                              ⚠
                            </span>
                          )}
                        </li>
                      ))}
                      {order.items.length > 3 && (
                        <li className="text-xs text-[#8FAE8C]">+{order.items.length - 3} más</li>
                      )}
                    </ul>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-[#0F1F0F]">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
                {expandedOrderId === order.id && (
                  <tr>
                    <td colSpan={4} className="border-b border-[#DDE8DD] bg-[#F0F7F0]/50 px-4 py-4">
                      {onOrderChange ? (
                        <OrderTable order={order} onOrderChange={onOrderChange} />
                      ) : (
                        <p className="text-sm text-[#8FAE8C]">Modo solo lectura</p>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
