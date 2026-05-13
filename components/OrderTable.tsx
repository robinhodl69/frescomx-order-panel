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

export default function OrderTable({ order, onOrderChange }: OrderTableProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editQuantity, setEditQuantity] = useState<string>('');
  const [editUnit, setEditUnit] = useState<string>('');

  const calculateSubtotal = useCallback((quantity: number, unitPrice: number): number => {
    return Math.round(quantity * unitPrice * 100) / 100;
  }, []);

  const calculateTotal = useCallback((items: OrderItem[]): number | null => {
    if (items.some((item) => item.ambiguous)) {
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
    const newStatus: OrderStatus = updatedItems.some((item) => item.ambiguous) ? 'ambiguous' : 'confirmed';

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
    <div className="overflow-hidden rounded-lg border border-[#DDE8DD]">
      <div className="border-b border-[#DDE8DD] bg-[#F0F7F0] px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#0F1F0F]">{order.client || 'Cliente no identificado'}</h3>
            <p className="text-xs text-[#8FAE8C]">{new Date(order.createdAt).toLocaleString('es-MX')}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            <span className="text-lg font-bold text-[#0F1F0F]">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>
      </div>

      <table className="min-w-full divide-y divide-[#DDE8DD]">
        <thead className="bg-[#F0F7F0]">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-[#4A6349]">
              Producto
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-[#4A6349]">
              Cantidad
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-[#4A6349]">
              Unidad
            </th>
            <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-[#4A6349]">
              Precio Unit.
            </th>
            <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-[#4A6349]">
              Subtotal
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-[#4A6349]">
              Estado
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#DDE8DD] bg-white">
          {order.items.map((item, index) => (
            <tr
              key={index}
              className={item.ambiguous ? 'bg-[#FFFBEB]/30' : undefined}
            >
              <td className="px-4 py-2 text-sm text-[#0F1F0F]">
                <div className="flex items-center gap-2">
                  {item.name}
                  {item.ambiguous && (
                    <span className="text-[#D97706]" title="Requiere confirmación">
                      ⚠
                    </span>
                  )}
                </div>
                {item.productId === null && (
                  <span className="text-xs text-[#EF4444]">Producto no reconocido</span>
                )}
              </td>
              <td className="px-4 py-2 text-sm text-[#4A6349]">
                {editingIndex === index ? (
                  <input
                    type="number"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                    className="w-20 rounded-md border border-[#DDE8DD] px-2 py-1 text-sm"
                    min="0"
                    step="0.1"
                  />
                ) : (
                  <button
                    onClick={() => handleStartEdit(index, item)}
                    className="hover:text-[#1A7A3C]"
                  >
                    {item.quantity}
                  </button>
                )}
              </td>
              <td className="px-4 py-2 text-sm text-[#4A6349]">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editUnit}
                    onChange={(e) => setEditUnit(e.target.value)}
                    className="w-24 rounded-md border border-[#DDE8DD] px-2 py-1 text-sm"
                  />
                ) : (
                  <button
                    onClick={() => handleStartEdit(index, item)}
                    className="hover:text-[#1A7A3C]"
                  >
                    {item.unit}
                  </button>
                )}
              </td>
              <td className="px-4 py-2 text-right text-sm text-[#4A6349]">
                {formatCurrency(item.unitPrice)}
              </td>
              <td className="px-4 py-2 text-right text-sm font-medium text-[#0F1F0F]">
                {formatCurrency(item.subtotal)}
              </td>
              <td className="px-4 py-2 text-sm">
                {item.ambiguous ? (
                  <span className="inline-flex items-center rounded-full border border-[#D97706]/20 bg-[#FEF9C3] px-2.5 py-0.5 text-xs font-medium text-[#854D0E]">
                    Requiere confirmación
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-[#1A7A3C]/20 bg-[#E6F4EC] px-2.5 py-0.5 text-xs font-medium text-[#1A7A3C]">
                    OK
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingIndex !== null && (
        <div className="flex items-center justify-end gap-2 border-t border-[#DDE8DD] bg-[#F0F7F0] px-4 py-2">
          <button
            onClick={handleCancelEdit}
            className="rounded-md bg-white px-3 py-1.5 text-xs font-medium text-[#4A6349] ring-1 ring-inset ring-[#DDE8DD] hover:bg-[#F0F7F0]"
          >
            Cancelar
          </button>
          <button
            onClick={() => handleSaveEdit(editingIndex)}
            className="rounded-md bg-[#1A7A3C] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#15612F]"
          >
            Guardar
          </button>
        </div>
      )}
    </div>
  );
}
