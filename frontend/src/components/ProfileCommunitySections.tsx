import { useEffect, useState } from 'react';
import { CheckCircle2, Leaf, MapPin, Users } from 'lucide-react';
import { toast } from 'sonner';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import MyRedeemedRewardsSection, { type RedeemedReward } from './MyRedeemedRewardsSection';

interface Garden {
  id: number;
  nome: string;
  papel: 'ADMIN' | 'MEMBER';
  participantes: number;
  tarefas_concluidas: number;
}

interface ProfileHistory {
  hortas: Garden[];
  recompensas_resgatadas: RedeemedReward[];
}

interface Props {
  onNavigate?: (page: 'explore') => void;
}

export default function ProfileCommunitySections({ onNavigate }: Props) {
  const { token, leaveGarden, isAdmin } = useAuth();
  const [history, setHistory] = useState<ProfileHistory>({ hortas: [], recompensas_resgatadas: [] });
  const [loading, setLoading] = useState(true);
  const [gardenToLeave, setGardenToLeave] = useState<Garden | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/me/historico`, { headers: { Authorization: `Bearer ${token}` } });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || 'Não foi possível carregar as hortas e os resgates.');
        if (active) setHistory({ hortas: result.hortas || [], recompensas_resgatadas: result.recompensas_resgatadas || [] });
      } catch (error) {
        if (active) toast.error(error instanceof Error ? error.message : 'Erro ao carregar os dados do perfil.');
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [token, refresh]);

  const confirmLeave = async () => {
    if (!gardenToLeave || leaving) return;
    setLeaving(true);
    try {
      const user = await leaveGarden(gardenToLeave.id);
      toast.success(`Você saiu de ${gardenToLeave.nome}.`);
      setGardenToLeave(null);
      setRefresh((value) => value + 1);
      if (!user.roles.length) onNavigate?.('explore');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível sair da horta.');
    } finally {
      setLeaving(false);
    }
  };

  return <>
    <section className="mt-4 rounded-[14px] border border-gray-200 bg-white p-4 sm:p-5">
      <div className="mb-4"><h2 className="text-[15px] font-bold text-neutral-950">Minhas hortas</h2><p className="mt-0.5 text-[12px] text-[#718075]">Hortas das quais você participa ou que administra.</p></div>
      {loading ? <p className="py-6 text-center text-[13px] text-[#718075]">Carregando suas hortas...</p>
        : history.hortas.length === 0 ? <div className="rounded-xl border border-dashed border-gray-200 px-5 py-8 text-center"><Leaf className="mx-auto size-6 text-[#7caa86]" /><p className="mt-2 text-[13px] font-semibold text-[#34453a]">Você ainda não participa de uma horta</p><p className="mt-1 text-[12px] text-[#718075]">Explore as comunidades para encontrar a sua.</p><button onClick={() => onNavigate?.('explore')} className="mt-3 rounded-lg bg-[#00a63e] px-3.5 py-2 text-[12px] font-semibold text-white hover:bg-[#008236]">Explorar hortas</button></div>
          : <div className="grid gap-3 sm:grid-cols-2">{history.hortas.map((garden) => <article key={`${garden.id}-${garden.papel}`} className="rounded-xl border border-gray-200 p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate text-[14px] font-semibold text-neutral-950">{garden.nome}</h3><p className="mt-1 flex items-center gap-1 text-[11px] text-[#718075]"><MapPin className="size-3" />Horta comunitária</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${garden.papel === 'ADMIN' ? 'bg-amber-50 text-[#91630c]' : 'bg-green-50 text-[#16803d]'}`}>{garden.papel === 'ADMIN' ? 'Administrador' : 'Participante'}</span></div><div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-100 pt-3 text-[11px] text-[#66736a]"><span className="inline-flex items-center gap-1.5"><Users className="size-3.5" />{Number(garden.participantes)} participantes</span><span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5" />{Number(garden.tarefas_concluidas)} tarefas suas</span></div><div className="mt-3 flex items-center justify-between gap-3">{onNavigate && <button onClick={() => onNavigate('explore')} className="text-[12px] font-semibold text-[#16803d] hover:underline">Ver horta <span aria-hidden="true">→</span></button>}{garden.papel === 'MEMBER' && <button type="button" onClick={() => setGardenToLeave(garden)} className="ml-auto text-[12px] font-medium text-[#9b3d34] hover:underline">Sair da horta</button>}</div></article>)}</div>}
    </section>

    {!isAdmin && <MyRedeemedRewardsSection rewards={history.recompensas_resgatadas} loading={loading} />}

    {gardenToLeave && <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4" role="presentation" onClick={() => !leaving && setGardenToLeave(null)}><section role="alertdialog" aria-modal="true" aria-labelledby="profile-leave-garden-title" onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"><h2 id="profile-leave-garden-title" className="text-[16px] font-bold text-neutral-950">Sair de {gardenToLeave.nome}?</h2><p className="mt-2 text-[13px] leading-5 text-[#58665c]">Tarefas em andamento e registros históricos serão preservados, mas você perderá acesso à horta até voltar a participar. Sua conta e suas outras hortas não serão afetadas.</p><div className="mt-5 flex justify-end gap-2"><button type="button" disabled={leaving} onClick={() => setGardenToLeave(null)} className="rounded-lg border border-gray-200 px-4 py-2 text-[12px] font-semibold text-[#66736a]">Cancelar</button><button type="button" disabled={leaving} onClick={() => void confirmLeave()} className="rounded-lg bg-[#a83f36] px-4 py-2 text-[12px] font-semibold text-white disabled:opacity-60">{leaving ? 'Saindo…' : 'Confirmar saída'}</button></div></section></div>}
  </>;
}
