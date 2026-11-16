import { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import { toast } from 'sonner';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import { isValidPhone } from '../lib/contact';

export default function ProfilePhoneEditor({ variant = 'inline' }: { variant?: 'inline' | 'card' }) {
  const { token } = useAuth();
  const [telefone, setTelefone] = useState('');
  const [draft, setDraft] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let active = true;
    if (!token) return;
    fetch(`${API_URL}/me/telefone`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || 'Não foi possível carregar seu telefone.');
        if (active) { setTelefone(result.telefone || ''); setStatus('ready'); }
      })
      .catch(() => { if (active) setStatus('error'); });
    return () => { active = false; };
  }, [token]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const valor = draft.trim();
    if (valor && !isValidPhone(valor)) return toast.error('Informe um telefone válido');
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/me/telefone`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ telefone: valor }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Não foi possível salvar seu telefone.');
      setTelefone(result.telefone || '');
      setEditing(false);
      toast.success('Telefone atualizado. Ele fica visível apenas para os administradores das suas hortas.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível salvar seu telefone.');
    } finally {
      setSaving(false);
    }
  };

  return <>
    <div className={variant === 'card' ? 'mx-4 mb-5 rounded-[14px] border border-gray-200 bg-white p-4' : 'mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-white/90'}>
      {variant === 'card' && <h2 className="mb-2 text-[13px] font-semibold text-[#34453a]">Seu telefone</h2>}
      <span className={`inline-flex items-center gap-1 ${variant === 'card' ? 'text-[12px] text-[#58665c]' : ''}`}><Phone className="size-3.5" />{status === 'loading' ? 'Carregando telefone…' : status === 'error' ? 'Não foi possível carregar seu telefone' : telefone || 'Telefone não informado'}</span>
      <button type="button" disabled={status !== 'ready'} onClick={() => { setDraft(telefone); setEditing(true); }} className={`${variant === 'card' ? 'ml-2 text-[12px] font-semibold text-[#16803d] underline underline-offset-2' : 'text-[11px] text-white underline underline-offset-2 hover:text-white'} disabled:cursor-not-allowed disabled:opacity-50`}>{telefone ? 'Editar telefone' : 'Adicionar telefone'}</button>
      {variant === 'inline' && <span className="text-white/70">Visível só para administradores das suas hortas</span>}
      {variant === 'card' && <p className="mt-1 text-[11px] text-[#718075]">Opcional. Visível apenas para os administradores das hortas em que você participa.</p>}
    </div>
    {editing && <div className="fixed inset-0 z-[105] flex items-center justify-center bg-black/35 p-4" role="presentation" onClick={() => !saving && setEditing(false)}>
      <form onSubmit={save} noValidate onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-4">
          <h2 className="text-[17px] font-bold text-neutral-950">Seu telefone</h2>
          <p className="mt-1 text-[12px] leading-5 text-[#718075]">Opcional. Os administradores das suas hortas podem usar para falar com você. Deixe vazio para remover.</p>
        </div>
        <label className="block text-[12px] font-medium text-[#4a5565]">Telefone<input type="tel" autoComplete="tel" maxLength={24} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="(61) 99999-9999" className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 px-3 text-[13px] outline-none focus:border-[#00a63e]" /></label>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" disabled={saving} onClick={() => setEditing(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-[12px] font-semibold text-[#66736a]">Cancelar</button>
          <button type="submit" disabled={saving} className="rounded-lg bg-[#00a63e] px-4 py-2 text-[12px] font-semibold text-white disabled:opacity-60">{saving ? 'Salvando…' : 'Salvar telefone'}</button>
        </div>
      </form>
    </div>}
  </>;
}
