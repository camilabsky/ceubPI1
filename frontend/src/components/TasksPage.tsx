import { MapPin, Clock, Sprout, PlusCircle, Edit2, Trash2, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
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

interface Task {
  id: number;
  titulo: string;
  descricao: string;
  horta: string;
  tipo: string;
  dificuldade: number;
  moedas: number;
  mudas: number;
  tempo: number;
}

interface AdminTaskDone {
  id: number;
  titulo: string;
  tipo: string;
  horta: string;
  moedas: number;
  perfil_nome?: string;
}

export default function TasksPage() {
  const { token, user, isAdmin } = useAuth();
  const idPerfil = user?.id_perfil || 1;
  const idHorta = user?.roles.find((r) => r.role === 'ADMIN')?.id_horta || 1;

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [acceptedTaskTitle, setAcceptedTaskTitle] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  const [showFormTask, setShowFormTask] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSavingTask, setIsSavingTask] = useState(false);
  const [tarefasConcluidasHorta, setTarefasConcluidasHorta] = useState<AdminTaskDone[]>([]);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    tipo: 'Manutenção',
    dificuldade: 0,
    moedas: 50,
    mudas: 0,
    tempo: 30,
  });

  const fetchData = async () => {
    setIsLoadingTasks(true);
    try {
      const tasksResponse = await fetch('http://localhost:8080/tarefas_disponiveis');
      if (!tasksResponse.ok) {
        throw new Error('Falha ao carregar tarefas');
      }
      const tasksData = await tasksResponse.json();
      setTasks(tasksData);

      if (isAdmin && token) {
        const historyResponse = await fetch(
          `http://localhost:8080/admin/horta/historico?id_horta=${idHorta}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!historyResponse.ok) {
          throw new Error('Falha ao carregar tarefas concluidas da horta');
        }

        const historyData = await historyResponse.json();
        setTarefasConcluidasHorta(historyData.tarefas_concluidas_horta || []);
      } else {
        setTarefasConcluidasHorta([]);
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

  const acceptTask = async (idTarefa: number, idPerfilAtual: number) => {
    try {
      await fetch('http://localhost:8080/aceitar_tarefa', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_tarefa: idTarefa, id_perfil: idPerfilAtual }),
      });

      const accepted = tasks.find((task) => task.id === idTarefa);
      setAcceptedTaskTitle(accepted?.titulo || 'Tarefa');
      setShowConfirmDialog(true);
      await fetchData();
    } catch (error) {
      console.error('Error accepting task:', error);
      toast.error('Erro ao aceitar tarefa');
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
      mudas: 0,
      tempo: 30,
    });
  };

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
        ? `http://localhost:8080/admin/tarefas/${editingId}`
        : 'http://localhost:8080/admin/tarefas';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, id_horta: idHorta }),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar tarefa');
      }

      toast.success(editingId ? 'Tarefa atualizada' : 'Tarefa criada com sucesso');
      setShowFormTask(false);
      resetTaskForm();
      await fetchData();
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Erro ao salvar tarefa');
    } finally {
      setIsSavingTask(false);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!isAdmin || !token) return;
    if (!window.confirm('Tem certeza que deseja deletar esta tarefa?')) return;

    try {
      const response = await fetch(`http://localhost:8080/admin/tarefas/${id}`, {
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
      mudas: Number(task.mudas) || 0,
      tempo: Number(task.tempo) || 30,
    });
    setShowFormTask(true);
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

  return (
    <>
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-[90%] sm:max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">Tarefa Aceita! 🎉</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              <span className="block mb-2">&quot;{acceptedTaskTitle}&quot;</span>
              Agora está em <span className="text-[#00a63e]">Minhas Tarefas</span>. Boa sorte!
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[16px] text-neutral-950 px-2 font-bold">Tarefas Disponíveis</h1>
          <div className="flex items-center gap-2">
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
              <span className="text-[12px] text-neutral-950">{tasks.length} tarefas</span>
            </div>
          </div>
        </div>

        {isAdmin && showFormTask && (
          <div className="bg-white rounded-[14px] border border-gray-200 p-5 space-y-4 mb-5">
            <h3 className="text-[16px] text-neutral-950 font-semibold">
              {editingId ? 'Editar tarefa' : 'Criar nova tarefa'}
            </h3>

            <input
              type="text"
              placeholder="Título"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#00a63e]"
            />

            <textarea
              placeholder="Descrição"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#00a63e] min-h-16"
            />

            <div className="grid grid-cols-2 gap-3">
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
              >
                <option>Manutenção</option>
                <option>Plantio</option>
                <option>colheita</option>
                <option>compostagem</option>
              </select>

              <select
                value={formData.dificuldade}
                onChange={(e) => setFormData({ ...formData, dificuldade: Number(e.target.value) })}
                className="border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
              >
                <option value={0}>Fácil</option>
                <option value={1}>Médio</option>
                <option value={2}>Difícil</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <input
                type="number"
                placeholder="Moedas"
                value={formData.moedas}
                onChange={(e) => setFormData({ ...formData, moedas: Number(e.target.value) })}
                className="border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
              />
              <input
                type="number"
                placeholder="Mudas"
                value={formData.mudas}
                onChange={(e) => setFormData({ ...formData, mudas: Number(e.target.value) })}
                className="border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
              />
              <input
                type="number"
                placeholder="Tempo (min)"
                value={formData.tempo}
                onChange={(e) => setFormData({ ...formData, tempo: Number(e.target.value) })}
                className="border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
              />
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
                      {task.perfil_nome || 'Sem perfil'} • {task.tipo} • {task.moedas} moedas
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
          ) : tasks.length === 0 ? (
            <div className="bg-white rounded-[14px] border border-gray-200 p-6 text-center">
              <p className="text-[16px] text-neutral-950 font-semibold mb-2">Sem tarefas disponíveis</p>
              <p className="text-[14px] text-[#717182]">Volte mais tarde para ver novas tarefas.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-[14px] border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-3 gap-3">
                  <h3 className="text-[16px] text-neutral-950 flex-1">{task.titulo}</h3>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-50 rounded-[10px] px-3 py-1.5 flex items-center gap-1">
                      <Sprout className="size-4 text-[#00a63e]" />
                      <span className="text-[16px] text-[#00a63e] font-bold">{task.moedas}</span>
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

                <p className="text-[14px] text-[#717182] mb-4">{task.descricao}</p>

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

                <button
                  onClick={() => acceptTask(task.id, idPerfil)}
                  className="w-full bg-[#00a63e] text-white text-[14px] py-2.5 rounded-lg hover:bg-[#008236] transition-colors text-center"
                >
                  Aceitar Tarefa
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
