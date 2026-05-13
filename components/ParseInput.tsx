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
      <label htmlFor="whatsapp-message" className="block text-sm font-semibold text-[#4A6349]">
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
        placeholder="Ej: Buenas, para mañana mándame 10 kg jitomate, 5 cajas aguacate hass maduros, 2 manojos cilantro. Soy Marco del Rincón Oaxaqueño."
        className="w-full resize-none rounded-lg border border-[#DDE8DD] bg-white p-3 text-sm text-[#0F1F0F] placeholder:text-[#8FAE8C] focus:border-[#1A7A3C] focus:outline-none focus:ring-2 focus:ring-[#1A7A3C]/10 min-h-[120px]"
      />
      {error && <p className="text-sm text-[#EF4444]">{error}</p>}
      <button
        onClick={handleParse}
        disabled={loading}
        className="rounded-lg bg-[#1A7A3C] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#15612F] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Parseando...' : 'Parsear pedido'}
      </button>
    </div>
  );
}
