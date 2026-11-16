import { useEffect, useState } from 'react';
import { API_URL } from '../config';
import { ArrowRight, Bell, CheckCircle2, Gift, MapPin, Plus, Settings, Sprout } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { HortaMap } from './HortaMap';
import HomeGardensSection from './HomeGardensSection';
import GardenRoleMenu from './GardenRoleMenu';
import type { AdminNavigationIntent, AppPage } from '../types/adminNavigation';

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
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const authHeaders = () => ({ Authorization: `Bearer ${token}` });
  const hortaAdmin = activeGarden?.role === 'ADMIN' ? activeGarden : null;
  const idHorta = hortaAdmin?.id_horta;
  const hortaNome = hortaAdmin?.horta_nome || 'sua horta';

  const fetchAdminData = async () => {
    if (!token || !idHorta) return;
    setIsLoading(true);
    try {
      const historyRes = await fetch(`${API_URL}/admin/horta/historico?id_horta=${idHorta}`, { headers: authHeaders() });
      if (!historyRes.ok) throw new Error('Não foi possível carregar os dados da horta.');
      const history = await historyRes.json();
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

  const formatDate = (value: string | null) => value
    ? new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    : 'Data não disponível';

  return (
    <main className="min-h-screen bg-gray-50 pb-8">
      <div className="flex items-center justify-end gap-3 px-4 pt-6 lg:px-6">
        <button onClick={() => toast.info('Notificações chegam em breve')} aria-label="Notificações" className="flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white transition-colors hover:border-[#00a63e]">
          <Bell className="size-4 text-[#4a5565]" />
        </button>
        <GardenRoleMenu />
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

          <HomeGardensSection onExplore={() => onNavigate('explore')} onHome={() => onNavigate('home')} />

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

        <aside className="flex min-h-0 min-w-0 flex-col gap-5">
          <section>
            <h2 className="mb-3 px-1 text-[15px] font-semibold text-neutral-950">Ações rápidas</h2>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => onNavigate('tasks', { openCreateTask: true })} className="flex min-h-[100px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] bg-[#00a63e] p-4 transition-colors hover:bg-[#008236] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008236]"><Plus className="size-6 text-white" /><span className="text-[12px] font-medium text-white">Criar tarefa</span></button>
              <button onClick={() => onNavigate('rewards')} className="flex min-h-[100px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border border-gray-200 bg-white p-4 transition-all hover:border-[#00a63e] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a63e]"><Gift className="size-6 text-[#00a63e]" /><span className="text-[12px] font-medium text-neutral-950">Gerenciar recompensas</span></button>
              <button onClick={() => onNavigate('profile', { editGarden: true })} className="col-span-2 flex cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-gray-200 bg-white p-3 transition-all hover:border-[#00a63e] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a63e]"><Settings className="size-4 text-[#4a5565]" /><span className="text-[12px] font-medium text-neutral-950">Configurações da horta</span></button>
            </div>
          </section>

        </aside>
      </div>
    </main>
  );
}
