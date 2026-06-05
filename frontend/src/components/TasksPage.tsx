import { MapPin, Clock, Sprout } from 'lucide-react';
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

interface TasksPageProps {
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
  onTaskComplete: () => void;
  onCoinsEarned: (amount: number) => void;
}

export default function TasksPage({ tasks, onUpdateTasks, onTaskComplete, onCoinsEarned }: TasksPageProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [acceptedTaskTitle, setAcceptedTaskTitle] = useState('');

  const acceptTask = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setAcceptedTaskTitle(task.title);
    }
    
    onUpdateTasks(
      tasks.map(task =>
        task.id === taskId ? { ...task, status: 'in-progress' as const, progress: 0 } : task
      )
    );
    
    setShowConfirmDialog(true);
  };



  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil':
        return 'bg-[#00c950] text-white font-semibold';
      case 'Médio':
        return 'bg-[#f0b100] text-white font-semibold';
      case 'Difícil':
        return 'bg-[#fb2c36] text-white font-semibold';
      default:
        return 'bg-gray-500 text-white font-semibold';
    }
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

  const availableTasks = tasks.filter(t => t.status === 'available');

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
          <div className="bg-white border border-gray-200 rounded-lg px-3 py-1">
            <span className="text-[12px] text-neutral-950">{availableTasks.length} tarefas</span>
          </div>
        </div>

      <div className="space-y-5">
        {/* Available Tasks */}
        {availableTasks.map(task => (
          <div key={task.id} className="bg-white rounded-[14px] border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-[16px] text-neutral-950 flex-1 pt-[5px] pr-[0px] pb-[0px] pl-[0px]">{task.title}</h3>
              <div className="bg-green-50 rounded-[10px] px-3 py-1.5 flex items-center gap-1">
                <Sprout className="size-4 text-[#00a63e]" />
                <span className="text-[16px] text-[#00a63e] font-bold">{task.coins}</span>
              </div>
            </div>

            <p className="text-[14px] text-[#717182] mb-4">{task.description}</p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-[14px] text-[#4a5565]">
                <MapPin className="size-4" />
                <span>{task.location}</span>
              </div>

              <div className="flex items-center gap-2 text-[14px] text-[#4a5565]">
                <Clock className="size-4" />
                <span>{task.duration}</span>
              </div>

              <div className="flex gap-2">
                <span className={`${getCategoryColor(task.category)} text-[12px] px-2.5 py-1 rounded-lg`}>
                  {task.category}
                </span>
                <span className={`${getDifficultyColor(task.difficulty)} text-[12px] px-2.5 py-1 rounded-lg`}>
                  {task.difficulty}
                </span>
              </div>
            </div>

            <button
              onClick={() => acceptTask(task.id)}
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
