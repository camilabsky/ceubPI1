import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Award, CheckCircle2, Coins, Flame, LoaderCircle, Sprout, Users } from 'lucide-react';
import { toast } from 'sonner';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import type { AppPage } from '../types/adminNavigation';

const GardenAnalyticsCharts = lazy(() => import('./GardenAnalyticsCharts'));

interface Props {
  onNavigate: (page: AppPage) => void;
}

interface DashboardTask {
  id: number;
  titulo: string;
  tipo: string;
  id_perfil: number | null;
  concluido: boolean;
  status: 'available' | 'in_progress' | 'pending_review' | 'proof_submitted' | 'completed';
  completed_at?: string | null;
}

interface Participant {
  id_usuario: number;
  nome: string;
  tarefas_30_dias: number;
  dias_contribuindo_30_dias: number;
}

interface Gamification {
  level: number;
  level_name: string;
  xp: number;
  xp_to_next_level: number;
  is_max_level: boolean;
  moedas: number;
  tarefas_concluidas: number;
  sequencia_dias: number;
  mudas_este_mes: number;
  achievements: Array<{ id: string; name: string; description: string; icon: string; unlocked: boolean }>;
  leaderboard: Array<{ position: number; id_perfil: number; nome: string; xp: number; tarefas_concluidas: number; is_you: boolean }>;
  impact: { gardens_count: number };
}

const card = 'rounded-xl border border-[#e4e9e4] bg-white p-4';

export default function DashboardPage({ onNavigate }: Props) {
  const { token, isAdmin, activeGarden, activeGardenId } = useAuth();
  const [memberStats, setMemberStats] = useState<Gamification | null>(null);
  const [adminTasks, setAdminTasks] = useState<DashboardTask[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState<7 | 30 | 90>(7);

  useEffect(() => {
    if (!token) return;
    if (!activeGardenId) {
      setLoading(false);
      setError('Selecione uma horta para consultar o Dashboard.');
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError('');
    const headers = { Authorization: `Bearer ${token}` };

    const load = async () => {
      try {
        if (isAdmin) {
          const [tasksResponse, membersResponse] = await Promise.all([
            fetch(`${API_URL}/admin/tarefas?id_horta=${activeGardenId}`, { headers, signal: controller.signal }),
            fetch(`${API_URL}/admin/horta/participantes?id_horta=${activeGardenId}`, { headers, signal: controller.signal }),
          ]);
          const [tasksResult, membersResult] = await Promise.all([tasksResponse.json(), membersResponse.json()]);
          if (!tasksResponse.ok) throw new Error(tasksResult.error || 'Não foi possível carregar os indicadores da horta.');
          if (!membersResponse.ok) throw new Error(membersResult.error || 'Não foi possível carregar os participantes.');
          if (!controller.signal.aborted) { setAdminTasks(tasksResult); setParticipants(membersResult); }
        } else {
          const response = await fetch(`${API_URL}/me/gamificacao?id_horta=${activeGardenId}`, { headers, signal: controller.signal });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || 'Não foi possível carregar seus indicadores.');
          if (!controller.signal.aborted) setMemberStats(result);
        }
      } catch (loadError) {
        if (controller.signal.aborted) return;
        const message = loadError instanceof Error ? loadError.message : 'Não foi possível carregar o Dashboard.';
        setError(message);
        toast.error(message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    void load();
    return () => controller.abort();
  }, [token, activeGardenId, isAdmin]);

  const adminMetrics = useMemo(() => {
    const now = new Date();
    const completedTasks = adminTasks.filter((task) => task.concluido || task.status === 'completed');
    return {
      completed: completedTasks.length,
      completedThisMonth: completedTasks.filter((task) => {
        if (!task.completed_at) return false;
        const completedAt = new Date(task.completed_at.replace(' ', 'T'));
        return !Number.isNaN(completedAt.getTime()) && completedAt.getMonth() === now.getMonth() && completedAt.getFullYear() === now.getFullYear();
      }).length,
      available: adminTasks.filter((task) => !task.concluido && task.status === 'available').length,
      pending: adminTasks.filter((task) => !task.concluido && (task.status === 'pending_review' || task.status === 'proof_submitted')).length,
      inProgress: adminTasks.filter((task) => !task.concluido && task.status === 'in_progress').length,
    };
  }, [adminTasks]);

  const charts = useMemo(() => {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - (period - 1));
    const dateBuckets = Array.from({ length: period }, (_, index) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + index);
      return { label: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), approved: 0 };
    });
    const approved = adminTasks.filter((task) => {
      if (!(task.concluido || task.status === 'completed') || !task.completed_at) return false;
      const completedAt = new Date(task.completed_at.replace(' ', 'T'));
      return !Number.isNaN(completedAt.getTime()) && completedAt >= startDate && completedAt < new Date(startDate.getTime() + period * 86_400_000);
    });
    approved.forEach((task) => {
      if (!task.completed_at) return;
      const date = new Date(task.completed_at.replace(' ', 'T'));
      const offset = Math.floor((date.getTime() - startDate.getTime()) / 86_400_000);
      if (offset >= 0 && offset < period) dateBuckets[offset].approved += 1;
    });
    const types = new Map<string, number>();
    approved.forEach((task) => { const name = task.tipo?.trim() || 'Outros'; types.set(name, (types.get(name) || 0) + 1); });
    return {
      dateBuckets,
      tasksByType: [...types.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value || a.name.localeCompare(b.name, 'pt-BR')),
      taskStatusData: [
        { name: 'Concluídas', value: adminMetrics.completed, color: '#16a34a' },
        { name: 'Comprovação pendente', value: adminMetrics.pending, color: '#f59e0b' },
        { name: 'Em andamento', value: adminMetrics.inProgress, color: '#2563eb' },
        { name: 'Disponíveis', value: adminMetrics.available, color: '#9333ea' },
      ],
    };
  }, [adminTasks, period, adminMetrics]);

  const member = memberStats;
  const xpProgress = Math.min(100, (member?.xp ?? 0) / Math.max(1, member?.xp_to_next_level ?? 500) * 100);
  const monthlyHighlights = [...participants].filter((participant) => participant.tarefas_30_dias > 0)
    .sort((a, b) => b.tarefas_30_dias - a.tarefas_30_dias || b.dias_contribuindo_30_dias - a.dias_contribuindo_30_dias).slice(0, 3);

  return <main className="min-h-screen bg-[#f7f9f7] px-4 pb-10 pt-7 text-[#17201a] sm:px-6 lg:px-8">
    <div className="mx-auto max-w-6xl space-y-5">
      <header><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#16803d]">Couve / Visão geral</p><h1 className="mt-1 text-[26px] font-bold tracking-tight text-[#1c2b20]">Dashboard</h1><p className="mt-1 text-[13px] text-[#6c786f]">{isAdmin ? `Indicadores de ${activeGarden?.horta_nome || 'sua horta'}.` : `Sua evolução · ${activeGarden?.horta_nome || 'comunidade'}.`}</p></header>

      {loading ? <div role="status" className="flex min-h-40 items-center justify-center gap-2 rounded-xl border border-[#e4e9e4] bg-white text-[13px] text-[#738076]"><LoaderCircle className="size-4 animate-spin" />Carregando indicadores...</div>
        : error ? <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-[13px] text-amber-900">{error}</div>
        : isAdmin ? <>
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Indicadores da horta">
            <Metric label="Tarefas disponíveis" value={adminMetrics.available} icon={<Sprout />} tint="bg-amber-50 text-[#bd8514]" />
            <Metric label="Comprovações pendentes" value={adminMetrics.pending} icon={<CheckCircle2 />} tint="bg-orange-50 text-orange-600" />
            <Metric label="Tarefas concluídas" value={adminMetrics.completed} icon={<CheckCircle2 />} tint="bg-green-50 text-[#168a3c]" />
            <Metric label="Participantes" value={participants.length} icon={<Users />} tint="bg-purple-50 text-[#7953a9]" />
          </section>

          <section className="grid gap-3 sm:grid-cols-3" aria-label="Estado das tarefas">
            <Metric label="Concluídas este mês" value={adminMetrics.completedThisMonth} icon={<CheckCircle2 />} tint="bg-green-50 text-[#168a3c]" />
            <Metric label="Em andamento" value={adminMetrics.inProgress} icon={<LoaderCircle />} tint="bg-blue-50 text-blue-600" />
            <Metric label="Membros ativos com contribuição recente" value={participants.filter((participant) => participant.tarefas_30_dias > 0).length} icon={<Users />} tint="bg-purple-50 text-[#7953a9]" />
          </section>

          <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-white" />}><GardenAnalyticsCharts period={period} onPeriodChange={setPeriod} dateBuckets={charts.dateBuckets} taskStatusData={charts.taskStatusData} tasksByType={charts.tasksByType} tasksLoading={false} tasksError={false} /></Suspense>

          <section className={card}><div className="mb-3"><h2 className="text-[15px] font-semibold text-neutral-950">Frequência dos participantes</h2><p className="mt-0.5 text-[11px] text-[#717182]">Entradas e contribuições registradas na horta.</p></div>{participants.length ? <div className="divide-y divide-gray-100">{participants.map((participant) => <article key={participant.id_usuario} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"><div className="min-w-0"><p className="truncate text-[12px] font-semibold text-neutral-950">{participant.nome}</p><p className="text-[10px] text-[#717182]">{participant.dias_contribuindo_30_dias} dias contribuindo nos últimos 30 dias</p></div><div className="shrink-0 text-right"><p className="text-[15px] font-bold text-[#168a3c]">{participant.tarefas_30_dias}</p><p className="text-[9px] text-[#717182]">tarefas aprovadas</p></div></article>)}</div> : <p className="py-5 text-center text-[12px] text-[#77837a]">Ainda não há participantes registrados.</p>}</section>

          {monthlyHighlights.length > 0 && <section className={card}><h2 className="mb-3 text-[15px] font-semibold text-neutral-950">Destaques da comunidade</h2><div className="grid gap-2 sm:grid-cols-3">{monthlyHighlights.map((participant, index) => <article key={participant.id_usuario} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-[#fbfdfb] px-3 py-2.5"><span className="flex size-9 items-center justify-center rounded-full bg-green-50 text-[12px] font-bold text-[#168a3c]">{String(index + 1).padStart(2, '0')}</span><div className="min-w-0 flex-1"><p className="truncate text-[12px] font-semibold text-neutral-950">{participant.nome}</p><p className="text-[10px] text-[#717182]">{participant.dias_contribuindo_30_dias} dias contribuindo</p></div><span className="text-[15px] font-bold text-[#168a3c]">{participant.tarefas_30_dias}</span></article>)}</div></section>}
        </> : member ? <>
          <section className="rounded-[20px] bg-gradient-to-r from-[#087a3c] via-[#078c42] to-[#0a7540] p-5 text-white shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[12px] font-semibold text-white/85">Nível {member.level} · {member.level_name}</p><h2 className="mt-2 text-[20px] font-bold">{member.is_max_level ? 'Nível máximo alcançado' : 'Progresso para o próximo nível'}</h2><p className="mt-1 text-[12px] text-white/85">{member.xp} / {member.xp_to_next_level} XP</p><div className="mt-3 h-2.5 w-full max-w-xl overflow-hidden rounded-full bg-black/20"><div className="h-full rounded-full bg-[#c9f27a]" style={{ width: `${xpProgress}%` }} /></div></div><button onClick={() => onNavigate('rewards')} className="rounded-full bg-white/15 px-4 py-2 text-[12px] font-semibold hover:bg-white/20">{member.moedas} moedas · Ver recompensas</button></div>
          </section>
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" aria-label="Seus indicadores"><Metric label="Tarefas concluídas" value={member.tarefas_concluidas} icon={<CheckCircle2 />} tint="bg-green-50 text-[#168a3c]" /><Metric label="Moedas disponíveis" value={member.moedas} icon={<Coins />} tint="bg-amber-50 text-[#bd8514]" /><Metric label="Sequência atual" value={`${member.sequencia_dias} dias`} icon={<Flame />} tint="bg-orange-50 text-orange-600" /><Metric label="Mudas este mês" value={member.mudas_este_mes} icon={<Sprout />} tint="bg-lime-50 text-[#5a8b34]" /><Metric label="Hortas" value={member.impact.gardens_count} icon={<Users />} tint="bg-purple-50 text-[#7953a9]" /></section>
          <div className="grid gap-4 lg:grid-cols-2"><section className={card}><div className="mb-3 flex items-center gap-2"><Award className="size-4 text-[#7953a9]" /><div><h2 className="text-[14px] font-bold text-[#202b22]">Suas conquistas</h2><p className="text-[10px] text-[#77837a]">Conquistas registradas na sua conta.</p></div></div><div className="grid gap-2 sm:grid-cols-2">{member.achievements.filter((achievement) => achievement.unlocked).map((achievement) => <article key={achievement.id} className="flex items-center gap-2 rounded-lg border border-[#e2eee3] bg-[#f8fcf8] px-2.5 py-2"><span className="text-[16px]">{achievement.icon}</span><div className="min-w-0"><p className="truncate text-[11px] font-semibold text-[#34453a]">{achievement.name}</p><p className="text-[9px] text-[#849087]">{achievement.description}</p></div></article>)}</div>{!member.achievements.some((achievement) => achievement.unlocked) && <p className="rounded-lg bg-[#f8faf8] px-3 py-4 text-center text-[11px] text-[#77837a]">Suas conquistas aparecerão aqui conforme você participa.</p>}</section>
            <section className={card}><div className="mb-3 flex items-center gap-2"><Users className="size-4 text-[#398650]" /><div><h2 className="text-[14px] font-bold text-[#202b22]">Destaques da comunidade</h2><p className="text-[10px] text-[#77837a]">Participantes das hortas em comum, ordenados pelo XP acumulado.</p></div></div>{member.leaderboard.length ? <ol className="space-y-2">{member.leaderboard.map((person) => <li key={person.id_perfil} className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-[11px] ${person.is_you ? 'bg-[#f0f8ed] font-semibold text-[#16803d]' : 'bg-[#f8faf8] text-[#526056]'}`}><span className="min-w-0 truncate">{person.position}. {person.nome}{person.is_you ? ' · você' : ''}</span><span className="ml-2 shrink-0">{person.xp} XP · {person.tarefas_concluidas} tarefas</span></li>)}</ol> : <p className="py-4 text-center text-[11px] text-[#77837a]">Ainda não há dados de classificação disponíveis para esta horta.</p>}</section></div>
        </> : <section className={card}><p className="text-[13px] text-[#66736a]">Não há dados de dashboard para esta função.</p></section>}
    </div>
  </main>;
}

function Metric({ label, value, icon, tint }: { label: string; value: number | string; icon: ReactNode; tint: string }) {
  return <article className={`${card} min-w-0`}><div className={`mb-3 flex size-9 items-center justify-center rounded-full ${tint}`}>{icon}</div><p className="break-words text-[22px] font-bold leading-tight text-neutral-950">{value}</p><p className="mt-1 text-[11px] leading-4 text-[#4a5565]">{label}</p></article>;
}
