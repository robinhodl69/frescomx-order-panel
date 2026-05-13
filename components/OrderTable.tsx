'use client';

import { useState, useCallback } from 'react';
import { DailyOrder, OrderItem, OrderStatus } from '@/lib/types';

interface OrderTableProps {
  order: DailyOrder;
  onOrderChange: (updatedOrder: DailyOrder) => void;
}

function formatCurrency(amount: number | null): string {
  if (amount === null) return '$—';
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

export default function OrderTable({ order, onOrderChange }: OrderTableProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editQuantity, setEditQuantity] = useState<string>('');
  const [editUnit, setEditUnit] = useState<string>('');

  const calculateSubtotal = useCallback((quantity: number, unitPrice: number): number => {
    return Math.round(quantity * unitPrice * 100) / 100;
  }, []);

  const calculateTotal = useCallback((items: OrderItem[]): number | null => {
    if (items.some((item) => item.ambiguous && item.productId === null)) {
      return null;
    }
    return Math.round(items.reduce((sum, item) => sum + item.subtotal, 0) * 100) / 100;
  }, []);

  const handleStartEdit = (index: number, item: OrderItem) => {
    setEditingIndex(index);
    setEditQuantity(String(item.quantity));
    setEditUnit(item.unit);
  };

  const handleSaveEdit = (index: number) => {
    const newQuantity = parseFloat(editQuantity);
    if (isNaN(newQuantity) || newQuantity <= 0) return;

    const updatedItems = [...order.items];
    const item = updatedItems[index];

    updatedItems[index] = {
      ...item,
      quantity: newQuantity,
      unit: editUnit,
      subtotal: calculateSubtotal(newQuantity, item.unitPrice),
    };

    const newTotal = calculateTotal(updatedItems);
    const newStatus: OrderStatus = newTotal === null ? 'ambiguous' : 'confirmed';

    onOrderChange({
      ...order,
      items: updatedItems,
      total: newTotal,
      status: newStatus,
    });

    setEditingIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{order.client || 'Cliente no identificado'}</h3>
            <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString('es-MX')}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Producto
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Cantidad
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Unidad
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Precio Unit.
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Subtotal
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Estado
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {order.items.map((item, index) => (
            <tr
              key={index}
              className={item.ambiguous ? 'bg-amber-50/30' : undefined}
            >
              <td className="px-4 py-2 text-sm text-gray-900">
                <div className="flex items-center gap-2">
                  {item.name}
                  {item.ambiguous && (
                    <span className="text-amber-600" title="Requiere confirmación">
                      ⚠
                    </span>
                  )}
                </div>
                {item.productId === null && (
                  <span className="text-xs text-red-600">Producto no reconocido</span>
                )}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {editingIndex === index ? (
                  <input
                    type="number"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                    className="w-20 rounded-md border border-gray-300 px-2 py-1 text-sm"
                    min="0"
                    step="0.1"
                  />
                ) : (
                  <button
                    onClick={() => handleStartEdit(index, item)}
                    className="hover:text-blue-600"
                  >
                    {item.quantity}
                  </button>
                )}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editUnit}
                    onChange={(e) => setEditUnit(e.target.value)}
                    className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm"
                  />
                ) : (
                  <button
                    onClick={() => handleStartEdit(index, item)}
                    className="hover:text-blue-600"
                  >
                    {item.unit}
                  </button>
                )}
              </td>
              <td className="px-4 py-2 text-right text-sm text-gray-700">
                {formatCurrency(item.unitPrice)}
              </td>
              <td className="px-4 py-2 text-right text-sm font-medium text-gray-900">
                {formatCurrency(item.subtotal)}
              </td>
              <td className="px-4 py-2 text-sm">
                {item.ambiguous ? (
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                    Requiere confirmación
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                    OK
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingIndex !== null && (
        <div className="flex items-center justify-end gap-2 border-t border-gray-200 bg-gray-50 px-4 py-2">
          <button
            onClick={handleCancelEdit}
            className="rounded-md bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => handleSaveEdit(editingIndex)}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-500"
          >
            Guardar
          </button>
        </div>
      )}
    </div>
  );
}
