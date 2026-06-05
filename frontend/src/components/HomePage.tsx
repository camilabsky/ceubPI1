import { Trophy, Calendar, TrendingUp, Sprout, Play, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
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
  level: number;
  daysWorked: number;
  tasksCompleted: number;
  tasks: Task[];
  onNavigate: (page: 'home' | 'tasks' | 'rewards' | 'profile') => void;
  onUpdateTasks: (tasks: Task[]) => void;
  onCoinsEarned: (amount: number) => void;
  onTaskComplete: () => void;
}

export default function HomePage({ coins, level, daysWorked, tasksCompleted, tasks, onNavigate, onUpdateTasks, onCoinsEarned, onTaskComplete }: HomePageProps) {
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [completedTaskInfo, setCompletedTaskInfo] = useState({ title: '', coins: 0 });

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil':
        return 'bg-[#00c950] text-white';
      case 'Médio':
        return 'bg-[#f0b100] text-white';
      case 'Difícil':
        return 'bg-[#fb2c36] text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const continueTask = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      onUpdateTasks(
        tasks.map(t =>
          t.id === taskId ? { ...t, progress: Math.min((t.progress || 0) + 20, 100) } : t
        )
      );
      
      if ((task.progress || 0) + 20 >= 100) {
        setTimeout(() => {
          completeTask(taskId);
        }, 500);
      } else {
        toast.success('Progresso atualizado!');
      }
    }
  };

  const completeTask = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setCompletedTaskInfo({ title: task.title, coins: task.coins });
      onUpdateTasks(tasks.filter(t => t.id !== taskId));
      onTaskComplete();
      onCoinsEarned(task.coins);
      setShowCompletionDialog(true);
    }
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

          <div className="bg-white rounded-[14px] border border-gray-200 p-4 flex flex-col items-center">
            <Calendar className="size-6 text-[#155DFC] mb-2" />
            <p className="text-[11px] text-[#4a5565] text-center mb-1">Dias Trabalhados</p>
            <p className="text-[18px] text-neutral-950">{daysWorked}</p>
          </div>

          <div className="bg-white rounded-[14px] border border-gray-200 p-4 flex flex-col items-center">
            <Trophy className="size-6 text-[#9810FA] mb-2" />
            <p className="text-[11px] text-[#4a5565] text-center mb-1">Nível Atual</p>
            <p className="text-[18px] text-neutral-950">{level}</p>
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
                  <h3 className="text-[16px] text-neutral-950 flex-1">{task.title}</h3>
                  <div className="bg-green-50 rounded-[10px] px-3 py-1.5 flex items-center gap-1">
                    <Sprout className="size-4 text-[#00a63e]" />
                    <span className="text-[16px] text-[#00a63e] font-bold">{task.coins}</span>
                  </div>
                </div>

                <div className="flex gap-2 mb-3">
                  <span className={`${getCategoryColor(task.category)} text-[12px] px-2.5 py-1 rounded-lg`}>
                    {task.category}
                  </span>
                  <span className={`${getDifficultyColor(task.difficulty)} text-[11px] px-2.5 py-1 rounded-lg`}>
                    {task.difficulty}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] text-[#4a5565]">Progresso</span>
                    <span className="text-[12px] text-[#4a5565]">{task.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#030213] h-full transition-all duration-500"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
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
