'use client';

import { DailyOrder, OrderStatus } from '@/lib/types';

interface DailyOrdersTableProps {
  orders: DailyOrder[];
  onViewDetail?: (orderId: string) => void;
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
      classes: 'bg-green-100 text-green-800',
    },
    ambiguous: {
      label: 'Ambiguo',
      classes: 'bg-amber-100 text-amber-800',
    },
    pending: {
      label: 'Pendiente',
      classes: 'bg-gray-100 text-gray-800',
    },
  };

  const { label, classes } = config[status];

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
}

export default function DailyOrdersTable({ orders, onViewDetail }: DailyOrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <p className="text-sm text-gray-500">No hay pedidos registrados hoy</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Cliente
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Productos
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Total
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {orders.map((order) => (
            <tr
              key={order.id}
              className={order.status === 'ambiguous' ? 'bg-amber-50/50' : undefined}
            >
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                {order.client || '—'}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                <ul className="space-y-1">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-1">
                      <span className="font-medium">{item.quantity}</span>
                      <span className="text-gray-500">{item.unit}</span>
                      <span>{item.name}</span>
                      {item.ambiguous && (
                        <span className="ml-1 text-amber-600" title="Requiere confirmación">
                          ⚠
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-gray-900">
                {formatCurrency(order.total)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <StatusBadge status={order.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <button
                  onClick={() => onViewDetail?.(order.id)}
                  className="rounded-md bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Ver detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
