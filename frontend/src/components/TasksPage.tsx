import { API_URL } from '../config';
import { MapPin, Clock, Sprout, PlusCircle, Edit2, Trash2, Loader, Award } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect, useMemo } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import TaskProofUpload from './TaskProofUpload';
import AdminTaskReview from './AdminTaskReview';
import type { AdminNavigationIntent, AdminTaskStatusFilter } from '../types/adminNavigation';

interface Task {
  id: number;
  titulo: string;
  descricao: string;
  horta: string;
  tipo: string;
  dificuldade: number;
  moedas: number;
  xp: number;
  mudas: number;
  tempo: number;
  concluido?: boolean;
  status: 'available' | 'in_progress' | 'pending_review' | 'proof_submitted' | 'completed';
  id_perfil?: number | null;
  has_completion_photo?: boolean;
  completion_review_status?: 'pending' | 'approved' | 'rejected';
  completion_ai_status?: 'not_requested' | 'analyzed' | 'unavailable';
  ai_resultado?: 'COMPATIVEL' | 'INCONCLUSIVO' | 'INCOMPATIVEL' | null;
  ai_confianca?: number | string | null;
  completion_review_note?: string | null;
}

interface AdminTaskDone {
  id: number;
  titulo: string;
  tipo: string;
  horta: string;
  moedas: number;
  xp: number;
  perfil_nome?: string;
}

interface AdminTaskLocation {
  latitude: number | string | null;
  longitude: number | string | null;
  status: 'validated' | 'outside_radius' | 'unavailable' | 'garden_location_missing' | 'not_requested';
  distance_meters: number | null;
}

interface TasksPageProps {
  navigationIntent?: AdminNavigationIntent | null;
}

export default function TasksPage({ navigationIntent }: TasksPageProps) {
  const { token, user, isAdmin } = useAuth();
  const idPerfil = user?.id_perfil || 1;
  const idHorta = user?.roles.find((r) => r.role === 'ADMIN')?.id_horta || 1;

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [acceptedTaskTitle, setAcceptedTaskTitle] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [taskCategory, setTaskCategory] = useState('Todas');
  const [taskOrder, setTaskOrder] = useState<'recommended' | 'xp' | 'easy'>('recommended');
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  const [showFormTask, setShowFormTask] = useState(Boolean(navigationIntent?.openCreateTask));
  const [statusFilter, setStatusFilter] = useState<AdminTaskStatusFilter | ''>(navigationIntent?.taskStatusFilter || '');
  const [focusedTaskId, setFocusedTaskId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSavingTask, setIsSavingTask] = useState(false);
  const [tarefasConcluidasHorta, setTarefasConcluidasHorta] = useState<AdminTaskDone[]>([]);
  const [adminTaskLocations, setAdminTaskLocations] = useState<Record<number, AdminTaskLocation>>({});
  const [loadingLocationTaskId, setLoadingLocationTaskId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    tipo: 'Manutenção',
    dificuldade: 0,
    moedas: 50,
    xp: 50,
    mudas: 0,
    tempo: 30,
  });

  const fetchData = async () => {
    setIsLoadingTasks(true);
    try {
      const tasksUrl = isAdmin && token
        ? `${API_URL}/admin/tarefas`
        : `${API_URL}/tarefas_disponiveis`;
      const tasksResponse = await fetch(
        tasksUrl,
            token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      if (!tasksResponse.ok) {
        throw new Error('Falha ao carregar tarefas');
      }
      const tasksData = await tasksResponse.json();
      setTasks(tasksData);

      if (isAdmin && token) {
        setMyTasks([]);
        const historyResponse = await fetch(
          `${API_URL}/admin/horta/historico?id_horta=${idHorta}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!historyResponse.ok) {
          throw new Error('Falha ao carregar tarefas concluidas da horta');
        }

        const historyData = await historyResponse.json();
        setTarefasConcluidasHorta(historyData.tarefas_concluidas_horta || []);
      } else {
        setTarefasConcluidasHorta([]);
        if (token) {
          const mineResponse = await fetch(`${API_URL}/minhas_tarefas`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
          if (!mineResponse.ok) throw new Error('Falha ao carregar suas tarefas em andamento');
          setMyTasks(await mineResponse.json());
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erro ao carregar tarefas');
    } finally {
      setIsLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAdmin, token, idHorta]);

  const taskCategories = useMemo(() => ['Todas', ...Array.from(new Set(tasks.map((task) => task.tipo).filter(Boolean)))], [tasks]);
  const visibleTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      const matchesCategory = taskCategory === 'Todas' || task.tipo === taskCategory;
      const matchesStatus = !statusFilter
        || (statusFilter === 'completed' ? task.concluido || task.status === 'completed' : !task.concluido && task.status === statusFilter);
      return matchesCategory && matchesStatus;
    });
    return [...filtered].sort((a, b) => taskOrder === 'xp'
      ? Number(b.xp || 0) - Number(a.xp || 0)
      : taskOrder === 'easy'
        ? Number(a.dificuldade || 0) - Number(b.dificuldade || 0)
        : Number(b.moedas || 0) + Number(b.xp || 0) - Number(a.moedas || 0) - Number(a.xp || 0));
  }, [tasks, taskCategory, taskOrder, statusFilter]);

  useEffect(() => {
    if (!navigationIntent?.focusTaskId || isLoadingTasks || !tasks.some((task) => task.id === navigationIntent.focusTaskId)) return;
    setFocusedTaskId(navigationIntent.focusTaskId);
    document.getElementById(`admin-task-${navigationIntent.focusTaskId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [navigationIntent?.focusTaskId, isLoadingTasks, tasks]);

  const acceptTask = async (idTarefa: number) => {
    if (!token) {
      toast.error('Sessão expirada, faça login novamente');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/iniciar_tarefa`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_tarefa: idTarefa }),
      });

      if (response.status === 409) {
        toast.error('Essa tarefa já foi aceita por outra pessoa');
        await fetchData();
        return;
      }
      if (!response.ok) {
        throw new Error('Falha ao aceitar tarefa');
      }

      const accepted = tasks.find((task) => task.id === idTarefa);
      setAcceptedTaskTitle(accepted?.titulo || 'Tarefa');
      setShowConfirmDialog(true);
      await fetchData();
    } catch (error) {
      console.error('Error accepting task:', error);
      toast.error('Erro ao aceitar tarefa');
    }
  };

  const loadAdminTaskLocation = async (taskId: number) => {
    if (!token) return;
    setLoadingLocationTaskId(taskId);
    try {
      const response = await fetch(`${API_URL}/admin/tarefas/${taskId}/localizacao`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Não foi possível consultar a localização.');
      setAdminTaskLocations((previous) => ({ ...previous, [taskId]: result }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao consultar a localização.');
    } finally {
      setLoadingLocationTaskId(null);
    }
  };

  const finalizeTask = async (idTarefa: number) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/concluir_tarefa`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_tarefa: idTarefa }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Não foi possível enviar a tarefa.');
      toast.success(result.message || 'Tarefa aguardando comprovação.');
      await fetchData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao finalizar tarefa.');
    }
  };
  const resetTaskForm = () => {
    setEditingId(null);
    setFormData({
      titulo: '',
      descricao: '',
      tipo: 'Manutenção',
      dificuldade: 0,
      moedas: 50,
      xp: 50,
      mudas: 0,
      tempo: 30,
    });
  };

  useEffect(() => {
    setStatusFilter(navigationIntent?.taskStatusFilter || '');
    setFocusedTaskId(null);
    if (navigationIntent?.openCreateTask) {
      resetTaskForm();
      setShowFormTask(true);
    } else {
      setShowFormTask(false);
    }
  }, [navigationIntent]);

  const handleSaveTask = async () => {
    if (!isAdmin || !token) return;
    if (!formData.titulo.trim() || !formData.descricao.trim()) {
      toast.error('Preencha título e descrição');
      return;
    }

    setIsSavingTask(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `${API_URL}/admin/tarefas/${editingId}`
        : `${API_URL}/admin/tarefas`;

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, id_horta: idHorta }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Falha ao salvar tarefa');
      }

      toast.success(editingId ? 'Tarefa atualizada' : 'Tarefa criada com sucesso');
      setShowFormTask(false);
      resetTaskForm();
      await fetchData();
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar tarefa');
    } finally {
      setIsSavingTask(false);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!isAdmin || !token) return;
    if (!window.confirm('Tem certeza que deseja deletar esta tarefa?')) return;

    try {
      const response = await fetch(`${API_URL}/admin/tarefas/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Falha ao deletar tarefa');
      }

      toast.success('Tarefa removida');
      await fetchData();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Erro ao deletar tarefa');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingId(task.id);

    setFormData({
      titulo: task.titulo,
      descricao: task.descricao,
      tipo: task.tipo,
      dificuldade: Number(task.dificuldade) || 0,
      moedas: Number(task.moedas) || 0,
      xp: Number(task.xp) || 0,
      mudas: Number(task.mudas) || 0,
      tempo: Number(task.tempo) || 30,
    });

    setShowFormTask(false);
  };

  const getDifficultyColor = (difficulty: number) => {
    const colors = [
      'bg-[#00c950] text-white font-semibold',
      'bg-[#f0b100] text-white font-semibold',
      'bg-[#fb2c36] text-white font-semibold',
    ];
    return colors[difficulty] || colors[0];
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Manutenção':
        return 'bg-[#eceef2] text-[#030213]';
      case 'Compostagem':
      case 'compostagem':
        return 'bg-[#424141] text-[#fbfbfb]';
      case 'Plantio':
        return 'bg-[#030213] text-white';
      case 'Colheita':
      case 'colheita':
        return 'bg-[#eceef2] text-[#030213]';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const getAdminTaskStatus = (task: Task) => {
    if (task.concluido || task.status === 'completed') return { label: 'Concluída', styles: 'bg-green-50 text-green-700' };
    if (task.status === 'proof_submitted') return { label: 'Comprovação enviada', styles: 'bg-purple-50 text-purple-700' };
    if (task.status === 'pending_review') return { label: 'Aguardando comprovação', styles: 'bg-orange-50 text-orange-800' };
    if (task.status === 'in_progress' || task.id_perfil != null) return { label: 'Em andamento', styles: 'bg-blue-50 text-blue-700' };
    return { label: 'Disponível', styles: 'bg-amber-50 text-amber-700' };
  };

  const statusFilterLabels: Record<AdminTaskStatusFilter, string> = {
    available: 'Disponíveis',
    in_progress: 'Em andamento',
    pending_review: 'Aguardando comprovação',
    proof_submitted: 'Comprovação enviada',
    completed: 'Concluídas',
  };

  return (
    <>
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-[90%] sm:max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">Tarefa Aceita! 🎉</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              <span className="block mb-2">&quot;{acceptedTaskTitle}&quot;</span>
              Agora está em <span className="text-[#00a63e]">Minhas Tarefas</span>. Ao finalizar, ela ficará aguardando comprovação. As recompensas só serão liberadas após aprovação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={() => setShowConfirmDialog(false)}
              className="w-full bg-[#00a63e] hover:bg-[#008236]"
            >
              Entendido
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="min-h-screen bg-gray-50 pt-16 pb-4 px-4">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="px-2 text-[16px] font-bold text-neutral-950">{statusFilter ? `Tarefas: ${statusFilterLabels[statusFilter]}` : 'Tarefas Disponíveis'}</h1>
          <div className="flex items-center gap-2">
            {isAdmin && <select aria-label="Filtrar tarefas por status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as AdminTaskStatusFilter | '')} className="max-w-[190px] rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-[11px] focus:border-[#00a63e] focus:outline-none"><option value="">Todas as situações</option><option value="available">Disponíveis</option><option value="in_progress">Em andamento</option><option value="pending_review">Aguardando comprovação</option><option value="proof_submitted">Comprovação enviada</option><option value="completed">Concluídas</option></select>}
            {isAdmin && (
              <button
                onClick={() => {
                  resetTaskForm();
                  setShowFormTask((prev) => !prev);
                }}
                className="inline-flex items-center gap-1.5 bg-[#00a63e] text-white text-[12px] px-3 py-2 rounded-lg hover:bg-[#008236] transition-colors"
              >
                <PlusCircle className="size-4" />
                {showFormTask ? 'Fechar' : 'Nova tarefa'}
              </button>
            )}
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-1">
              <span className="text-[12px] text-neutral-950">{visibleTasks.length} tarefas</span>
            </div>
          </div>
        </div>

        {!isAdmin && myTasks.length > 0 && <section className="mb-5 rounded-[14px] border border-gray-200 bg-white p-4">
          <div className="mb-3"><h2 className="text-[15px] font-semibold text-neutral-950">Minhas tarefas</h2><p className="mt-0.5 text-[11px] text-[#717182]">Acompanhe atividades e envios para comprovação.</p></div>
          <div className="space-y-2">{myTasks.map((task) => {
            const canRetryProof = task.status === 'in_progress' && task.completion_review_status === 'rejected';
            const showProofPanel = task.status === 'pending_review' || task.status === 'proof_submitted'
              || canRetryProof || (task.status === 'completed' && task.completion_ai_status === 'analyzed');
            return <article key={task.id} className="rounded-xl border border-gray-100 p-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-neutral-950">{task.titulo}</p>
                  <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${canRetryProof ? 'bg-red-50 text-red-700' : task.status === 'pending_review' ? 'bg-amber-50 text-amber-800' : 'bg-green-50 text-green-800'}`}>
                    {canRetryProof ? 'Comprovação recusada' : task.status === 'pending_review' ? 'Aguardando comprovação' : task.status === 'proof_submitted' ? 'Comprovação enviada' : task.status === 'completed' ? 'Tarefa concluída' : 'Em andamento'}
                  </span>
                </div>
                {task.status === 'in_progress' && !canRetryProof && <button onClick={() => finalizeTask(task.id)} className="shrink-0 rounded-lg bg-[#00a63e] px-3.5 py-2 text-[11px] font-semibold text-white hover:bg-[#008236]">Finalizar tarefa</button>}
              </div>
              {showProofPanel && <TaskProofUpload taskId={task.id} hasPhoto={Boolean(task.has_completion_photo)} canRetry={canRetryProof} rejectionReason={task.completion_review_note} onUploaded={() => { void fetchData(); }} />}
            </article>;
          })}</div>
        </section>}

        {isAdmin && showFormTask && (
          <div className="bg-white rounded-[14px] border border-gray-200 p-5 space-y-4 mb-5">
            <h3 className="text-[16px] text-neutral-950 font-semibold">
              Criar nova tarefa
            </h3>
            <p className="-mt-2 text-[12px] text-[#66736a]">Exemplo: 50 moedas + 50 XP. Ajuste os valores desta missão; o participante verá a recompensa antes de aceitá-la.</p>

            <div>
              <label className="text-[13px] text-[#4a5565] mb-1 block">Título</label>
              <input
                type="text"
                placeholder="Título"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#00a63e]"
              />
            </div>

            <div>
              <label className="text-[13px] text-[#4a5565] mb-1 block">Descrição</label>
              <textarea
                placeholder="Descrição"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#00a63e] min-h-16"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[13px] text-[#4a5565] mb-1 block">Categoria</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
                >
                  <option>Manutenção</option>
                  <option>Plantio</option>
                  <option>colheita</option>
                  <option>compostagem</option>
                </select>
              </div>

              <div>
                <label className="text-[13px] text-[#4a5565] mb-1 block">Dificuldade</label>
                <select
                  value={formData.dificuldade}
                  onChange={(e) => setFormData({ ...formData, dificuldade: Number(e.target.value) })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
                >
                  <option value={0}>Fácil</option>
                  <option value={1}>Médio</option>
                  <option value={2}>Difícil</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <label className="text-[13px] text-[#4a5565] mb-1 block">Moedas (recompensa)</label>
                <input
                  type="number"
                  placeholder="Moedas"
                  value={formData.moedas}
                  onChange={(e) => setFormData({ ...formData, moedas: Number(e.target.value) })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
                />
              </div>
              <div>
                <label className="text-[13px] text-[#4a5565] mb-1 block">XP ao concluir</label>
                <input
                  type="number"
                  min={0}
                  max={10000}
                  placeholder="XP"
                  value={formData.xp}
                  onChange={(e) => setFormData({ ...formData, xp: Number(e.target.value) })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
                />
              </div>
              <div>
                <label className="text-[13px] text-[#4a5565] mb-1 block">Mudas (recompensa)</label>
                <input
                  type="number"
                  placeholder="Mudas"
                  value={formData.mudas}
                  onChange={(e) => setFormData({ ...formData, mudas: Number(e.target.value) })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
                />
              </div>
              <div>
                <label className="text-[13px] text-[#4a5565] mb-1 block">Tempo (minutos)</label>
                <input
                  type="number"
                  placeholder="Tempo (min)"
                  value={formData.tempo}
                  onChange={(e) => setFormData({ ...formData, tempo: Number(e.target.value) })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSaveTask}
                disabled={isSavingTask}
                className="flex-1 bg-[#00a63e] text-white text-[14px] py-2 rounded-lg hover:bg-[#008236] disabled:opacity-70"
              >
                {isSavingTask ? 'Salvando...' : 'Salvar'}
              </button>
              <button
                onClick={() => {
                  setShowFormTask(false);
                  resetTaskForm();
                }}
                className="flex-1 bg-gray-200 text-[#4a5565] text-[14px] py-2 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="bg-white rounded-[14px] border border-gray-200 p-4 mb-5">
            <h3 className="text-[15px] font-semibold text-neutral-950 mb-3">Tarefas concluídas da sua horta</h3>
            <div className="space-y-2">
              {tarefasConcluidasHorta.length === 0 ? (
                <p className="text-[13px] text-[#717182]">Nenhuma tarefa concluída na horta ainda.</p>
              ) : (
                tarefasConcluidasHorta.slice(0, 8).map((task) => (
                  <div key={`done-${task.id}`} className="border-b border-gray-100 pb-2 last:border-b-0 last:pb-0">
                    <p className="text-[13px] text-neutral-950 font-medium">{task.titulo}</p>
                    <p className="text-[12px] text-[#717182]">
                      {task.perfil_nome || 'Sem perfil'} • {task.tipo} • +{task.xp} XP • +{task.moedas} moedas
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="space-y-5">
          {isLoadingTasks ? (
            <div className="flex justify-center py-8">
              <Loader className="size-5 animate-spin text-[#00a63e]" />
            </div>
          ) : visibleTasks.length === 0 ? (
            <div className="bg-white rounded-[14px] border border-gray-200 p-6 text-center">
              <p className="text-[16px] text-neutral-950 font-semibold mb-2">{tasks.length === 0 ? 'Sem tarefas disponíveis' : 'Nenhuma tarefa nesta situação'}</p>
              <p className="text-[14px] text-[#717182]">{tasks.length === 0 ? 'Volte mais tarde para ver novas tarefas.' : 'Escolha outro filtro para consultar tarefas.'}</p>
            </div>
          ) : (
            <>
            {!isAdmin && <div className="flex flex-col gap-2 rounded-xl border border-[#dce9d9] bg-[#f7fbf6] p-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[12px] font-semibold text-[#34453a]">Escolha como quer contribuir</p><p className="text-[10px] text-[#718075]">Filtre por categoria ou organize pelas recompensas.</p></div><div className="flex gap-2"><select aria-label="Filtrar por categoria" value={taskCategory} onChange={(event) => setTaskCategory(event.target.value)} className="min-w-0 rounded-lg border border-gray-200 bg-white px-2 py-2 text-[11px]">{taskCategories.map((category) => <option key={category}>{category}</option>)}</select><select aria-label="Ordenar tarefas" value={taskOrder} onChange={(event) => setTaskOrder(event.target.value as typeof taskOrder)} className="min-w-0 rounded-lg border border-gray-200 bg-white px-2 py-2 text-[11px]"><option value="recommended">Recomendadas</option><option value="xp">Mais XP</option><option value="easy">Mais fáceis</option></select></div></div>}
            {visibleTasks.map((task) => (
              <div
                key={task.id}
                id={isAdmin ? `admin-task-${task.id}` : undefined}
                className={`rounded-[14px] border bg-white p-6 transition-colors ${focusedTaskId === task.id ? 'border-[#00a63e] ring-2 ring-[#00a63e]/20' : 'border-gray-200'}`}
              >
                {editingId === task.id && isAdmin ? (
                  // EDIÇÃO INLINE
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[16px] font-semibold text-neutral-950">
                        Editar tarefa
                      </h3>

                      <button
                        onClick={() => {
                          setEditingId(null);
                          resetTaskForm();
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>

                    <div>
                      <label className="text-[13px] text-[#4a5565] mb-1 block">Título</label>
                      <input
                        type="text"
                        placeholder="Título"
                        value={formData.titulo}
                        onChange={(e) =>
                          setFormData({ ...formData, titulo: e.target.value })
                        }
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#00a63e]"
                      />
                    </div>

                    <div>
                      <label className="text-[13px] text-[#4a5565] mb-1 block">Descrição</label>
                      <textarea
                        placeholder="Descrição"
                        value={formData.descricao}
                        onChange={(e) =>
                          setFormData({ ...formData, descricao: e.target.value })
                        }
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#00a63e] min-h-16"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[13px] text-[#4a5565] mb-1 block">Categoria</label>
                        <select
                          value={formData.tipo}
                          onChange={(e) =>
                            setFormData({ ...formData, tipo: e.target.value })
                          }
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
                        >
                          <option>Manutenção</option>
                          <option>Plantio</option>
                          <option>colheita</option>
                          <option>compostagem</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[13px] text-[#4a5565] mb-1 block">Dificuldade</label>
                        <select
                          value={formData.dificuldade}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dificuldade: Number(e.target.value),
                            })
                          }
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
                        >
                          <option value={0}>Fácil</option>
                          <option value={1}>Médio</option>
                          <option value={2}>Difícil</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div>
                        <label className="text-[13px] text-[#4a5565] mb-1 block">Moedas (recompensa)</label>
                        <input
                          type="number"
                          placeholder="Moedas"
                          value={formData.moedas}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              moedas: Number(e.target.value),
                            })
                          }
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
                        />
                      </div>

                      <div>
                        <label className="text-[13px] text-[#4a5565] mb-1 block">XP ao concluir</label>
                        <input
                          type="number"
                          min={0}
                          max={10000}
                          placeholder="XP"
                          value={formData.xp}
                          onChange={(e) => setFormData({ ...formData, xp: Number(e.target.value) })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
                        />
                      </div>

                      <div>
                        <label className="text-[13px] text-[#4a5565] mb-1 block">Mudas (recompensa)</label>
                        <input
                          type="number"
                          placeholder="Mudas"
                          value={formData.mudas}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              mudas: Number(e.target.value),
                            })
                          }
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
                        />
                      </div>

                      <div>
                        <label className="text-[13px] text-[#4a5565] mb-1 block">Tempo (minutos)</label>
                        <input
                          type="number"
                          placeholder="Tempo (min)"
                          value={formData.tempo}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              tempo: Number(e.target.value),
                            })
                          }
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveTask}
                        disabled={isSavingTask}
                        className="flex-1 bg-[#00a63e] text-white text-[14px] py-2 rounded-lg hover:bg-[#008236] disabled:opacity-70"
                      >
                        {isSavingTask ? 'Salvando...' : 'Salvar alterações'}
                      </button>

                      <button
                        onClick={() => {
                          setEditingId(null);
                          resetTaskForm();
                        }}
                        className="flex-1 bg-gray-200 text-[#4a5565] text-[14px] py-2 rounded-lg"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  // VISUALIZAÇÃO NORMAL
                  <>
                    <div className="flex items-start justify-between mb-3 gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[16px] text-neutral-950">{task.titulo}</h3>
                        {isAdmin && <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getAdminTaskStatus(task).styles}`}>{getAdminTaskStatus(task).label}</span>}
                        {isAdmin && task.status === 'proof_submitted' && <div className="mt-1.5">
                          <button type="button" onClick={() => void loadAdminTaskLocation(task.id)} disabled={loadingLocationTaskId === task.id} className="text-[10px] font-semibold text-[#16803d] underline disabled:opacity-60">{loadingLocationTaskId === task.id ? 'Consultando localização…' : 'Consultar localização'}</button>
                          {adminTaskLocations[task.id] && <p className="mt-1 text-[10px] text-[#526056]">
                            {adminTaskLocations[task.id].status === 'validated' ? 'Validada' : adminTaskLocations[task.id].status === 'outside_radius' ? 'Fora do raio de 100 m' : adminTaskLocations[task.id].status === 'garden_location_missing' ? 'Coordenadas da horta ausentes' : 'Não disponível'}
                            {adminTaskLocations[task.id].distance_meters != null && ` · ${adminTaskLocations[task.id].distance_meters} m`}
                            {adminTaskLocations[task.id].latitude != null && adminTaskLocations[task.id].longitude != null && ` · ${Number(adminTaskLocations[task.id].latitude).toFixed(5)}, ${Number(adminTaskLocations[task.id].longitude).toFixed(5)}`}
                          </p>}
                        </div>}
                        {isAdmin && (task.status === 'proof_submitted' || (task.status === 'completed' && task.completion_ai_status === 'analyzed')) && <AdminTaskReview taskId={task.id} readOnly={task.status === 'completed'} onReviewed={() => { void fetchData(); }} />}
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="bg-[#f4f0ff] rounded-[10px] px-3 py-1.5 flex items-center gap-1">
                          <Award className="size-4 text-[#7953a9]" />
                          <span className="text-[15px] text-[#7953a9] font-bold">{task.xp}</span>
                          <span className="text-[10px] font-semibold text-[#7953a9]">XP</span>
                        </div>
                        <div className="bg-green-50 rounded-[10px] px-3 py-1.5 flex items-center gap-1">
                          <Sprout className="size-4 text-[#00a63e]" />
                          <span className="text-[16px] text-[#00a63e] font-bold">
                            {task.moedas}
                          </span>
                          <span className="text-[10px] font-semibold text-[#16803d]">moedas</span>
                        </div>

                        {isAdmin && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditTask(task)}
                              className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                              title="Editar"
                            >
                              <Edit2 className="size-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                              title="Deletar"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-[14px] text-[#717182] mb-4">
                      {task.descricao}
                    </p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-[14px] text-[#4a5565]">
                        <MapPin className="size-4" />
                        <span>{task.horta}</span>
                      </div>

                      <div className="flex items-center gap-2 text-[14px] text-[#4a5565]">
                        <Clock className="size-4" />
                        <span>{task.tempo} minutos</span>
                      </div>

                      <div className="flex gap-2">
                        <span className={`${getCategoryColor(task.tipo)} text-[12px] px-2.5 py-1 rounded-lg`}>
                          {task.tipo}
                        </span>

                        <span className={`${getDifficultyColor(task.dificuldade)} text-[12px] px-2.5 py-1 rounded-lg`}>
                          {['Fácil', 'Médio', 'Difícil'][task.dificuldade] || 'Fácil'}
                        </span>
                      </div>
                    </div>

                    {!isAdmin && (
                      <button
                        onClick={() => acceptTask(task.id)}
                        className="w-full bg-[#00a63e] text-white text-[14px] py-2.5 rounded-lg hover:bg-[#008236] transition-colors text-center"
                      >
                        Iniciar tarefa
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
