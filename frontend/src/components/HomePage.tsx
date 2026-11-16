import { useEffect, useState } from 'react';
import { API_URL } from '../config';
import { ArrowRight, Award, CheckCircle2, Clock3, Compass, Leaf, LoaderCircle, MapPin, Play, Plus, Sprout } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import type { AppPage } from '../types/adminNavigation';
import TaskProofUpload from './TaskProofUpload';
import HomeGardensSection from './HomeGardensSection';
import GardenRoleMenu from './GardenRoleMenu';

interface Task {
  id: number;
  titulo: string;
  descricao: string;
  tipo: string;
  horta: string;
  dificuldade: number;
  moedas: number;
  xp: number;
  mudas: number;
  tempo: number;
  status: 'available' | 'in_progress' | 'pending_review' | 'proof_submitted' | 'completed';
  has_completion_photo?: boolean;
  completion_review_status?: 'pending' | 'approved' | 'rejected';
  completion_review_note?: string | null;
}

interface HomePageProps {
  onNavigate: (page: AppPage) => void;
}

const difficultyNames = ['Fácil', 'Médio', 'Difícil'];
const missionImages = [
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=760&q=85',
  'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=760&q=85',
  'https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=760&q=85',
];

export default function HomePage({ onNavigate }: HomePageProps) {
  const { token, user, activeGardenId } = useAuth();
  const [inProgressTasks, setInProgressTasks] = useState<Task[]>([]);
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [workingTaskId, setWorkingTaskId] = useState<number | null>(null);

  const authHeaders = () => ({ Authorization: `Bearer ${token}` });

  const fetchData = async (): Promise<void> => {
    if (!token || !activeGardenId) {
      setInProgressTasks([]);
      setAvailableTasks([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const [mineRes, availableRes] = await Promise.all([
        fetch(`${API_URL}/minhas_tarefas?id_horta=${activeGardenId ?? ''}`, { method: 'POST', headers: authHeaders() }),
        fetch(`${API_URL}/tarefas_disponiveis?id_horta=${activeGardenId ?? ''}`, { headers: authHeaders() }),
      ]);
      if (!mineRes.ok || !availableRes.ok) throw new Error('Não foi possível carregar suas tarefas.');
      const [mine, available] = await Promise.all([
        mineRes.json(), availableRes.json(),
      ]);
      setInProgressTasks(mine);
      setAvailableTasks(available);
    } catch (error) {
      console.error('Erro ao carregar a página inicial:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao carregar seu painel.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [token, activeGardenId]);

  const firstName = user?.nome?.trim().split(/\s+/)[0] || 'Cultivador';
  const weeklyFocusTask = availableTasks.length
    ? availableTasks[Math.floor(Date.now() / 604800000) % availableTasks.length]
    : null;

  const acceptTask = async (task: Task) => {
    if (!token) return;
    setWorkingTaskId(task.id);
    try {
      const response = await fetch(`${API_URL}/iniciar_tarefa`, {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_tarefa: task.id, id_horta: activeGardenId }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Não foi possível aceitar esta tarefa.');
      toast.success('Tarefa iniciada. Ela está em andamento.');
      await fetchData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao aceitar tarefa.');
    } finally {
      setWorkingTaskId(null);
    }
  };

  const finalizeTask = async (task: Task) => {
    if (!token) return;
    setWorkingTaskId(task.id);
    try {
      const response = await fetch(`${API_URL}/concluir_tarefa`, {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_tarefa: task.id, id_horta: activeGardenId }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Não foi possível concluir esta tarefa.');
      await fetchData();
      toast.success(result.message || 'Tarefa enviada. Ela está aguardando comprovação.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao concluir tarefa.');
    } finally {
      setWorkingTaskId(null);
    }
  };

  const difficultyClass = (difficulty: number) => difficulty === 0
    ? 'bg-[#edf7ee] text-[#218044]'
    : difficulty === 1
      ? 'bg-[#fff6e7] text-[#9a6a13]'
      : 'bg-[#fff0ed] text-[#a84a37]';

  const TaskCard = ({ task, available = false }: { task: Task; available?: boolean }) => (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#e5eae5] bg-white transition hover:-translate-y-0.5 hover:border-[#b8d9bf] hover:shadow-[0_8px_24px_#17371d12]">
      <div className="relative h-[112px] overflow-hidden bg-[#dfeadf]">
        <img src={missionImages[task.id % missionImages.length]} alt="Canteiros de horta comunitária" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#15321d]/55 via-transparent to-[#15321d]/5" />
        <span className={`absolute bottom-2.5 left-3 rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-sm ${available ? 'bg-white/95 text-[#218044]' : task.completion_review_status === 'rejected' ? 'bg-white/95 text-red-700' : task.status === 'pending_review' ? 'bg-white/95 text-[#8a6414]' : task.status === 'proof_submitted' ? 'bg-white/95 text-[#16803d]' : 'bg-white/95 text-[#66736a]'}`}>{available ? 'Disponível' : task.completion_review_status === 'rejected' ? 'Comprovação recusada' : task.status === 'pending_review' ? 'Aguardando comprovação' : task.status === 'proof_submitted' ? 'Comprovação enviada' : 'Em andamento'}</span>
      </div>
      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="line-clamp-1 text-[14px] font-semibold leading-5 text-[#202b22]">{task.titulo}</h3>
        <p className="mt-1.5 flex items-center gap-1.5 truncate text-[11px] text-[#728076]"><MapPin className="size-3.5 shrink-0 text-[#3d9860]" />{task.horta || 'Horta comunitária'}</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px]">
          <span className={`rounded-md px-2 py-1 font-semibold ${difficultyClass(task.dificuldade)}`}>{difficultyNames[task.dificuldade] || 'Fácil'}</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-[#f5f7f5] px-2 py-1 text-[#66736a]"><Clock3 className="size-3" />{task.tempo} min</span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 text-[10px]">
          <span className="inline-flex items-center gap-1 rounded-md bg-[#f4f0ff] px-2 py-1 font-semibold text-[#7953a9]"><Award className="size-3" />+{task.xp} XP</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-[#edf7ee] px-2 py-1 font-semibold text-[#218044]"><Sprout className="size-3" />+{task.moedas} moedas</span>
        </div>
        {!available && <p className="mt-1.5 text-[9px] text-[#849087]">Recompensas liberadas após aprovação da comprovação.</p>}
        <div className="mt-auto pt-3">
          {!available && <div className="mb-2.5 flex items-center gap-2 text-[10px] font-medium text-[#728076]"><span className={`size-1.5 rounded-full ${task.status === 'pending_review' ? 'bg-[#c89d31]' : 'bg-[#37a45b]'}`} />{task.status === 'pending_review' ? 'Aguardando foto de comprovação' : task.status === 'proof_submitted' ? 'Foto vinculada à tarefa' : 'Sua participação está em andamento'}</div>}
          {(task.status === 'pending_review' || task.status === 'proof_submitted' || task.completion_review_status === 'rejected') && <TaskProofUpload taskId={task.id} idHorta={activeGardenId ?? 0} hasPhoto={Boolean(task.has_completion_photo)} canRetry={task.completion_review_status === 'rejected'} rejectionReason={task.completion_review_note} onUploaded={() => { void fetchData(); }} />}
          {available || (task.status === 'in_progress' && task.completion_review_status !== 'rejected') ? <button
            onClick={() => available ? acceptTask(task) : finalizeTask(task)}
            disabled={workingTaskId === task.id}
            className={`flex h-9 w-full items-center justify-center gap-2 rounded-lg text-[12px] font-semibold transition disabled:opacity-60 ${available ? 'border border-[#cae4cf] bg-[#f8fcf8] text-[#16803d] hover:bg-[#eff8f0]' : 'bg-[#168a3c] text-white hover:bg-[#117331]'}`}
          >
            {workingTaskId === task.id ? <LoaderCircle className="size-3.5 animate-spin" /> : available ? <><CheckCircle2 className="size-3.5" />Iniciar tarefa</> : <><Play className="size-3.5" />Finalizar tarefa</>}
          </button> : task.status === 'pending_review' && !task.has_completion_photo ? <div className="flex h-9 w-full items-center justify-center rounded-lg bg-[#fff8e7] text-[11px] font-semibold text-[#856415]">Envie uma foto para comprovar</div> : null}
        </div>
      </div>
    </article>
  );

  return (
    <>
      <main className="min-h-screen bg-[#f7f9f7] px-4 pb-10 pt-7 text-[#17201a] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-5">
          <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#e4f3e5] text-[18px] font-bold text-[#16803d] shadow-sm">{firstName.charAt(0).toLocaleUpperCase('pt-BR')}</div>
              <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#16803d]">Couve <span className="mx-1 text-[#b4c1b6]">/</span> Comunidade</p>
              <h1 className="text-[26px] font-bold leading-tight tracking-[-0.03em] text-[#1c2b20]">Olá, {firstName}! <span aria-hidden="true">👋</span></h1>
              <p className="mt-1 text-[13px] text-[#6c786f]">Continue cultivando sua comunidade.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onNavigate('rewards')} className="inline-flex w-fit items-center gap-2 rounded-full border border-[#dcebdc] bg-white px-3.5 py-2 text-[12px] font-semibold text-[#34453a] shadow-sm transition hover:border-[#b9dabb] hover:bg-[#f8fcf8]">
                Ver recompensas
                <ArrowRight className="size-3.5 text-[#7b8a7d]" />
              </button>
              <GardenRoleMenu />
            </div>
          </header>

          <section aria-label="Ações de hortas" className="grid gap-3 sm:grid-cols-2">
            <button onClick={() => onNavigate('explore')} className="flex min-h-24 items-center gap-3 rounded-xl border border-[#cfe2d1] bg-white p-4 text-left shadow-sm transition hover:border-[#9dcda7] hover:bg-[#f8fcf8]">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#eaf7ed] text-[#16803d]"><Compass className="size-5" /></span>
              <span className="min-w-0 flex-1"><span className="block text-[14px] font-semibold text-[#26362a]">Explorar hortas</span><span className="mt-0.5 block text-[11px] text-[#738076]">Encontre comunidades e veja os detalhes de cada horta.</span></span>
              <ArrowRight className="size-4 shrink-0 text-[#16803d]" />
            </button>
            <button type="button" onClick={() => onNavigate('create-garden')} className="flex min-h-24 items-center gap-3 rounded-xl border border-[#cfe2d1] bg-white p-4 text-left shadow-sm transition hover:border-[#9dcda7] hover:bg-[#f8fcf8]">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f0f3f0] text-[#849087]"><Plus className="size-5" /></span>
              <span className="min-w-0 flex-1"><span className="block text-[14px] font-semibold text-[#26362a]">Criar minha horta</span><span className="mt-0.5 block text-[11px] text-[#738076]">Cadastre uma horta comunitária e torne-se administrador.</span></span>
              <ArrowRight className="size-4 shrink-0 text-[#16803d]" />
            </button>
          </section>

          <HomeGardensSection onExplore={() => onNavigate('explore')} onHome={() => onNavigate('home')} />

          {weeklyFocusTask && <section className="flex flex-col gap-3 rounded-xl border border-[#dce9d9] bg-gradient-to-r from-white to-[#f0f8ed] p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5c8148]">Uma descoberta para esta semana</p><h2 className="mt-1 text-[14px] font-bold text-[#26362a]">{weeklyFocusTask.titulo}</h2><p className="mt-1 text-[11px] text-[#718075]">Atividade publicada por {weeklyFocusTask.horta}. Veja se combina com o que você quer cultivar hoje.</p></div><button onClick={() => onNavigate('tasks')} className="shrink-0 rounded-lg border border-[#cfe2cc] bg-white px-3.5 py-2 text-[11px] font-semibold text-[#16803d] hover:bg-[#f8fcf8]">Conhecer missão</button></section>}

          <section>
            <div className="mb-3 flex items-end justify-between gap-3">
              <div><h2 className="text-[17px] font-bold text-[#202b22]">Minhas tarefas</h2><p className="mt-0.5 text-[12px] text-[#738076]">Continue contribuindo para sua horta.</p></div>
              <button onClick={() => onNavigate('my-tasks')} className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#16803d] hover:underline">Ver todas <ArrowRight className="size-3.5" /></button>
            </div>
            {isLoading ? <div className="flex h-36 items-center justify-center gap-2 rounded-xl border border-[#e4e9e4] bg-white text-[12px] text-[#738076]"><LoaderCircle className="size-4 animate-spin" />Carregando tarefas...</div> : inProgressTasks.length === 0 ? <div className="flex flex-col items-center rounded-xl border border-dashed border-[#dce5dc] bg-white px-5 py-8 text-center"><div className="flex size-10 items-center justify-center rounded-full bg-[#eff7f0] text-[#16803d]"><Leaf className="size-5" /></div><p className="mt-2 text-[13px] font-semibold text-[#26362a]">Você ainda não aceitou nenhuma tarefa</p><p className="mt-1 max-w-sm text-[11px] text-[#78847b]">Encontre uma atividade e comece a contribuir com sua comunidade.</p><button onClick={() => onNavigate('tasks')} className="mt-3 rounded-lg bg-[#168a3c] px-3.5 py-2 text-[11px] font-semibold text-white hover:bg-[#117331]">Explorar tarefas</button></div> : <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{inProgressTasks.slice(0, 3).map((task) => <TaskCard key={task.id} task={task} />)}</div>}
          </section>

          <section>
            <div className="mb-3 flex items-end justify-between gap-3">
              <div><h2 className="text-[16px] font-bold text-[#202b22]">Tarefas disponíveis para você</h2><p className="mt-0.5 text-[11px] text-[#738076]">Escolha uma missão aberta nas hortas das quais participa.</p></div>
              <button onClick={() => onNavigate('tasks')} className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16803d] hover:underline">Ver todas <ArrowRight className="size-3.5" /></button>
            </div>
            {isLoading ? <div className="h-28 animate-pulse rounded-xl border border-[#e4e9e4] bg-white" /> : availableTasks.length === 0 ? <div className="flex items-center gap-3 rounded-xl border border-[#e4e9e4] bg-white px-4 py-4"><div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f3f6f3]"><Leaf className="size-4 text-[#6a9272]" /></div><div><p className="text-[12px] font-semibold text-[#34453a]">Nenhuma tarefa aberta no momento</p><p className="mt-0.5 text-[11px] text-[#77837a]">Novas atividades aparecerão aqui quando forem publicadas nas suas hortas.</p></div></div> : <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{availableTasks.slice(0, 3).map((task) => <TaskCard key={task.id} task={task} available />)}</div>}
          </section>

        </div>
      </main>
    </>
  );
}
