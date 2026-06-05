import { useState } from 'react';
import { Home, ListTodo, Gift, User } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import HomePage from './components/HomePage';
import TasksPage from './components/TasksPage';
import RewardsPage from './components/RewardsPage';
import ProfilePage from './components/ProfilePage';

type Page = 'home' | 'tasks' | 'rewards' | 'profile';

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

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [coins, setCoins] = useState(450);
  const [level, setLevel] = useState(7);
  const [daysWorked, setDaysWorked] = useState(5);
  const [tasksCompleted, setTasksCompleted] = useState(24);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Preparar composto orgânico',
      description: 'Preparar nova leva de composto com resíduos orgânicos',
      location: 'Jardim da Praça Verde',
      duration: '2h',
      category: 'Compostagem',
      difficulty: 'Difícil',
      coins: 150,
      status: 'in-progress',
      progress: 60,
    },
    {
      id: 2,
      title: 'Regar plantas da seção A',
      description: 'Realizar a rega das plantas na seção A do jardim durante a manhã',
      location: 'Horta Comunitária Centro',
      duration: '30 min',
      category: 'Manutenção',
      difficulty: 'Fácil',
      coins: 50,
      status: 'available',
    },
    {
      id: 3,
      title: 'Capinar canteiro de tomates',
      description: 'Remover ervas daninhas do canteiro de tomates',
      location: 'Jardim da Praça Verde',
      duration: '1h',
      category: 'Manutenção',
      difficulty: 'Médio',
      coins: 80,
      status: 'available',
    },
    {
      id: 4,
      title: 'Plantar mudas de alface',
      description: 'Plantar 20 mudas de alface na área designada',
      location: 'Horta Comunitária Centro',
      duration: '1h 30min',
      category: 'Plantio',
      difficulty: 'Médio',
      coins: 120,
      status: 'available',
    },
    {
      id: 5,
      title: 'Colher vegetais maduros',
      description: 'Fazer a colheita dos vegetais que estão prontos',
      location: 'Horta Orgânica Vila Nova',
      duration: '45 min',
      category: 'Colheita',
      difficulty: 'Fácil',
      coins: 100,
      status: 'available',
    },
  ]);

  const addCoins = (amount: number) => {
    setCoins(prev => prev + amount);
  };

  const removeCoins = (amount: number) => {
    if (coins >= amount) {
      setCoins(prev => prev - amount);
      return true;
    }
    return false;
  };

  const completeTask = () => {
    setTasksCompleted(prev => prev + 1);
    // Level up logic
    if ((tasksCompleted + 1) % 10 === 0) {
      setLevel(prev => prev + 1);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 mx-auto max-w-md">
      <Toaster position="top-center" richColors />
      {/* Main Content */}
      <div className="pb-20">
        {currentPage === 'home' && (
          <HomePage
            coins={coins}
            level={level}
            daysWorked={daysWorked}
            tasksCompleted={tasksCompleted}
            tasks={tasks}
            onNavigate={setCurrentPage}
            onUpdateTasks={setTasks}
            onCoinsEarned={addCoins}
            onTaskComplete={completeTask}
          />
        )}
        {currentPage === 'tasks' && (
          <TasksPage
            tasks={tasks}
            onUpdateTasks={setTasks}
            onTaskComplete={completeTask}
            onCoinsEarned={addCoins}
          />
        )}
        {currentPage === 'rewards' && (
          <RewardsPage
            coins={coins}
            onRedeem={removeCoins}
          />
        )}
        {currentPage === 'profile' && (
          <ProfilePage
            coins={coins}
            level={level}
            daysWorked={daysWorked}
            tasksCompleted={tasksCompleted}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg max-w-md mx-auto">
        <div className="flex items-center justify-around h-[70px]">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex flex-col items-center justify-center gap-1 min-w-[80px]"
          >
            <Home
              className={`size-6 ${
                currentPage === 'home' ? 'fill-[#00a63e] stroke-[#00a63e]' : 'stroke-[#4a5565]'
              }`}
            />
            <span
              className={`text-[12px] ${
                currentPage === 'home' ? 'text-[#00a63e]' : 'text-[#4a5565]'
              }`}
            >
              Início
            </span>
          </button>

          <button
            onClick={() => setCurrentPage('tasks')}
            className="flex flex-col items-center justify-center gap-1 min-w-[80px]"
          >
            <ListTodo
              className={`size-6 ${
                currentPage === 'tasks' ? 'fill-[#00a63e] stroke-[#00a63e]' : 'stroke-[#4a5565]'
              }`}
            />
            <span
              className={`text-[12px] ${
                currentPage === 'tasks' ? 'text-[#00a63e]' : 'text-[#4a5565]'
              }`}
            >
              Tarefas
            </span>
          </button>

          <button
            onClick={() => setCurrentPage('rewards')}
            className="flex flex-col items-center justify-center gap-1 min-w-[80px]"
          >
            <Gift
              className={`size-6 ${
                currentPage === 'rewards' ? 'fill-[#00a63e] stroke-[#00a63e]' : 'stroke-[#4a5565]'
              }`}
            />
            <span
              className={`text-[12px] ${
                currentPage === 'rewards' ? 'text-[#00a63e]' : 'text-[#4a5565]'
              }`}
            >
              Recompensas
            </span>
          </button>

          <button
            onClick={() => setCurrentPage('profile')}
            className="flex flex-col items-center justify-center gap-1 min-w-[80px]"
          >
            <User
              className={`size-6 ${
                currentPage === 'profile' ? 'fill-[#00a63e] stroke-[#00a63e]' : 'stroke-[#4a5565]'
              }`}
            />
            <span
              className={`text-[12px] ${
                currentPage === 'profile' ? 'text-[#00a63e]' : 'text-[#4a5565]'
              }`}
            >
              Perfil
            </span>
          </button>
        </div>
        {currentPage === 'home' && (
          <div className="absolute top-[-4px] left-0 h-1 w-1/4 bg-[#00a63e]" />
        )}
        {currentPage === 'tasks' && (
          <div className="absolute top-[-4px] left-1/4 h-1 w-1/4 bg-[#00a63e]" />
        )}
        {currentPage === 'rewards' && (
          <div className="absolute top-[-4px] left-1/2 h-1 w-1/4 bg-[#00a63e]" />
        )}
        {currentPage === 'profile' && (
          <div className="absolute top-[-4px] left-3/4 h-1 w-1/4 bg-[#00a63e]" />
        )}
      </nav>
    </div>
  );
}
