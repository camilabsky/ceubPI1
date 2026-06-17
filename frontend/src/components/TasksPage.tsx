import { MapPin, Clock, Sprout, PlusCircle } from 'lucide-react';
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

interface Task {
  id: number;
  title: string;
  description: string;
  location: string;
  duration: string;
  category: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  coins: number;
  status: 'available' | 'in-progress' | 'completed';
  progress?: number;
}

async function get_tasks(): Taks[]{
  const tasks = await fetch("http://localhost:8080/tarefas_disponiveis")
  return await tasks.json()
}

interface TasksPageProps {
  onCreateTask: () => void;
}

export default function TasksPage({ onCreateTask }: TasksPageProps) {
  const id_perfil = 1;
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [acceptedTaskTitle, setAcceptedTaskTitle] = useState('');
  const [tasks, setTasks] = useState([])

  const fetchData = async () => {
    try {
      console.log("aqui")
      const [tasksData] = await Promise.all([get_tasks()]);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const acceptTask = async (id_tarefa: Number, id_perfil: Number) => {
    try {
      await fetch("http://localhost:8080/aceitar_tarefa", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_tarefa, id_perfil })
      });
      await fetchData();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const getDifficultyColor = (difficulty: Number) => {
    const colors = [
      'bg-[#00c950] text-white font-semibold',
      'bg-[#f0b100] text-white font-semibold',
      'bg-[#fb2c36] text-white font-semibold'
    ]
    return colors[difficulty]
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Manutenção':
        return 'bg-[#eceef2] text-[#030213]';
      case 'Compostagem':
        return 'bg-[#424141] text-[#fbfbfb]';
      case 'Plantio':
        return 'bg-[#030213] text-white';
      case 'Colheita':
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
            <AlertDialogTitle className="text-center">
              Tarefa Aceita! 🎉
            </AlertDialogTitle>
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
            <button
              onClick={onCreateTask}
              className="inline-flex items-center gap-1.5 bg-[#00a63e] text-white text-[12px] px-3 py-2 rounded-lg hover:bg-[#008236] transition-colors"
            >
              <PlusCircle className="size-4" />
              Nova tarefa
            </button>
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-1">
              <span className="text-[12px] text-neutral-950">{tasks.length} tarefas</span>
            </div>
          </div>
        </div>

      <div className="space-y-5">
        {/* Available Tasks */}
        {tasks.length === 0 ? (
          <div className="bg-white rounded-[14px] border border-gray-200 p-6 text-center">
            <p className="text-[16px] text-neutral-950 font-semibold mb-2">Sem tarefas disponiveis</p>
            <p className="text-[14px] text-[#717182]">Volte mais tarde para ver novas tarefas.</p>
          </div>
        ) : tasks.map(task => (
          <div key={task.id} className="bg-white rounded-[14px] border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-[16px] text-neutral-950 flex-1 pt-[5px] pr-[0px] pb-[0px] pl-[0px]">{task.titulo}</h3>
              <div className="bg-green-50 rounded-[10px] px-3 py-1.5 flex items-center gap-1">
                <Sprout className="size-4 text-[#00a63e]" />
                <span className="text-[16px] text-[#00a63e] font-bold">{task.moedas}</span>
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
                  {["Fácil", "Médio", "Difícil"][task.dificuldade]}
                </span>
              </div>
            </div>

            <button
              onClick={() => acceptTask(task.id, id_perfil)}
              className="w-full bg-[#00a63e] text-white text-[14px] py-2.5 rounded-lg hover:bg-[#008236] transition-colors text-center"
            >
              Aceitar Tarefa
            </button>
          </div>
        ))}
      </div>
      </div>
    </>
  );
}
