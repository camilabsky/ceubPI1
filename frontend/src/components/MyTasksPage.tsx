import { useEffect, useMemo, useState } from 'react';
import { API_URL } from '../config';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import TaskProofUpload from './TaskProofUpload';

interface Task {
  id: number;
  titulo: string;
  concluido?: boolean;
  status: 'available' | 'in_progress' | 'pending_review' | 'proof_submitted' | 'completed';
  has_completion_photo?: boolean;
  completion_review_status?: 'pending' | 'approved' | 'rejected';
  completion_ai_status?: 'not_requested' | 'analyzed' | 'unavailable';
  completion_review_note?: string | null;
}

type TaskFilter = '' | 'in_progress' | 'pending_review' | 'proof_submitted' | 'proof_rejected' | 'completed';

interface Props {
  onBack: () => void;
}

export default function MyTasksPage({ onBack }: Props) {
  const { token, activeGardenId, activeGarden } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = async (signal?: AbortSignal) => {
    if (!token || !activeGardenId) {
      setTasks([]);
      setLoading(false);
      setError('Selecione uma horta para consultar suas tarefas.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/minhas_tarefas?id_horta=${activeGardenId}&include_completed=1`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      const result = await response.json().catch(() => []);
      if (!response.ok) throw new Error(Array.isArray(result) ? 'Não foi possível carregar suas tarefas.' : result.error || 'Não foi possível carregar suas tarefas.');
      setTasks(result);
    } catch (loadError) {
      if (signal?.aborted) return;
      const message = loadError instanceof Error ? loadError.message : 'Não foi possível carregar suas tarefas.';
      setError(message);
      setTasks([]);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void loadTasks(controller.signal);
    return () => controller.abort();
  }, [token, activeGardenId]);

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    if (!filter) return true;
    if (filter === 'proof_rejected') return !task.concluido && task.completion_review_status === 'rejected';
    if (filter === 'completed') return task.concluido || task.status === 'completed';
    return !task.concluido && task.status === filter
      && (filter !== 'in_progress' || task.completion_review_status !== 'rejected');
  }), [tasks, filter]);

  const finalizeTask = async (taskId: number) => {
    if (!token || !activeGardenId) return;
    try {
      const response = await fetch(`${API_URL}/concluir_tarefa`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_tarefa: taskId, id_horta: activeGardenId }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Não foi possível enviar a tarefa.');
      toast.success(result.message || 'Tarefa aguardando comprovação.');
      await loadTasks();
    } catch (finalizeError) {
      toast.error(finalizeError instanceof Error ? finalizeError.message : 'Erro ao finalizar tarefa.');
    }
  };

  return <main className="min-h-screen bg-gray-50 px-4 pb-8 pt-7 text-[#17201a] sm:px-6 lg:px-8">
    <div className="mx-auto max-w-5xl space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <button type="button" onClick={onBack} className="mb-3 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12px] font-semibold text-[#526056] hover:bg-gray-50" aria-label="Voltar à tela anterior"><ArrowLeft className="size-4" />Voltar</button>
          <h1 className="text-[24px] font-bold text-neutral-950">Minhas tarefas</h1>
          <p className="mt-1 text-[12px] text-[#717182]">Acompanhe suas atividades em {activeGarden?.horta_nome || 'sua horta ativa'}.</p>
        </div>
        <label className="flex flex-col gap-1 text-[10px] font-medium text-[#66736a]">Filtrar por situação
          <select aria-label="Filtrar minhas tarefas por situação" value={filter} onChange={(event) => setFilter(event.target.value as TaskFilter)} className="min-w-52 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[11px] text-neutral-950 focus:border-[#00a63e] focus:outline-none">
            <option value="">Todas as minhas tarefas</option>
            <option value="in_progress">Em andamento</option>
            <option value="proof_rejected">Comprovação recusada</option>
            <option value="pending_review">Aguardando envio da foto</option>
            <option value="proof_submitted">Aguardando análise</option>
            <option value="completed">Concluídas</option>
          </select>
        </label>
      </header>

      {loading ? <div role="status" className="flex min-h-40 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-[13px] text-[#738076]"><LoaderCircle className="size-4 animate-spin" />Carregando suas tarefas...</div>
        : error ? <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-800">{error}</div>
          : visibleTasks.length === 0 ? <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-10 text-center"><p className="text-[14px] font-semibold text-[#34453a]">{tasks.length === 0 ? 'Você ainda não iniciou tarefas nesta horta.' : 'Nenhuma tarefa nesta situação.'}</p><p className="mt-1 text-[11px] text-[#77837a]">Tarefas aceitas e suas comprovações aparecerão aqui.</p></div>
            : <section aria-label="Lista de minhas tarefas" className="space-y-3">{visibleTasks.map((task) => {
              const canRetryProof = task.status === 'in_progress' && task.completion_review_status === 'rejected';
              const showProofPanel = task.status === 'pending_review' || task.status === 'proof_submitted'
                || canRetryProof || (task.status === 'completed' && task.completion_ai_status === 'analyzed');
              const isCompleted = task.concluido || task.status === 'completed';
              const statusLabel = canRetryProof ? 'Comprovação recusada'
                : task.status === 'pending_review' ? 'Enviar foto de comprovação'
                  : task.status === 'proof_submitted' ? 'Aguardando análise'
                    : isCompleted ? 'Tarefa concluída' : 'Em andamento';
              const statusClass = canRetryProof ? 'bg-red-50 text-red-700'
                : task.status === 'pending_review' ? 'bg-amber-50 text-amber-800'
                  : task.status === 'proof_submitted' ? 'bg-purple-50 text-purple-700'
                    : isCompleted ? 'bg-green-50 text-green-800' : 'bg-blue-50 text-blue-700';
              return <article key={task.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0"><h2 className="truncate text-[14px] font-semibold text-neutral-950">{task.titulo}</h2><span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusClass}`}>{statusLabel}</span></div>
                  {task.status === 'in_progress' && !canRetryProof && <button type="button" onClick={() => void finalizeTask(task.id)} className="shrink-0 rounded-lg bg-[#00a63e] px-3.5 py-2 text-[11px] font-semibold text-white hover:bg-[#008236]">Finalizar tarefa</button>}
                </div>
                {showProofPanel && <TaskProofUpload taskId={task.id} idHorta={activeGardenId ?? 0} hasPhoto={Boolean(task.has_completion_photo)} canRetry={canRetryProof} rejectionReason={task.completion_review_note} onUploaded={() => { void loadTasks(); }} />}
              </article>;
            })}</section>}
    </div>
  </main>;
}
