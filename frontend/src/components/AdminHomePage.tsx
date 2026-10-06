import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { API_URL } from '../config';
import { ArrowRight, Bell, CheckCircle2, ClipboardList, Clock3, Gift, MapPin, Plus, Settings, Sprout, User as UserIcon, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { HortaMap } from './HortaMap';
import type { AdminNavigationIntent, AppPage } from '../types/adminNavigation';

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
  const { token, user } = useAuth();
  const [adminTasks, setAdminTasks] = useState<Task[]>([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [communityChallenge, setCommunityChallenge] = useState<CommunityChallenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const authHeaders = () => ({ Authorization: `Bearer ${token}` });
  const hortaAdmin = user?.roles.find((role) => role.role === 'ADMIN');
  const idHorta = hortaAdmin?.id_horta;
  const hortaNome = hortaAdmin?.horta_nome || 'sua horta';

  const fetchAdminData = async () => {
    if (!token || !idHorta) return;
    setIsLoading(true);
    try {
      const [tasksRes, historyRes, gardensRes] = await Promise.all([
        fetch(`${API_URL}/admin/tarefas`, { headers: authHeaders() }),
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
      console.error('Erro ao carregar dados do painel:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao carregar dados do painel.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAdminData(); }, [token, idHorta]);

  const availableTasks = adminTasks.filter((task) => !task.concluido && task.status === 'available');
  const inProgressTasks = adminTasks.filter((task) => !task.concluido && task.status === 'in_progress');
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

  const statusTasks = adminTasks.filter((task) => !task.concluido).slice(0, 5);

  const taskStatusLabel: Record<Task['status'], string> = {
    available: 'Disponível',
    in_progress: 'Em andamento',
    pending_review: 'Aguardando comprovação',
    proof_submitted: 'Comprovação enviada',
    completed: 'Concluída',
  };
  const taskStatusClass: Record<Task['status'], string> = {
    available: 'bg-amber-50 text-amber-700',
    in_progress: 'bg-blue-50 text-blue-700',
    pending_review: 'bg-orange-50 text-orange-800',
    proof_submitted: 'bg-purple-50 text-purple-700',
    completed: 'bg-green-50 text-green-700',
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-8">
      <div className="flex items-center justify-end gap-3 px-4 pt-6 lg:px-6">
        <button onClick={() => toast.info('Notificações chegam em breve')} aria-label="Notificações" className="flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white transition-colors hover:border-[#00a63e]">
          <Bell className="size-4 text-[#4a5565]" />
        </button>
        <div className="flex size-9 items-center justify-center rounded-full bg-[#00a63e]"><UserIcon className="size-4 text-white" /></div>
      </div>

      <div className="mt-3 grid gap-5 px-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)] lg:px-6">
        <div className="space-y-5">
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
            <MetricCard label="Em andamento" value={inProgressTasks.length} icon={<Clock3 className="size-5 text-[#4285d4]" />} tint="bg-blue-50" onClick={() => onNavigate('tasks', { taskStatusFilter: 'in_progress' })} />
            <MetricCard label="Aguardando comprovação" value={pendingProofTasks.length} icon={<Clock3 className="size-5 text-orange-600" />} tint="bg-orange-50" onClick={() => onNavigate('tasks', { taskStatusFilter: 'pending_review' })} />
            <MetricCard label="Comprovação enviada" value={submittedProofTasks.length} icon={<ClipboardList className="size-5 text-purple-600" />} tint="bg-purple-50" onClick={() => onNavigate('tasks', { taskStatusFilter: 'proof_submitted' })} />
            <MetricCard label="Concluídas este mês" value={completedThisMonth} icon={<CheckCircle2 className="size-5 text-[#168a3c]" />} tint="bg-green-50" onClick={() => onNavigate('tasks', { taskStatusFilter: 'completed' })} />
            <MetricCard label="Participantes" value={participantCount} icon={<Users className="size-5 text-[#7953a9]" />} tint="bg-purple-50" />
          </section>

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
        </div>

        <aside className="space-y-5">
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

          <section>
            <div className="mb-3 flex items-center justify-between gap-2 px-1"><div><h2 className="text-[15px] font-semibold text-neutral-950">Tarefas por situação</h2><p className="mt-0.5 text-[11px] text-[#717182]">Veja onde a comunidade precisa de atenção.</p></div><button onClick={() => onNavigate('tasks')} aria-label="Ver todas as tarefas" className="text-[#008236]"><ArrowRight className="size-4" /></button></div>
            <div className="mb-3 grid grid-cols-2 gap-2 rounded-[14px] border border-gray-200 bg-white p-3 text-center">
              <StatusTile label="Disponíveis" value={availableTasks.length} color="text-[#bd8514]" onClick={() => onNavigate('tasks', { taskStatusFilter: 'available' })} />
              <StatusTile label="Em andamento" value={inProgressTasks.length} color="text-[#4285d4]" onClick={() => onNavigate('tasks', { taskStatusFilter: 'in_progress' })} />
              <StatusTile label="Aguardando comprovação" value={pendingProofTasks.length} color="text-orange-600" onClick={() => onNavigate('tasks', { taskStatusFilter: 'pending_review' })} />
              <StatusTile label="Comprovação enviada" value={submittedProofTasks.length} color="text-purple-600" onClick={() => onNavigate('tasks', { taskStatusFilter: 'proof_submitted' })} />
              <StatusTile label="Concluídas" value={completedTasks.length} color="text-[#168a3c]" onClick={() => onNavigate('tasks', { taskStatusFilter: 'completed' })} className="col-span-2 border-t border-gray-100 pt-2" />
            </div>
            {statusTasks.length === 0 ? <div className="rounded-[14px] border border-gray-200 bg-white p-4 text-center"><p className="text-[12px] text-[#717182]">Nenhuma tarefa aberta ou em andamento.</p></div> : (
              <div className="divide-y divide-gray-100 overflow-hidden rounded-[14px] border border-gray-200 bg-white">
                {statusTasks.map((task) => {
                  return <div key={task.id} className="flex items-center justify-between gap-3 px-4 py-3"><div className="min-w-0"><p className="truncate text-[12px] font-medium text-neutral-950">{task.titulo}</p><p className="mt-0.5 text-[10px] text-[#717182]">{task.tipo} · {task.xp} XP · {task.moedas} moedas</p></div><span className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-medium ${taskStatusClass[task.status] || taskStatusClass.available}`}>{taskStatusLabel[task.status] || taskStatusLabel.available}</span></div>;
                })}
              </div>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}

function MetricCard({ label, value, icon, tint, onClick }: { label: string; value: number; icon: ReactNode; tint: string; onClick?: () => void }) {
  const className = `rounded-[14px] border border-gray-200 bg-white p-4 text-left ${onClick ? 'cursor-pointer transition-colors hover:border-[#00a63e] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a63e]' : ''}`;
  const content = <><div className={`mb-3 flex size-9 items-center justify-center rounded-full ${tint}`}>{icon}</div><p className="text-[22px] font-bold leading-none text-neutral-950">{value}</p><p className="mt-1 text-[11px] text-[#4a5565]">{label}</p></>;
  return onClick ? <button type="button" onClick={onClick} className={className}>{content}</button> : <article className={className}>{content}</article>;
}

function StatusTile({ label, value, color, onClick, className = '' }: { label: string; value: number; color: string; onClick: () => void; className?: string }) {
  return <button type="button" onClick={onClick} className={`cursor-pointer rounded-lg px-1 py-2 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a63e] ${className}`}><p className={`text-[16px] font-bold ${color}`}>{value}</p><p className="text-[9px] text-[#717182]">{label}</p></button>;
}
