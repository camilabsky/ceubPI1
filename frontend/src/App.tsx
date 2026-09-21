import { API_URL } from './config';
import { useState, useEffect } from 'react';
import { Home, ListTodo, Gift, User } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import AdminHomePage from './components/AdminHomePage';
import TasksPage from './components/TasksPage';
import RewardsPage from './components/RewardsPage';
import ProfilePage from './components/ProfilePage';
import RegisterPage from './components/RegisterPage';
import AdminProfilePage from './components/AdminProfilePage';
import Sidebar from './components/Sidebar';

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

async function get_coins(id_perfil: Number, token: string) {
  const coins = await fetch(`${API_URL}/minhas_moedas`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ id_perfil })
  })
  if (!coins.ok) throw new Error('Falha ao buscar moedas');
  const c = await coins.json()
  return c.Saldo
}

async function get_number_of_completed_tasks(id_perfil: Number, token: string) {
  const tarefas_concluidas = await fetch(`${API_URL}/tarefas_concluidas`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ id_perfil })
  })
  if (!tarefas_concluidas.ok) throw new Error('Falha ao buscar tarefas concluidas');
  const t = await tarefas_concluidas.json()
  return t[0]?.Total ?? 0
}

export default function App() {
  const { token, user, isAdmin, isLoading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const [coins, setCoins] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);

  const fetchData = async () => {
    if (!user?.id_perfil) return;
    try {
      const [coinsData, completedData] = await Promise.all([
        get_coins(user.id_perfil, token!),
        get_number_of_completed_tasks(user.id_perfil, token!)
      ]);

      setCoins(coinsData);
      setTasksCompleted(completedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, user?.id_perfil]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-[14px] text-[#4a5565]">Carregando...</p>
      </div>
    );
  }

  if (!token) {
    return authView === 'login'
      ? <LoginPage onSwitchToRegister={() => setAuthView('register')} />
      : <RegisterPage onSwitchToLogin={() => setAuthView('login')} />;
  }

  return (
    <div className="relative min-h-screen bg-gray-50 lg:flex">
      <Toaster position="top-center" richColors />

      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} isAdmin={isAdmin} />

      <div className="w-full lg:ml-64">
        <div
          className={`mx-auto w-full pb-20 lg:pb-8 ${
            isAdmin ? 'max-w-none px-4 lg:px-6' : 'max-w-none px-4 sm:px-6 lg:px-8'
          } ${isAdmin ? 'pt-10' : ''}`}
        >
          {currentPage === 'home' && (
            isAdmin
              ? <AdminHomePage onNavigate={setCurrentPage} />
              : <HomePage onNavigate={setCurrentPage} />
          )}
          {currentPage === 'tasks' && (
            <TasksPage />
          )}
          {currentPage === 'rewards' && (
            <RewardsPage />
          )}
          {currentPage === 'profile' && (
            isAdmin
              ? <AdminProfilePage
                    onLogout={() => setCurrentPage('home')}
                  />
              : <ProfilePage
                  coins={coins}
                  tasksCompleted={tasksCompleted}
                  onLogout={() => setCurrentPage('home')}
                />
          )}
        </div>
      </div>

      {/* Bottom Navigation - só aparece em mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg max-w-md mx-auto">
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