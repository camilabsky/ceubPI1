import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { API_URL } from '../config';
import { ArrowRight, Bell, CheckCircle2, ClipboardList, Gift, MapPin, Plus, Settings, Sprout, User as UserIcon, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { HortaMap } from './HortaMap';
import type { AdminNavigationIntent, AppPage } from '../types/adminNavigation';

const GardenAnalyticsCharts = lazy(() => import('./GardenAnalyticsCharts'));

interface Task {
  id: number;
  titulo: string;
  tipo: string;
  id_perfil: number | null;
  concluido: boolean;
  status: 'available' | 'in_progress' | 'pending_review' | 'proof_submitted' | 'completed';
  xp: number;
  moedas: number;
  completed_at?: string | null;
}

interface CommunityChallenge {
  goal_tasks: number;
  completed_tasks: number;
  completed_at: string | null;
}

interface Garden {
  id: number;
  participantes: number;
}

type ParticipantActivityStatus = 'active' | 'attention' | 'inactive' | 'untracked';
type ParticipantFilter = 'all' | ParticipantActivityStatus;

interface ParticipantActivity {
  id_usuario: number;
  id_perfil: number;
  nome: string;
  ultima_entrada_at: string | null;
  ultima_contribuicao_at: string | null;
  tarefas_30_dias: number;
  dias_contribuindo_30_dias: number;
  tarefas_totais: number;
  activity_status: ParticipantActivityStatus;
}

interface Activity {
  id: string;
  type: 'task' | 'reward';
  title: string;
  person: string;
  occurredAt: string | null;
  taskId?: number;
}

interface AdminHomePageProps {
  onNavigate: (page: AppPage, intent?: AdminNavigationIntent) => void;
}

export default function AdminHomePage({ onNavigate }: AdminHomePageProps) {
  const { token, activeGarden } = useAuth();
  const [adminTasks, setAdminTasks] = useState<Task[]>([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [communityChallenge, setCommunityChallenge] = useState<CommunityChallenge | null>(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const [participants, setParticipants] = useState<ParticipantActivity[]>([]);
  const [participantsLoaded, setParticipantsLoaded] = useState(false);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [participantsError, setParticipantsError] = useState(false);
  const [participantFilter, setParticipantFilter] = useState<ParticipantFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [adminDataError, setAdminDataError] = useState(false);

  const authHeaders = () => ({ Authorization: `Bearer ${token}` });
  const hortaAdmin = activeGarden?.role === 'ADMIN' ? activeGarden : null;
  const idHorta = hortaAdmin?.id_horta;
  const hortaNome = hortaAdmin?.horta_nome || 'sua horta';

  const fetchAdminData = async () => {
    if (!token || !idHorta) return;
    setIsLoading(true);
    setAdminDataError(false);
    try {
      const [tasksRes, historyRes, gardensRes] = await Promise.all([
        fetch(`${API_URL}/admin/tarefas?id_horta=${idHorta}`, { headers: authHeaders() }),
        fetch(`${API_URL}/admin/horta/historico?id_horta=${idHorta}`, { headers: authHeaders() }),
        fetch(`${API_URL}/hortas`),
      ]);
      if (!tasksRes.ok || !historyRes.ok || !gardensRes.ok) throw new Error('Não foi possível carregar os dados da horta.');

      const [tasks, history, gardens]: [Task[], any, Garden[]] = await Promise.all([
        tasksRes.json(), historyRes.json(), gardensRes.json(),
      ]);
      setAdminTasks(tasks);
      setCommunityChallenge(history.desafio_comunitario || null);
      setParticipantCount(Number(gardens.find((garden) => garden.id === idHorta)?.participantes) || 0);
      const recentActivity: Activity[] = [
        ...(history.tarefas_concluidas_horta || []).map((task: any) => ({
          id: `task-${task.id}`,
          type: 'task' as const,
          taskId: task.id,
          title: task.titulo,
          person: task.perfil_nome || 'Participante',
          occurredAt: task.completed_at || null,
        })),
        ...(history.recompensas_resgatadas_horta || []).map((reward: any, index: number) => ({
          id: `reward-${reward.id}-${index}`,
          type: 'reward' as const,
          title: reward.nome,
          person: reward.perfil_nome || 'Participante',
          occurredAt: reward.redeemed_at || null,
        })),
      ];
      setActivities(recentActivity.sort((a, b) => new Date(b.occurredAt || 0).getTime() - new Date(a.occurredAt || 0).getTime()));
    } catch (error) {
      setAdminDataError(true);
      console.error('Erro ao carregar dados do painel:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao carregar dados do painel.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadParticipants = async () => {
    if (!token || !idHorta) return;
    setParticipantsLoading(true);
    setParticipantsError(false);
    try {
      const response = await fetch(`${API_URL}/admin/horta/participantes?id_horta=${idHorta}`, { headers: authHeaders() });
      const result = await response.json().catch(() => []);
      if (!response.ok) throw new Error(result.error || 'Não foi possível carregar os participantes.');
      setParticipants(result as ParticipantActivity[]);
      setParticipantsLoaded(true);
    } catch (error) {
      setParticipantsError(true);
      toast.error(error instanceof Error ? error.message : 'Erro ao carregar participantes.');
    } finally {
      setParticipantsLoading(false);
    }
  };

  const toggleParticipants = () => {
    const shouldOpen = !showParticipants;
    setShowParticipants(shouldOpen);
    if (shouldOpen && !participantsLoaded) void loadParticipants();
  };

  useEffect(() => { fetchAdminData(); }, [token, idHorta]);
  useEffect(() => {
    if (token && idHorta && !participantsLoaded && !participantsLoading) void loadParticipants();
  }, [token, idHorta]);

  const availableTasks = adminTasks.filter((task) => !task.concluido && task.status === 'available');
  const pendingProofTasks = adminTasks.filter((task) => !task.concluido && task.status === 'pending_review');
  const submittedProofTasks = adminTasks.filter((task) => !task.concluido && task.status === 'proof_submitted');
  const completedTasks = adminTasks.filter((task) => task.concluido);
  const completedThisMonth = useMemo(() => {
    const now = new Date();
    return completedTasks.filter((task) => {
      if (!task.completed_at) return false;
      const date = new Date(task.completed_at);
      return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
    }).length;
  }, [adminTasks]);

  const formatDate = (value: string | null) => value
    ? new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    : 'Data não disponível';

  const filteredParticipants = participantFilter === 'all'
    ? participants
    : participants.filter((participant) => participant.activity_status === participantFilter);
  const monthlyHighlights = [...participants]
    .filter((participant) => participant.tarefas_30_dias > 0)
    .sort((a, b) => b.tarefas_30_dias - a.tarefas_30_dias || b.dias_contribuindo_30_dias - a.dias_contribuindo_30_dias)
    .slice(0, 3);
  const participantStatusCount = (status: ParticipantActivityStatus) => participants.filter((participant) => participant.activity_status === status).length;
  const formatActivityDate = (value: string | null, emptyLabel: string) => value
    ? new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    : emptyLabel;

  const participantStatusLabels: Record<ParticipantActivityStatus, string> = {
    active: 'Ativo',
    attention: 'Atenção',
    inactive: 'Inativo',
    untracked: 'Sem registro',
  };
  const participantStatusClasses: Record<ParticipantActivityStatus, string> = {
    active: 'bg-green-50 text-green-800',
    attention: 'bg-amber-50 text-amber-800',
    inactive: 'bg-gray-100 text-gray-700',
    untracked: 'bg-blue-50 text-blue-800',
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-8">
      <div className="flex items-center justify-end gap-3 px-4 pt-6 lg:px-6">
        <button onClick={() => toast.info('Notificações chegam em breve')} aria-label="Notificações" className="flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white transition-colors hover:border-[#00a63e]">
          <Bell className="size-4 text-[#4a5565]" />
        </button>
        <div className="flex size-9 items-center justify-center rounded-full bg-[#00a63e]"><UserIcon className="size-4 text-white" /></div>
      </div>

      <div className="mt-3 grid min-w-0 gap-5 px-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-stretch lg:px-6">
        <div className="min-w-0 space-y-5">
          <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="mb-1 flex items-center gap-2"><Sprout className="size-4 text-[#00a63e]" /><span className="text-[12px] font-semibold uppercase tracking-wide text-[#008236]">Visão da comunidade</span></div>
              <p className="text-[13px] text-[#4a5565]">Painel administrativo</p>
              <h1 className="text-[23px] font-bold text-neutral-950">{hortaNome}</h1>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-3.5 py-2.5 text-[11px] text-[#4a5565]">
              <MapPin className="size-4 shrink-0 text-[#168a3c]" />
              <span className="max-w-[260px] truncate">{hortaAdmin?.endereco || 'Endereço não cadastrado'}</span>
            </div>
          </header>

          <section className="grid grid-cols-2 gap-3 xl:grid-cols-3" aria-label="Resumo da horta">
            <MetricCard label="Tarefas disponíveis" value={availableTasks.length} icon={<ClipboardList className="size-5 text-[#bd8514]" />} tint="bg-amber-50" onClick={() => onNavigate('tasks', { taskStatusFilter: 'available' })} />
            <MetricCard label="Comprovações pendentes" value={pendingProofTasks.length + submittedProofTasks.length} icon={<ClipboardList className="size-5 text-orange-600" />} tint="bg-orange-50" onClick={() => onNavigate('tasks', { taskStatusFilter: 'proof_pending' })} />
            <MetricCard label="Concluídas este mês" value={completedThisMonth} icon={<CheckCircle2 className="size-5 text-[#168a3c]" />} tint="bg-green-50" onClick={() => onNavigate('tasks', { taskStatusFilter: 'completed' })} />
            <MetricCard label="Participantes" value={participantCount} icon={<Users className="size-5 text-[#7953a9]" />} tint="bg-purple-50" onClick={toggleParticipants} />
          </section>

          {showParticipants && <section className="rounded-[14px] border border-gray-200 bg-white p-4 sm:p-5" aria-label="Atividade dos participantes">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div><h2 className="text-[15px] font-semibold text-neutral-950">Frequência dos participantes</h2><p className="mt-0.5 text-[11px] text-[#717182]">Entradas na plataforma e contribuições aprovadas. Atividade de contribuição nos últimos 30 dias.</p></div>
              <button type="button" onClick={() => setShowParticipants(false)} className="w-fit rounded-lg border border-gray-200 px-3 py-1.5 text-[11px] font-medium text-[#526056] hover:bg-gray-50">Fechar</button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2" aria-label="Filtrar participantes por frequência">
              {([
                ['all', 'Todos', participants.length],
                ['active', 'Ativos · até 14 dias', participantStatusCount('active')],
                ['attention', 'Atenção · 15 a 40 dias', participantStatusCount('attention')],
                ['inactive', 'Inativos · mais de 40 dias', participantStatusCount('inactive')],
                ['untracked', 'Sem registro', participantStatusCount('untracked')],
              ] as [ParticipantFilter, string, number][]).map(([filter, label, count]) => <button key={filter} type="button" onClick={() => setParticipantFilter(filter)} aria-pressed={participantFilter === filter} className={`rounded-full border px-3 py-1.5 text-[10px] font-medium transition-colors ${participantFilter === filter ? 'border-[#a6d6b1] bg-[#eff8f0] text-[#16773a]' : 'border-gray-200 bg-white text-[#66736a] hover:bg-gray-50'}`}>{label} <span className="ml-1 opacity-70">{count}</span></button>)}
            </div>
            {participantsLoading ? <div className="mt-4 space-y-2"><div className="h-12 animate-pulse rounded-lg bg-gray-50" /><div className="h-12 animate-pulse rounded-lg bg-gray-50" /></div>
              : filteredParticipants.length === 0 ? <div className="mt-4 rounded-xl border border-dashed border-gray-200 px-4 py-7 text-center text-[12px] text-[#717182]">{participants.length ? 'Nenhum participante neste filtro.' : 'Ainda não há participantes nesta horta.'}</div>
                : <div className="mt-4 divide-y divide-gray-100">{filteredParticipants.map((participant) => <article key={participant.id_usuario} className="flex flex-col gap-2 py-3 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#eff8f0] text-[13px] font-semibold text-[#16803d]">{participant.nome.trim().charAt(0).toLocaleUpperCase('pt-BR')}</span><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="truncate text-[12px] font-semibold text-neutral-950">{participant.nome}</p><span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${participantStatusClasses[participant.activity_status]}`}>{participantStatusLabels[participant.activity_status]}</span></div><p className="mt-0.5 text-[10px] text-[#717182]">Última entrada: {formatActivityDate(participant.ultima_entrada_at, 'Sem registro desde a ativação do acompanhamento')} · Última contribuição: {formatActivityDate(participant.ultima_contribuicao_at, 'Nenhuma tarefa aprovada')}</p></div></div>
                  <div className="pl-12 text-[10px] text-[#526056] sm:pl-0 sm:text-right"><p><strong>{participant.dias_contribuindo_30_dias}</strong> dias de contribuição · <strong>{participant.tarefas_30_dias}</strong> tarefas aprovadas</p><p className="mt-0.5 text-[#849087]">{participant.tarefas_totais} tarefas aprovadas no total</p></div>
                </article>)}</div>}
            <p className="mt-2 border-t border-gray-100 pt-2 text-[9px] leading-relaxed text-[#849087]">Ativo: entrou nos últimos 14 dias. Atenção: entre 15 e 40 dias. Inativo: há mais de 40 dias sem entrar. Contas antigas sem histórico são mostradas como “Sem registro”.</p>
          </section>}

          <section className="rounded-[14px] border border-gray-200 bg-white p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div><h2 className="text-[15px] font-semibold text-neutral-950">Atividade recente</h2><p className="mt-0.5 text-[11px] text-[#717182]">Acompanhe o que acontece na sua comunidade.</p></div>
              <button onClick={() => onNavigate('tasks')} className="inline-flex shrink-0 items-center gap-1 text-[12px] font-medium text-[#008236] hover:underline">Ver tarefas <ArrowRight className="size-3.5" /></button>
            </div>
            {isLoading ? <div className="space-y-2 py-2"><div className="h-12 animate-pulse rounded-lg bg-gray-50" /><div className="h-12 animate-pulse rounded-lg bg-gray-50" /></div> : activities.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/70 px-4 py-7 text-center">
                <Sprout className="mx-auto size-5 text-[#6a9272]" />
                <p className="mt-2 text-[12px] font-medium text-[#34453a]">Ainda não há atividades registradas</p>
                <p className="mt-1 text-[11px] text-[#77837a]">Quando alguém concluir uma tarefa ou resgatar uma recompensa, a atividade aparecerá aqui.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {activities.slice(0, 5).map((activity) => (
                  <button key={activity.id} type="button" onClick={() => activity.type === 'task'
                    ? onNavigate('tasks', { taskStatusFilter: 'completed', focusTaskId: activity.taskId })
                    : onNavigate('rewards', { focusRewardHistory: true })}
                    className="flex w-full cursor-pointer items-center gap-3 py-3 text-left transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#00a63e] first:pt-1 last:pb-1">
                    <span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${activity.type === 'task' ? 'bg-green-50 text-[#168a3c]' : 'bg-purple-50 text-[#7953a9]'}`}>
                      {activity.type === 'task' ? <CheckCircle2 className="size-4" /> : <Gift className="size-4" />}
                    </span>
                    <div className="min-w-0 flex-1"><p className="truncate text-[12px] font-medium text-neutral-950">{activity.type === 'task' ? 'Tarefa concluída' : 'Recompensa resgatada'} · {activity.title}</p><p className="mt-0.5 text-[10px] text-[#717182]">{activity.person}</p></div>
                    <time className="shrink-0 text-[10px] text-[#717182]">{formatDate(activity.occurredAt)}</time>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[14px] border border-gray-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-3"><div><h2 className="text-[15px] font-semibold text-neutral-950">Localização da horta</h2><p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#717182]"><MapPin className="size-3" />{hortaAdmin?.endereco || 'Endereço não cadastrado'}</p></div><button onClick={() => onNavigate('profile', { editGarden: true })} className="cursor-pointer text-[11px] font-medium text-[#008236] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a63e]">Editar horta</button></div>
            <HortaMap latitude={hortaAdmin?.latitude} longitude={hortaAdmin?.longitude} nome={hortaNome} endereco={hortaAdmin?.endereco} />
          </section>

          <section className="overflow-hidden rounded-[14px] border border-gray-200 bg-white" aria-label="Destaques de contribuição do mês">
            <div className="flex flex-col justify-between gap-3 border-b border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:px-5">
              <div>
                <h2 className="text-[15px] font-semibold text-neutral-950">Destaques da comunidade</h2>
                <p className="mt-0.5 text-[11px] text-[#717182]">Quem mais contribuiu nos últimos 30 dias</p>
              </div>
              <button type="button" onClick={() => { setShowParticipants(true); if (!participantsLoaded) void loadParticipants(); }} className="inline-flex w-fit items-center gap-1 text-[11px] font-medium text-[#008236] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a63e]">
                Ver frequência dos participantes <ArrowRight className="size-3.5" />
              </button>
            </div>
            {participantsLoading ? (
              <div className="grid gap-2 p-4 sm:grid-cols-3"><div className="h-[66px] animate-pulse rounded-xl bg-gray-50" /><div className="h-[66px] animate-pulse rounded-xl bg-gray-50" /><div className="h-[66px] animate-pulse rounded-xl bg-gray-50" /></div>
            ) : monthlyHighlights.length ? (
              <div className="grid gap-2 p-3 sm:grid-cols-3 sm:p-4">
                {monthlyHighlights.map((participant, index) => (
                  <article key={participant.id_usuario} className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-100 bg-[#fbfdfb] px-3 py-2.5">
                    <span className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${index === 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{String(index + 1).padStart(2, '0')}</span>
                    <div className="min-w-0 flex-1"><p className="truncate text-[12px] font-semibold text-neutral-950">{participant.nome}</p><p className="mt-0.5 text-[10px] text-[#717182]">{participant.dias_contribuindo_30_dias} dias contribuindo</p></div>
                    <div className="shrink-0 text-right"><p className="text-[16px] font-bold leading-none text-[#168a3c]">{participant.tarefas_30_dias}</p><p className="mt-1 text-[9px] text-[#717182]">tarefas</p></div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-5 text-center sm:min-h-[92px]">
                <p className="text-[12px] font-medium text-[#34453a]">{participantsError ? 'Não foi possível carregar os destaques' : 'As contribuições aprovadas aparecerão aqui'}</p>
                <p className="mt-1 text-[10px] text-[#77837a]">{participantsError ? 'Tente novamente em instantes.' : 'Ainda não há tarefas aprovadas nos últimos 30 dias.'}</p>
              </div>
            )}
          </section>
        </div>

        <aside className="flex min-h-0 min-w-0 flex-col gap-5">
          <section>
            <h2 className="mb-3 px-1 text-[15px] font-semibold text-neutral-950">Ações rápidas</h2>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => onNavigate('tasks', { openCreateTask: true })} className="flex min-h-[100px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] bg-[#00a63e] p-4 transition-colors hover:bg-[#008236] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008236]"><Plus className="size-6 text-white" /><span className="text-[12px] font-medium text-white">Criar tarefa</span></button>
              <button onClick={() => onNavigate('rewards')} className="flex min-h-[100px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border border-gray-200 bg-white p-4 transition-all hover:border-[#00a63e] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a63e]"><Gift className="size-6 text-[#00a63e]" /><span className="text-[12px] font-medium text-neutral-950">Gerenciar recompensas</span></button>
              <button onClick={() => onNavigate('profile', { editGarden: true })} className="col-span-2 flex cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-gray-200 bg-white p-3 transition-all hover:border-[#00a63e] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a63e]"><Settings className="size-4 text-[#4a5565]" /><span className="text-[12px] font-medium text-neutral-950">Configurações da horta</span></button>
            </div>
          </section>

          <section className="rounded-[14px] border border-gray-200 bg-white p-4">
            <h2 className="text-[15px] font-semibold text-neutral-950">Desafio comunitário do mês</h2>
            {communityChallenge ? <>
              <p className="mt-1 text-[11px] text-[#717182]">Tarefas concluídas pela comunidade</p>
              <div className="mt-3 flex items-center justify-between text-[12px]">
                <span className="font-semibold text-[#34453a]">{communityChallenge.completed_tasks} / {communityChallenge.goal_tasks} tarefas</span>
                <span className="text-[#717182]">{communityChallenge.completed_at ? 'Concluído' : 'Em progresso'}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-[#00a63e]" style={{ width: `${Math.min(100, communityChallenge.goal_tasks ? communityChallenge.completed_tasks / communityChallenge.goal_tasks * 100 : 0)}%` }} /></div>
            </> : <p className="mt-2 text-[11px] text-[#717182]">Ainda não há desafio comunitário registrado para este mês.</p>}
          </section>

          <GardenAnalytics tasks={adminTasks} tasksLoading={isLoading} tasksError={adminDataError} />

        </aside>
      </div>
    </main>
  );
}

function GardenAnalytics({ tasks, tasksLoading, tasksError }: { tasks: Task[]; tasksLoading: boolean; tasksError: boolean }) {
  const [period, setPeriod] = useState<7 | 30 | 90>(7);

  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - (period - 1));
  const dateBuckets = Array.from({ length: period }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + index);
    return {
      label: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      approved: 0,
    };
  });

  const approvedTasks = tasks.filter((task) => {
    if (!(task.concluido || task.status === 'completed') || !task.completed_at) return false;
    const completedAt = new Date(task.completed_at.replace(' ', 'T'));
    return !Number.isNaN(completedAt.getTime()) && completedAt >= startDate && completedAt < new Date(startDate.getTime() + period * 86_400_000);
  });

  approvedTasks.forEach((task) => {
    if (!task.completed_at) return;
    const completedAt = new Date(task.completed_at.replace(' ', 'T'));
    const dayOffset = Math.floor((completedAt.getTime() - startDate.getTime()) / 86_400_000);
    if (dayOffset >= 0 && dayOffset < period) dateBuckets[dayOffset].approved += 1;
  });

  const taskTypes = new Map<string, number>();
  approvedTasks.forEach((task) => {
    const name = task.tipo?.trim() || 'Outros';
    taskTypes.set(name, (taskTypes.get(name) || 0) + 1);
  });
  const tasksByType = [...taskTypes.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name, 'pt-BR'));

  const taskStatusData = [
    { name: 'Concluídas', value: tasks.filter((task) => task.concluido || task.status === 'completed').length, color: '#16a34a' },
    { name: 'Comprovação pendente', value: tasks.filter((task) => !task.concluido && (task.status === 'pending_review' || task.status === 'proof_submitted')).length, color: '#f59e0b' },
    { name: 'Disponíveis', value: tasks.filter((task) => !task.concluido && task.status === 'available').length, color: '#9333ea' },
  ];
  return <Suspense fallback={<div className="min-w-0 rounded-[14px] border border-gray-200 bg-white p-5 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col"><div className="h-5 w-48 animate-pulse rounded bg-gray-100" /><div className="mt-5 grid gap-4 md:grid-cols-2 lg:min-h-0 lg:flex-1 lg:grid-rows-2 lg:auto-rows-fr"><div className="h-[390px] animate-pulse rounded-xl bg-gray-50 lg:h-auto" /><div className="h-[390px] animate-pulse rounded-xl bg-gray-50 lg:h-auto" /><div className="h-[390px] animate-pulse rounded-xl bg-gray-50 lg:h-auto" /></div></div>}>
    <GardenAnalyticsCharts
      period={period}
      onPeriodChange={setPeriod}
      dateBuckets={dateBuckets}
      taskStatusData={taskStatusData}
      tasksByType={tasksByType}
      tasksLoading={tasksLoading}
      tasksError={tasksError}
    />
  </Suspense>;
}

function MetricCard({ label, value, icon, tint, onClick }: { label: string; value: number; icon: ReactNode; tint: string; onClick?: () => void }) {
  const className = `rounded-[14px] border border-gray-200 bg-white p-4 text-left ${onClick ? 'cursor-pointer transition-colors hover:border-[#00a63e] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a63e]' : ''}`;
  const content = <><div className={`mb-3 flex size-9 items-center justify-center rounded-full ${tint}`}>{icon}</div><p className="text-[22px] font-bold leading-none text-neutral-950">{value}</p><p className="mt-1 text-[11px] text-[#4a5565]">{label}</p></>;
  return onClick ? <button type="button" onClick={onClick} className={className}>{content}</button> : <article className={className}>{content}</article>;
}
