import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';

interface LocationValue {
  cidade: string;
  uf: string;
}

export default function ProfileLocationEditor({ variant = 'inline' }: { variant?: 'inline' | 'card' }) {
  const { token } = useAuth();
  const [location, setLocation] = useState<LocationValue>({ cidade: '', uf: '' });
  const [draft, setDraft] = useState<LocationValue>({ cidade: '', uf: '' });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deviceLocationActive, setDeviceLocationActive] = useState(() => {
    try { return Boolean(sessionStorage.getItem('couve:user-position')); } catch { return false; }
  });

  useEffect(() => {
    let active = true;
    if (!token) return;
    fetch(`${API_URL}/me/localizacao`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || 'Não foi possível carregar sua localização.');
        if (active) setLocation({ cidade: result.cidade || '', uf: result.uf || '' });
      })
      .catch((error) => { if (active) toast.error(error instanceof Error ? error.message : 'Erro ao carregar sua localização.'); });
    return () => { active = false; };
  }, [token]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const cidade = draft.cidade.trim();
    const uf = draft.uf.trim().toUpperCase();
    if (Boolean(cidade) !== Boolean(uf)) return toast.error('Informe cidade e UF juntas, ou deixe ambas vazias.');
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/me/localizacao`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ cidade, uf }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Não foi possível salvar sua localização.');
      setLocation({ cidade: result.cidade || '', uf: result.uf || '' });
      try { sessionStorage.removeItem('couve:user-position'); } catch { /* localização da sessão é opcional */ }
      setDeviceLocationActive(false);
      setEditing(false);
      toast.success('Localização atualizada. Ela fica visível apenas para você e ajuda a ordenar hortas próximas.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível salvar sua localização.');
    } finally {
      setSaving(false);
    }
  };

  const useDeviceLocation = () => {
    if (!navigator.geolocation) return toast.error('Seu navegador não oferece localização. Você ainda pode informar cidade e UF.');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        try {
          sessionStorage.setItem('couve:user-position', JSON.stringify({ lat: coords.latitude, lng: coords.longitude }));
        } catch { /* a localização atual só será usada enquanto estiver disponível nesta tela */ }
        setDeviceLocationActive(true);
        toast.success('Localização atual ativada para ordenar hortas próximas nesta sessão.');
      },
      () => toast.error('Não foi possível acessar a localização. Você ainda pode informar cidade e UF.'),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  };

  return <>
    <div className={variant === 'card' ? 'mx-4 mb-5 rounded-[14px] border border-gray-200 bg-white p-4' : 'mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-white/90'}>
      {variant === 'card' && <h2 className="mb-2 text-[13px] font-semibold text-[#34453a]">Sua localização</h2>}
      <span className={`inline-flex items-center gap-1 ${variant === 'card' ? 'text-[12px] text-[#58665c]' : ''}`}><MapPin className="size-3.5" />{location.cidade && location.uf ? `${location.cidade}, ${location.uf}` : 'Localização não informada'}</span>
      <button type="button" onClick={() => { setDraft(location); setEditing(true); }} className={variant === 'card' ? 'ml-2 text-[12px] font-semibold text-[#16803d] underline underline-offset-2' : 'text-[11px] text-white underline underline-offset-2 hover:text-white'}>{location.cidade ? 'Editar localização' : 'Adicionar localização'}</button>
      {variant === 'inline' && <span className="text-white/70">Cidade e UF privadas · usadas para estimar proximidade</span>}
      {variant === 'card' && <p className="mt-1 text-[11px] text-[#718075]">Somente cidade e UF; visível apenas para você e usada para estimar proximidade.</p>}
      <button type="button" onClick={useDeviceLocation} className={variant === 'card' ? 'mt-2 block text-[12px] font-semibold text-[#16803d] underline underline-offset-2' : 'text-[11px] text-white underline underline-offset-2 hover:text-white'}>
        {deviceLocationActive ? 'Localização do dispositivo ativa nesta sessão' : 'Usar localização atual do dispositivo'}
      </button>
    </div>
    {editing && <div className="fixed inset-0 z-[105] flex items-center justify-center bg-black/35 p-4" role="presentation" onClick={() => !saving && setEditing(false)}><form onSubmit={save} onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"><div className="mb-4"><h2 className="text-[17px] font-bold text-neutral-950">Sua localização</h2><p className="mt-1 text-[12px] leading-5 text-[#718075]">Informe somente cidade e UF. Este dado fica privado e não exibe endereço residencial.</p></div><label className="mb-3 block text-[12px] font-medium text-[#4a5565]">Cidade<input maxLength={100} value={draft.cidade} onChange={(event) => setDraft((current) => ({ ...current, cidade: event.target.value }))} placeholder="Ex.: Brasília" className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 px-3 text-[13px] outline-none focus:border-[#00a63e]" /></label><label className="block text-[12px] font-medium text-[#4a5565]">UF<input maxLength={2} value={draft.uf} onChange={(event) => setDraft((current) => ({ ...current, uf: event.target.value.toUpperCase() }))} placeholder="DF" className="mt-1.5 h-10 w-20 rounded-lg border border-gray-200 px-3 text-[13px] uppercase outline-none focus:border-[#00a63e]" /></label><div className="mt-5 flex justify-end gap-2"><button type="button" disabled={saving} onClick={() => setEditing(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-[12px] font-semibold text-[#66736a]">Cancelar</button><button type="submit" disabled={saving} className="rounded-lg bg-[#00a63e] px-4 py-2 text-[12px] font-semibold text-white disabled:opacity-60">{saving ? 'Salvando…' : 'Salvar localização'}</button></div></form></div>}
  </>;
}
