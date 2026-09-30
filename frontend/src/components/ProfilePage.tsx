import { useEffect, useState } from 'react';
import { Award, CheckCircle2, Coins, Edit2, Flame, Gift, Leaf, LogOut, MapPin, Sprout, TrendingUp, Users, X } from 'lucide-react';
import { toast } from 'sonner';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';

interface ProfilePageProps {
  coins: number;
  tasksCompleted: number;
  onLogout?: () => void;
  isAdmin?: boolean;
  onNavigate?: (page: 'home' | 'explore' | 'tasks' | 'rewards' | 'profile') => void;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp: number;
  unlocked: boolean;
  unlocked_at: string | null;
}

interface ProfileEvent {
  id: string;
  kind: 'task' | 'reward' | 'achievement';
  title: string;
  description: string;
  xp: number;
  coins: number;
  occurred_at: string | null;
}

interface Garden {
  id: number;
  nome: string;
  papel: 'ADMIN' | 'MEMBER';
  participantes: number;
  tarefas_concluidas: number;
}

interface GamificationData {
  level: number;
  xp: number;
  xp_to_next_level: number;
  total_xp: number;
  tarefas_concluidas: number;
  mudas_plantadas: number;
  sequencia_dias: number;
  achievements: Achievement[];
  events: ProfileEvent[];
  hortas: Garden[];
}

type Tab = 'achievements' | 'gardens' | 'history';

function formatDate(value: string | null) {
  if (!value) return 'Data não registrada';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Data não registrada';
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ProfilePage({ coins, tasksCompleted, onLogout, onNavigate }: ProfilePageProps) {
  const { logout, token, user, updateUser } = useAuth();
  const [tab, setTab] = useState<Tab>('achievements');
  const [data, setData] = useState<GamificationData | null>(null);
  const [saldo, setSaldo] = useState(coins);
  const [isLoading, setIsLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(user?.nome ?? '');
  const [editEmail, setEditEmail] = useState(user?.email ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        const [response, saldoResponse] = await Promise.all([
          fetch(`${API_URL}/me/gamificacao`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/minhas_moedas`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || 'Falha ao carregar seu perfil.');
        if (active) {
          setData(result as GamificationData);
          if (saldoResponse.ok) {
            const saldoData = await saldoResponse.json();
            setSaldo(Number(saldoData.Saldo) || 0);
          }
        }
      } catch (error) {
        if (active) toast.error(error instanceof Error ? error.message : 'Erro ao carregar perfil.');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    loadProfile();
    return () => { active = false; };
  }, [token]);

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editName.trim() || !editEmail.trim()) return toast.error('Informe seu nome e e-mail.');
    setSaving(true);
    try {
      await updateUser({ nome: editName.trim(), email: editEmail.trim() });
      toast.success('Perfil atualizado.');
      setEditOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível atualizar o perfil.');
    } finally {
      setSaving(false);
    }
  };

  const level = data?.level ?? 1;
  const xp = data?.xp ?? 0;
  const xpTarget = data?.xp_to_next_level ?? 500;
  const progress = Math.min(100, (xp / xpTarget) * 100);
  const completed = data?.tarefas_concluidas ?? tasksCompleted;
  const streak = data?.sequencia_dias ?? 0;
  const achievements = data?.achievements ?? [];
  const events = data?.events ?? [];
  const gardens = data?.hortas ?? [];
  const tabItems: { id: Tab; label: string; icon: typeof Award }[] = [
    { id: 'achievements', label: 'Conquistas', icon: Award },
    { id: 'gardens', label: 'Minhas hortas', icon: Leaf },
    { id: 'history', label: 'Histórico', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-8 pt-10 lg:px-6">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-[20px] bg-gradient-to-br from-[#00a63e] to-[#008236] p-5 text-white shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/20 text-[28px] shadow-inner">👩‍🌾</div>
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-white/80">Perfil da comunidade</p>
                <h1 className="mt-0.5 truncate text-[22px] font-bold">{user?.nome || 'Usuário'}</h1>
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold"><Sprout className="size-3.5" /> Nível {level}</span>
              </div>
            </div>
          <div className="flex items-center gap-2 self-start">
              <div className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-[13px] font-semibold"><Coins className="size-4" /><span>{saldo}</span><span className="font-medium text-white/80">moedas</span></div>
              <button onClick={() => { setEditName(user?.nome ?? ''); setEditEmail(user?.email ?? ''); setEditOpen(true); }} className="inline-flex items-center gap-2 rounded-lg border border-white/35 bg-white/10 px-3 py-2 text-[12px] font-semibold transition hover:bg-white/20"><Edit2 className="size-3.5" />Editar perfil</button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 border-t border-white/20 pt-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div>
              <div className="mb-2 flex items-center justify-between gap-4 text-[12px]"><span className="font-semibold">Progresso para o nível {level + 1}</span><span className="whitespace-nowrap font-medium text-white/90">{xp} / {xpTarget} XP</span></div>
              <div className="h-2.5 overflow-hidden rounded-full bg-black/15"><div className="h-full rounded-full bg-[#c9f27a] transition-all" style={{ width: `${progress}%` }} /></div>
              <p className="mt-1.5 text-[10px] text-white/75">Tarefas geram XP e moedas · XP aumenta seu nível · moedas são usadas em Recompensas</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2.5 text-[12px] font-semibold"><Flame className="size-4 text-[#ffe7a3]" /><span>{streak} {streak === 1 ? 'dia' : 'dias'} de sequência</span></div>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-[14px] border border-gray-200 bg-white p-4"><div className="flex size-9 items-center justify-center rounded-full bg-green-50"><CheckCircle2 className="size-[18px] text-[#00a63e]" /></div><div><p className="text-[20px] font-bold leading-5 text-neutral-950">{completed}</p><p className="mt-1 text-[11px] text-[#66736a]">Tarefas concluídas</p></div></div>
          <div className="flex items-center gap-3 rounded-[14px] border border-gray-200 bg-white p-4"><div className="flex size-9 items-center justify-center rounded-full bg-lime-50"><Sprout className="size-[18px] text-[#5a8b34]" /></div><div><p className="text-[20px] font-bold leading-5 text-neutral-950">{data?.mudas_plantadas ?? 0}</p><p className="mt-1 text-[11px] text-[#66736a]">Mudas plantadas</p></div></div>
        </section>

        <section className="mt-5 overflow-hidden rounded-[14px] border border-gray-200 bg-white">
          <div className="flex gap-1 overflow-x-auto border-b border-gray-100 px-3 pt-2 sm:px-5" role="tablist" aria-label="Seções do perfil">
            {tabItems.map(({ id, label, icon: Icon }) => <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-[12px] font-semibold transition ${tab === id ? 'border-[#00a63e] text-[#008236]' : 'border-transparent text-[#718075] hover:text-[#34453a]'}`}><Icon className="size-4" />{label}</button>)}
          </div>

          <div className="p-4 sm:p-5">
            {isLoading && <p className="py-10 text-center text-[13px] text-[#718075]">Carregando seus dados...</p>}

            {!isLoading && tab === 'achievements' && <>
              <div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="text-[15px] font-bold text-neutral-950">Conquistas</h2><p className="mt-0.5 text-[12px] text-[#718075]">Desbloqueadas por ações reais na comunidade.</p></div><span className="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-[#16803d]">{achievements.filter((item) => item.unlocked).length} de {achievements.length}</span></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {achievements.map((achievement) => <article key={achievement.id} className={`flex items-center gap-3 rounded-xl border p-3.5 transition ${achievement.unlocked ? 'border-[#dceadd] bg-[#fbfefb]' : 'border-gray-200 bg-[#fafbfa]'}`}>
                  <div className={`flex size-11 shrink-0 items-center justify-center rounded-full text-[21px] ${achievement.unlocked ? 'bg-green-50' : 'bg-gray-100 grayscale'}`}>{achievement.unlocked ? achievement.icon : '🔒'}</div>
                  <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className={`truncate text-[13px] font-semibold ${achievement.unlocked ? 'text-neutral-950' : 'text-[#69756c]'}`}>{achievement.name}</h3>{achievement.unlocked && <Award className="size-3.5 shrink-0 text-[#00a63e]" />}</div><p className="mt-0.5 text-[11px] leading-4 text-[#718075]">{achievement.unlocked ? achievement.description : `Requisito: ${achievement.description.toLocaleLowerCase('pt-BR')}.`}</p></div>
                  <span className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold ${achievement.unlocked ? 'bg-[#eaf7ed] text-[#16803d]' : 'bg-gray-100 text-[#8a958d]'}`}>+{achievement.xp} XP</span>
                </article>)}
              </div>
              <p className="mt-4 flex items-center gap-2 text-[11px] text-[#718075]"><TrendingUp className="size-3.5 text-[#00a63e]" />Cada missão define seu próprio XP. Resgatar recompensas usa moedas e não altera seu XP.</p>
            </>}

            {!isLoading && tab === 'gardens' && <>
              <div className="mb-4"><h2 className="text-[15px] font-bold text-neutral-950">Minhas hortas</h2><p className="mt-0.5 text-[12px] text-[#718075]">Sua participação e contribuição em cada comunidade.</p></div>
              {gardens.length === 0 ? <div className="rounded-xl border border-dashed border-gray-200 px-5 py-10 text-center"><Leaf className="mx-auto size-6 text-[#7caa86]" /><p className="mt-2 text-[13px] font-semibold text-[#34453a]">Você ainda não participa de uma horta</p><p className="mt-1 text-[12px] text-[#718075]">Explore as comunidades para encontrar a sua.</p><button onClick={() => onNavigate?.('explore')} className="mt-3 rounded-lg bg-[#00a63e] px-3.5 py-2 text-[12px] font-semibold text-white hover:bg-[#008236]">Explorar hortas</button></div> : <div className="grid gap-3 sm:grid-cols-2">{gardens.map((garden) => <article key={`${garden.id}-${garden.papel}`} className="rounded-xl border border-gray-200 p-4"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-green-50"><Sprout className="size-5 text-[#00a63e]" /></div><div className="min-w-0"><h3 className="truncate text-[14px] font-semibold text-neutral-950">{garden.nome}</h3><p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#718075]"><MapPin className="size-3" />Horta comunitária</p></div></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${garden.papel === 'ADMIN' ? 'bg-amber-50 text-[#91630c]' : 'bg-green-50 text-[#16803d]'}`}>{garden.papel === 'ADMIN' ? 'Administrador' : 'Participante'}</span></div><div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-3 text-[11px] text-[#66736a]"><span className="inline-flex items-center gap-1.5"><Users className="size-3.5" />{Number(garden.participantes)} participantes</span><span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5" />{Number(garden.tarefas_concluidas)} tarefas suas</span></div><button onClick={() => onNavigate?.('explore')} className="mt-3 text-[12px] font-semibold text-[#16803d] hover:underline">Ver horta <span aria-hidden="true">→</span></button></article>)}</div>}
            </>}

            {!isLoading && tab === 'history' && <>
              <div className="mb-4"><h2 className="text-[15px] font-bold text-neutral-950">Histórico</h2><p className="mt-0.5 text-[12px] text-[#718075]">Veja como suas atividades movimentam XP e moedas.</p></div>
              {events.length === 0 ? <div className="rounded-xl border border-dashed border-gray-200 px-5 py-10 text-center"><TrendingUp className="mx-auto size-6 text-[#7caa86]" /><p className="mt-2 text-[13px] font-semibold text-[#34453a]">Suas atividades aparecerão aqui</p><p className="mt-1 text-[12px] text-[#718075]">Conclua tarefas ou resgate uma recompensa.</p></div> : <div className="divide-y divide-gray-100">{events.map((event) => <article key={event.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"><div className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full ${event.kind === 'task' ? 'bg-green-50 text-[#16803d]' : event.kind === 'reward' ? 'bg-amber-50 text-[#ad7817]' : 'bg-violet-50 text-violet-700'}`}>{event.kind === 'task' ? <CheckCircle2 className="size-4" /> : event.kind === 'reward' ? <Gift className="size-4" /> : <Award className="size-4" />}</div><div className="min-w-0 flex-1"><p className="text-[12px] font-semibold text-neutral-950">{event.title} <span className="font-normal text-[#4e5b52]">— {event.description}</span></p><p className="mt-1 text-[10px] text-[#8a958d]">{formatDate(event.occurred_at)}</p></div><div className="flex shrink-0 flex-col items-end gap-1 text-[10px] font-semibold">{event.xp > 0 && <span className="text-[#16803d]">+{event.xp} XP</span>}{event.coins !== 0 && <span className={event.coins > 0 ? 'text-[#ad7817]' : 'text-[#9b5a36]'}>{event.coins > 0 ? '+' : '−'}{Math.abs(event.coins)} moedas</span>}</div></article>)}</div>}
            </>}
          </div>
        </section>

        <div className="mt-4 flex items-center justify-between rounded-[14px] border border-gray-200 bg-white px-4 py-3"><div><p className="text-[12px] font-semibold text-[#34453a]">Impacto na comunidade</p><p className="text-[11px] text-[#718075]">Tarefas concluídas ajudam sua horta a crescer.</p></div><button onClick={() => { logout(); onLogout?.(); }} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium text-[#66736a] hover:bg-gray-50"><LogOut className="size-4" />Sair</button></div>
      </div>

      {editOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 p-4" onClick={() => setEditOpen(false)}><form onSubmit={saveProfile} onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-[17px] font-bold text-neutral-950">Editar perfil</h2><p className="mt-1 text-[12px] text-[#718075]">Atualize seus dados da comunidade.</p></div><button type="button" onClick={() => setEditOpen(false)} aria-label="Fechar" className="flex size-8 items-center justify-center rounded-full text-[#718075] hover:bg-gray-100"><X className="size-4" /></button></div><label className="mb-3 block text-[12px] font-medium text-[#4a5565]">Nome<input value={editName} onChange={(event) => setEditName(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 px-3 text-[13px] outline-none focus:border-[#00a63e]" /></label><label className="block text-[12px] font-medium text-[#4a5565]">E-mail<input type="email" value={editEmail} onChange={(event) => setEditEmail(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 px-3 text-[13px] outline-none focus:border-[#00a63e]" /></label><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setEditOpen(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-[12px] font-semibold text-[#66736a]">Cancelar</button><button type="submit" disabled={saving} className="rounded-lg bg-[#00a63e] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#008236] disabled:opacity-60">{saving ? 'Salvando...' : 'Salvar alterações'}</button></div></form></div>}
    </div>
  );
}
