import { useEffect, useMemo, useState } from 'react';
import { API_URL } from '../config';
import { ArrowRight, Award, CheckCircle2, Clock3, Coins, Flame, Leaf, LoaderCircle, MapPin, Play, Sprout, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import TaskProofUpload from './TaskProofUpload';

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

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

interface CommunityChallenge {
  id: number;
  id_horta: number;
  nome: string;
  goal_tasks: number;
  completed_tasks: number;
  ends_at: string;
  completed: boolean;
}

interface CommunityMember {
  position: number;
  id_perfil: number;
  nome: string;
  xp: number;
  tarefas_concluidas: number;
  is_you: boolean;
}

interface GamificationData {
  level: number;
  level_name: string;
  xp: number;
  xp_to_next_level: number;
  total_xp: number;
  is_max_level: boolean;
  moedas: number;
  tarefas_concluidas: number;
  sequencia_dias: number;
  mudas_este_mes: number;
  achievements: Achievement[];
  hortas: { id: number; nome: string }[];
  community_challenges: CommunityChallenge[];
  leaderboard: CommunityMember[];
}

interface HomePageProps {
  onNavigate: (page: 'home' | 'explore' | 'tasks' | 'rewards' | 'profile') => void;
}

const difficultyNames = ['Fácil', 'Médio', 'Difícil'];
const missionImages = [
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=760&q=85',
  'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=760&q=85',
  'https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=760&q=85',
];

export default function HomePage({ onNavigate }: HomePageProps) {
  const { token, user } = useAuth();
  const [inProgressTasks, setInProgressTasks] = useState<Task[]>([]);
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [coins, setCoins] = useState(0);
  const [stats, setStats] = useState<GamificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [workingTaskId, setWorkingTaskId] = useState<number | null>(null);

  const authHeaders = () => ({ Authorization: `Bearer ${token}` });

  const fetchData = async (): Promise<GamificationData | null> => {
    if (!token) return null;
    setIsLoading(true);
    try {
      const [mineRes, availableRes, progressRes] = await Promise.all([
        fetch(`${API_URL}/minhas_tarefas`, { method: 'POST', headers: authHeaders() }),
        fetch(`${API_URL}/tarefas_disponiveis`, { headers: authHeaders() }),
        fetch(`${API_URL}/me/gamificacao`, { headers: authHeaders() }),
      ]);
      if (!mineRes.ok || !availableRes.ok || !progressRes.ok) throw new Error('Não foi possível carregar seu painel.');
      const [mine, available, progress] = await Promise.all([
        mineRes.json(), availableRes.json(), progressRes.json(),
      ]);
      setInProgressTasks(mine);
      setAvailableTasks(available);
      setCoins(Math.max(0, Number(progress.moedas) || 0));
      setStats(progress as GamificationData);
      return progress as GamificationData;
    } catch (error) {
      console.error('Erro ao carregar a página inicial:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao carregar seu painel.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [token]);

  const taskCountsByHorta = useMemo(() => new Set((stats?.hortas ?? []).map((horta) => horta.id)).size, [stats?.hortas]);
  const visibleAchievements = (stats?.achievements ?? []).slice(0, 3);
  const firstName = user?.nome?.trim().split(/\s+/)[0] || 'Cultivador';
  const xp = stats?.xp ?? 0;
  const xpTarget = stats?.xp_to_next_level ?? 500;
  const progressPercent = Math.min(100, (xp / xpTarget) * 100);
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
        body: JSON.stringify({ id_tarefa: task.id }),
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
        body: JSON.stringify({ id_tarefa: task.id }),
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
          {(task.status === 'pending_review' || task.status === 'proof_submitted' || task.completion_review_status === 'rejected') && <TaskProofUpload taskId={task.id} hasPhoto={Boolean(task.has_completion_photo)} canRetry={task.completion_review_status === 'rejected'} rejectionReason={task.completion_review_note} onUploaded={() => { void fetchData(); }} />}
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
            <button onClick={() => onNavigate('rewards')} className="inline-flex w-fit items-center gap-2 rounded-full border border-[#dcebdc] bg-white px-3.5 py-2 text-[12px] font-semibold text-[#34453a] shadow-sm transition hover:border-[#b9dabb] hover:bg-[#f8fcf8]">
              <span className="flex size-6 items-center justify-center rounded-full bg-[#fff2c7]"><Coins className="size-3.5 text-[#bd8514]" /></span>
              {coins} moedas
              <ArrowRight className="size-3.5 text-[#7b8a7d]" />
            </button>
          </header>

          <section className="relative isolate overflow-hidden rounded-[20px] bg-gradient-to-r from-[#087a3c] via-[#078c42] to-[#0a7540] px-5 py-5 text-white shadow-[0_10px_28px_#087a3c22] sm:px-6">
            <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-24 -z-10 size-64 rounded-full border-[30px] border-white/[0.06]" />
            <div aria-hidden="true" className="pointer-events-none absolute right-36 -bottom-28 -z-10 size-48 rounded-full bg-[#b5e783]/[0.08] blur-2xl" />
            <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)] lg:items-center">
              <div>
                <div className="flex items-center gap-2"><span className="flex size-8 items-center justify-center rounded-full bg-white/15"><Sprout className="size-4 text-[#d2ee9e]" /></span><span className="text-[12px] font-semibold text-white/90">Nível {stats?.level ?? 1} <span className="mx-1 text-white/50">·</span> {stats?.level_name ?? 'Semente'}</span></div>
                <div className="mt-4 flex flex-col items-start gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-3"><p className="text-[17px] font-bold sm:text-[19px]">{stats?.is_max_level ? 'Você alcançou o nível máximo' : 'Seu próximo nível começa aqui'}</p><p className="whitespace-nowrap text-[11px] font-semibold text-[#e2f3c2]">{xp} / {xpTarget} XP</p></div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-black/20"><div className="h-full rounded-full bg-gradient-to-r from-[#c8ec79] to-[#e6f6ad] shadow-[0_0_12px_#d8f69c88] transition-all" style={{ width: `${progressPercent}%` }} /></div>
                <p className="mt-2 text-[10px] text-white/75">Conclua missões para ganhar XP e evoluir.</p>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-3 backdrop-blur-sm"><span className="flex size-9 items-center justify-center rounded-full bg-[#f8d767]/20"><Coins className="size-[18px] text-[#ffe18a]" /></span><div><p className="text-[18px] font-bold leading-5">{coins}</p><p className="mt-1 text-[10px] text-white/75">moedas</p></div></div>
                <div className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-3 backdrop-blur-sm"><span className="flex size-9 items-center justify-center rounded-full bg-[#ffb45d]/20"><Flame className="size-[18px] text-[#ffd092]" /></span><div><p className="text-[16px] font-bold leading-5">{stats?.sequencia_dias ?? 0} dias</p><p className="mt-1 text-[10px] text-white/75">de sequência</p></div></div>
              </div>
            </div>
            {(stats?.sequencia_dias ?? 0) > 0 && <p className="relative mt-3 rounded-lg bg-white/10 px-3 py-2 text-[10px] text-white/90">Sua sequência está ativa. Uma tarefa concluída hoje mantém seu ritmo; se precisar pausar, seu progresso continua aqui.</p>}
          </section>

          <section className="grid grid-cols-2 overflow-hidden rounded-xl border border-[#e4e9e4] bg-white sm:grid-cols-4">
            <div className="flex items-center gap-2.5 border-b border-r border-[#edf0ed] px-3.5 py-3 sm:border-b-0"><span className="flex size-8 items-center justify-center rounded-full bg-[#e9f6eb]"><CheckCircle2 className="size-4 text-[#3c9656]" /></span><div><p className="text-[15px] font-bold leading-4">{stats?.tarefas_concluidas ?? 0}</p><p className="mt-0.5 text-[10px] text-[#77837a]">Tarefas concluídas</p></div></div>
            <div className="flex items-center gap-2.5 border-b border-[#edf0ed] px-3.5 py-3 sm:border-b-0 sm:border-r"><span className="flex size-8 items-center justify-center rounded-full bg-[#fff6df]"><Coins className="size-4 text-[#bd8514]" /></span><div><p className="text-[15px] font-bold leading-4">{coins}</p><p className="mt-0.5 text-[10px] text-[#77837a]">Moedas disponíveis</p></div></div>
            <div className="flex items-center gap-2.5 border-r border-[#edf0ed] px-3.5 py-3"><span className="flex size-8 items-center justify-center rounded-full bg-[#f2edfc]"><Award className="size-4 text-[#7953a9]" /></span><div><p className="text-[15px] font-bold leading-4">{xp} XP</p><p className="mt-0.5 text-[10px] text-[#77837a]">XP neste nível</p></div></div>
            <div className="flex items-center gap-2.5 px-3.5 py-3"><span className="flex size-8 items-center justify-center rounded-full bg-[#fff0e3]"><Flame className="size-4 text-[#d57d28]" /></span><div><p className="text-[15px] font-bold leading-4">{stats?.sequencia_dias ?? 0} dias</p><p className="mt-0.5 text-[10px] text-[#77837a]">Sequência atual</p></div></div>
          </section>

          <section className="rounded-xl border border-[#dcebdd] bg-gradient-to-r from-[#f1f9f1] to-white p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[#38844c] shadow-sm"><Users className="size-4" /></span>
              <div className="min-w-0 flex-1">
                <h2 className="text-[14px] font-bold text-[#26362a]">Desafio da comunidade</h2>
                <p className="mt-0.5 text-[11px] text-[#77837a]">Uma meta coletiva baseada nas tarefas concluídas neste mês.</p>
              </div>
            </div>
            {stats?.community_challenges?.length ? <div className="mt-3 grid gap-3 sm:grid-cols-2">{stats.community_challenges.slice(0, 2).map((challenge) => {
              const percent = Math.min(100, challenge.goal_tasks > 0 ? (challenge.completed_tasks / challenge.goal_tasks) * 100 : 0);
              const daysLeft = Math.max(0, Math.ceil((new Date(challenge.ends_at).getTime() - Date.now()) / 86400000));
              return <div key={challenge.id} className="rounded-lg border border-[#e4ece4] bg-white/90 p-3">
                <div className="flex items-center justify-between gap-2"><p className="truncate text-[11px] font-semibold text-[#34453a]">{challenge.nome}</p><span className="shrink-0 text-[10px] font-semibold text-[#16803d]">{challenge.completed ? 'Concluído' : `${challenge.completed_tasks}/${challenge.goal_tasks}`}</span></div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#edf1ed]"><div className="h-full rounded-full bg-[#4eaa64] transition-all" style={{ width: `${percent}%` }} /></div>
                <p className="mt-1.5 text-[10px] text-[#77837a]">{challenge.completed ? 'Meta alcançada em equipe' : `${daysLeft} ${daysLeft === 1 ? 'dia restante' : 'dias restantes'} · toda contribuição conta`}</p>
              </div>;
            })}</div> : <p className="mt-3 rounded-lg border border-dashed border-[#dce5dc] bg-white/80 px-3 py-3 text-[11px] text-[#77837a]">Participe de uma horta para acompanhar o próximo desafio coletivo.</p>}
          </section>

          {weeklyFocusTask && <section className="flex flex-col gap-3 rounded-xl border border-[#dce9d9] bg-gradient-to-r from-white to-[#f0f8ed] p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5c8148]">Uma descoberta para esta semana</p><h2 className="mt-1 text-[14px] font-bold text-[#26362a]">{weeklyFocusTask.titulo}</h2><p className="mt-1 text-[11px] text-[#718075]">Atividade publicada por {weeklyFocusTask.horta}. Veja se combina com o que você quer cultivar hoje.</p></div><button onClick={() => onNavigate('tasks')} className="shrink-0 rounded-lg border border-[#cfe2cc] bg-white px-3.5 py-2 text-[11px] font-semibold text-[#16803d] hover:bg-[#f8fcf8]">Conhecer missão</button></section>}

          <section>
            <div className="mb-3 flex items-end justify-between gap-3">
              <div><h2 className="text-[17px] font-bold text-[#202b22]">Minhas tarefas</h2><p className="mt-0.5 text-[12px] text-[#738076]">Continue contribuindo para sua horta.</p></div>
              <button onClick={() => onNavigate('tasks')} className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#16803d] hover:underline">Ver todas <ArrowRight className="size-3.5" /></button>
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

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-xl border border-[#e4e9e4] bg-white p-4">
              <div className="mb-3 flex items-center justify-between"><div><h2 className="text-[14px] font-bold text-[#202b22]">Suas conquistas</h2><p className="mt-0.5 text-[10px] text-[#77837a]">Condições especiais reconhecem sua participação.</p></div><button onClick={() => onNavigate('profile')} className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#16803d] hover:underline">Ver todas <ArrowRight className="size-3" /></button></div>
              {visibleAchievements.length > 0 ? <div className="grid gap-2 sm:grid-cols-3">{visibleAchievements.map((achievement) => <div key={achievement.id} className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 ${achievement.unlocked ? 'border-[#e2eee3] bg-[#f8fcf8]' : 'border-[#eceeec] bg-[#fafbfa]'}`}><span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[16px] ${achievement.unlocked ? 'bg-[#eaf6eb]' : 'bg-[#f0f1f0] grayscale'}`}>{achievement.unlocked ? achievement.icon : '🔒'}</span><div className="min-w-0"><p className={`truncate text-[10px] font-semibold ${achievement.unlocked ? 'text-[#34453a]' : 'text-[#77837a]'}`}>{achievement.name}</p><p className="text-[9px] text-[#849087]">{achievement.unlocked ? 'Desbloqueada' : achievement.description}</p></div></div>)}</div> : <p className="rounded-lg bg-[#f8faf8] px-3 py-4 text-center text-[11px] text-[#77837a]">Suas conquistas aparecerão aqui conforme você participa das atividades.</p>}
            </section>

            <section className="rounded-xl border border-[#e4e9e4] bg-white p-4">
              <div className="flex items-center gap-2"><div className="flex size-8 items-center justify-center rounded-full bg-[#eff7f0]"><Users className="size-4 text-[#398650]" /></div><div><h2 className="text-[14px] font-bold text-[#202b22]">Seu impacto</h2><p className="text-[10px] text-[#77837a]">Sua contribuição ajuda a comunidade a crescer.</p></div></div>
              <div className="mt-3 grid grid-cols-3 divide-x divide-[#edf0ed] text-center"><div className="px-1"><p className="text-[16px] font-bold text-[#398650]">{taskCountsByHorta}</p><p className="mt-0.5 text-[9px] leading-3 text-[#77837a]">hortas</p></div><div className="px-1"><p className="text-[16px] font-bold text-[#bd8514]">{stats?.tarefas_concluidas ?? 0}</p><p className="mt-0.5 text-[9px] leading-3 text-[#77837a]">tarefas realizadas</p></div><div className="px-1"><p className="text-[16px] font-bold text-[#648344]">{stats?.mudas_este_mes ?? 0}</p><p className="mt-0.5 text-[9px] leading-3 text-[#77837a]">mudas este mês</p></div></div>
            </section>
          </div>

          {!!stats?.leaderboard?.length && <section className="rounded-xl border border-[#e4e9e4] bg-white p-4"><div className="mb-3 flex items-center gap-2"><div className="flex size-8 items-center justify-center rounded-full bg-[#eff7f0]"><Users className="size-4 text-[#398650]" /></div><div><h2 className="text-[14px] font-bold text-[#202b22]">Destaques da comunidade</h2><p className="text-[10px] text-[#77837a]">XP acumulado entre quem compartilha sua horta.</p></div></div><ol className="space-y-2">{stats.leaderboard.slice(0, 3).map((member) => <li key={member.id_perfil} className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-[11px] ${member.is_you ? 'bg-[#f0f8ed] font-semibold text-[#16803d]' : 'bg-[#f8faf8] text-[#526056]'}`}><span className="min-w-0 truncate">{member.position}. {member.nome}{member.is_you ? ' · você' : ''}</span><span className="ml-2 shrink-0">{member.xp} XP</span></li>)}</ol></section>}

          <p className="flex items-center justify-center gap-2 pb-1 text-center text-[10px] text-[#849087]"><Sprout className="size-3.5 text-[#53a064]" />Tarefas geram XP e moedas · XP aumenta seu nível · moedas podem ser trocadas por recompensas.</p>
        </div>
      </main>
    </>
  );
}
