import { useState } from 'react';
import { MapPin } from 'lucide-react';

interface ExploreLocationPromptProps {
  onUseLocation: () => void;
  onSaveCity: (cidade: string, uf: string) => Promise<boolean>;
  onDismiss: () => void;
}

export default function ExploreLocationPrompt({ onUseLocation, onSaveCity, onDismiss }: ExploreLocationPromptProps) {
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [saving, setSaving] = useState(false);

  const salvar = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onSaveCity(cidade.trim(), uf.trim().toUpperCase());
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'h-10 rounded-lg border border-[#d7e5da] bg-white px-3 text-[13px] outline-none focus:border-[#42a765]';

  return (
    <section className="rounded-xl border border-[#cfe8d6] bg-[#f0fdf4] p-4" aria-label="Onde você está?">
      <p className="text-[15px] font-semibold text-[#17201A]">Onde você está?</p>
      <p className="mt-1 text-[13px] text-[#4f5f54]">Mostramos as hortas mais perto de você.</p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="button" onClick={onUseLocation} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#168a3c] px-4 text-[13px] font-semibold text-white hover:bg-[#117331]">
          <MapPin className="size-4" /> Usar minha localização
        </button>
        <span className="text-[13px] text-[#66736A]">ou</span>
        <form onSubmit={salvar} className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="explore-prompt-cidade">Cidade</label>
          <input id="explore-prompt-cidade" required maxLength={100} value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade *" className={`${inputClass} w-40`} />
          <label className="sr-only" htmlFor="explore-prompt-uf">UF</label>
          <input id="explore-prompt-uf" required maxLength={2} value={uf} onChange={(e) => setUf(e.target.value.toUpperCase())} placeholder="UF *" className={`${inputClass} w-16`} />
          <button type="submit" disabled={saving} className="h-10 rounded-lg border border-[#168a3c] px-3 text-[13px] font-semibold text-[#168a3c] hover:bg-white disabled:opacity-60">
            {saving ? 'Salvando…' : 'Salvar'}
          </button>
        </form>
      </div>
      <button type="button" onClick={onDismiss} className="mt-3 text-[12px] text-[#66736A] hover:underline">Agora não</button>
    </section>
  );
}
