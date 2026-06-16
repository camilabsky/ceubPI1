import { Trophy, Calendar, TrendingUp, Sprout, Play, Check } from 'lucide-react';
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

interface HomePageProps {
  coins: number;
  tasksCompleted: number;
  tasks: Task[];
  onNavigate: (page: 'home' | 'tasks' | 'rewards' | 'profile') => void;
  onUpdateTasks: (tasks: Task[]) => void;
  onTaskComplete: () => void;
}
async function get_tasks(id_perfil): Taks[]{
  const tasks = await fetch("http://localhost:8080/minhas_tarefas", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id_perfil})
  })
  return await tasks.json()
}
function completeTask(id_tarefa: Number){
  fetch("http://localhost:8080/concluir_tarefa", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id_tarefa})
  })
}


export default function HomePage({ coins, tasksCompleted, tasks, onNavigate, onUpdateTasks, onTaskComplete }: HomePageProps) {
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [completedTaskInfo, setCompletedTaskInfo] = useState({ title: '', coins: 0 });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksData] = await Promise.all([get_tasks(1)]);

        setInProgressTasks(tasksData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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

  const getDifficultyColor = (difficulty: Number) => {
    const colors = [
      'bg-[#00c950] text-white font-semibold',
      'bg-[#f0b100] text-white font-semibold',
      'bg-[#fb2c36] text-white font-semibold'
    ]
    return colors[difficulty]
  };

  const continueTask = (taskId: number) => {
    completeTask(taskId);
  };

  return (
    <>
      <AlertDialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <AlertDialogContent className="max-w-[90%] sm:max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">
              Tarefa Concluída! 🎉
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              <span className="block mb-3">&quot;{completedTaskInfo.title}&quot;</span>
              <div className="bg-green-50 rounded-xl p-4 inline-flex items-center gap-2">
                <Sprout className="size-6 text-[#00a63e]" />
                <span className="text-[24px] text-[#00a63e] font-bold">+{completedTaskInfo.coins}</span>
                <span className="text-[16px] text-[#00a63e]">moedas</span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button 
              onClick={() => setShowCompletionDialog(false)}
              className="w-full bg-[#00a63e] hover:bg-[#008236]"
            >
              Ótimo!
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="min-h-screen bg-gray-50 pb-4">
      {/* Hero Section */}
      <div
        className="relative bg-gradient-to-br from-[#00a63e] to-[#008236] px-6 pt-12 pb-8 rounded-b-[20px]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 166, 62, 0.9), rgba(0, 130, 54, 0.9)), url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h100v100H0z\' fill=\'%23000\' fill-opacity=\'.05\'/%3E%3C/svg%3E")',
        }}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-white/90 text-[24px] mb-1">Olá,</p>
            <h1 className="text-white text-[24px] font-bold">Maria Silva!</h1>
            <p className="text-white/90 text-[24px] mt-1">Continue cultivando sua comunidade</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2">
            <Sprout className="size-5 text-white" />
            <span className="text-white text-[16px] font-bold">{coins}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-[14px] border border-gray-200 p-4 flex flex-col items-center">
            <TrendingUp className="size-6 text-[#00a63e] mb-2" />
            <p className="text-[11px] text-[#4a5565] text-center mb-1">Tarefas Completas</p>
            <p className="text-[18px] text-neutral-950">{tasksCompleted}</p>
          </div>
        </div>
      </div>

      {/* My Tasks Section */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-[16px] text-neutral-950">Minhas Tarefas</h2>
          <button
            onClick={() => onNavigate('tasks')}
            className="text-[14px] text-[#00a63e]"
          >
            Ver todas
          </button>
        </div>
        
        {inProgressTasks.length === 0 ? (
          <div className="bg-white rounded-[14px] border border-gray-200 p-6 text-center">
            <p className="text-[14px] text-[#717182]">Você não tem tarefas em andamento</p>
            <button
              onClick={() => onNavigate('tasks')}
              className="mt-3 text-[14px] text-[#00a63e]"
            >
              Ver tarefas disponíveis
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {inProgressTasks.map(task => (
              <div key={task.id} className="bg-white rounded-[14px] border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-[16px] text-neutral-950 flex-1">{task.titulo}</h3>
                  <div className="bg-green-50 rounded-[10px] px-3 py-1.5 flex items-center gap-1">
                    <Sprout className="size-4 text-[#00a63e]" />
                    <span className="text-[16px] text-[#00a63e] font-bold">{task.moedas}</span>
                  </div>
                </div>

                <div className="flex gap-2 mb-3">
                  <span className={`${getCategoryColor(task.tipo)} text-[12px] px-2.5 py-1 rounded-lg`}>
                    {task.tipo}
                  </span>
                  <span className={`${getDifficultyColor(task.dificuldade)} text-[11px] px-2.5 py-1 rounded-lg`}>
                  {["Fácil", "Médio", "Difícil"][task.dificuldade]}
                  </span>
                </div>

                <button
                  onClick={() => continueTask(task.id)}
                  className="w-full bg-[#00a63e] text-white text-[14px] py-2.5 rounded-lg hover:bg-[#008236] transition-colors flex items-center justify-center gap-2"
                >
                  {task.progress === 100 ? (
                    <>
                      <Check className="size-4" />
                      Finalizar Tarefa
                    </>
                  ) : (
                    <>
                      <Play className="size-4" />
                      Continuar Tarefa
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rewards Preview */}

      </div>
    </>
  );
}
