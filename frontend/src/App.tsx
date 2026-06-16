import { useState, useEffect } from 'react';
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

async function get_tasks(): Taks[]{
  const tasks = await fetch("http://localhost:8080/tarefas_disponiveis")
  return await tasks.json()
}

async function get_coins(id_perfil: Number){
  const coins = await fetch("http://localhost:8080/minhas_moedas", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id_perfil})
  })
  return await coins.json().Saldo
}

async function get_number_of_completed_tasks(id_perfil: Number){
  const tarefas_concluidas = await fetch("http://localhost:8080/tarefas_concluidas", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id_perfil})
  })
  return await tarefas_concluidas.json().Total
}

export default function App() {
  const user_id = 1;
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [coins, setCoins] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksData, coinsData, completedData] = await Promise.all([
          get_tasks(),
          get_coins(user_id),
          get_number_of_completed_tasks(user_id)
        ]);

        setTasks(tasksData);
        setCoins(coinsData);
        setTasksCompleted(completedData);
        console.log(tasksData, coinsData, completedData)
      } catch (error) {
        console.error('Error fetching data:', error);
        // Optionally set error state here
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50 mx-auto max-w-md">
      <Toaster position="top-center" richColors />
      {/* Main Content */}
      <div className="pb-20">
        {currentPage === 'home' && (
          <HomePage
            coins={coins}
            tasksCompleted={tasksCompleted}
            tasks={tasks}
            onNavigate={setCurrentPage}
            onUpdateTasks={setTasks}
            onTaskComplete={completeTask}
          />
        )}
        {currentPage === 'tasks' && (
          <TasksPage
            tasks={tasks}
            onUpdateTasks={setTasks}
            onTaskComplete={completeTask}
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
