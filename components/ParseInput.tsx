'use client';

import { useState } from 'react';
import { ParsedOrder } from '@/lib/types';

interface ParseInputProps {
  onParsed: (result: ParsedOrder) => void;
}

export default function ParseInput({ onParsed }: ParseInputProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleParse = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError('El mensaje no puede estar vacío');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar el pedido');
      }

      onParsed(data as ParsedOrder);
      setText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label htmlFor="whatsapp-message" className="block text-sm font-medium text-gray-700">
        Mensaje de WhatsApp
      </label>
      <textarea
        id="whatsapp-message"
        rows={4}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (error) setError(null);
        }}
        placeholder="Pega aquí el mensaje de WhatsApp..."
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        onClick={handleParse}
        disabled={loading}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Parseando...' : 'Parsear pedido'}
      </button>
    </div>
  );
}
