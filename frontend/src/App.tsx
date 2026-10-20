import { API_URL } from './config';
import { useState, useEffect, useRef } from 'react';
import { Home, ListTodo, Gift, User, Compass, LogOut } from 'lucide-react';
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
import OnboardingPage from './components/OnboardingPage';
import ExplorePage from './components/ExplorePage';
import PasswordResetPage from './components/PasswordResetPage';
import type { AdminNavigationIntent, AppPage } from './types/adminNavigation';

type Page = AppPage;

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
  const { token, user, isAdmin, isLoading, activeGarden, activeGardenId, availableGardens, selectGarden, logout } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const tasksReturnPage = useRef<Page>('home');
  const [adminNavigationIntent, setAdminNavigationIntent] = useState<AdminNavigationIntent | null>(null);

  const handleLogout = () => {
    logout();
    setAuthView('login');
    setCurrentPage('home');
    setAdminNavigationIntent(null);
  };

  const navigate = (page: Page, intent?: AdminNavigationIntent) => {
    const destination = page === 'explore' && isAdmin ? 'home' : page;
    if (destination === 'tasks' && currentPage !== 'tasks') tasksReturnPage.current = currentPage;
    setAdminNavigationIntent(intent || null);
    setCurrentPage(destination);
  };

  const returnFromTasks = () => {
    const destination = tasksReturnPage.current === 'explore' && isAdmin ? 'home' : tasksReturnPage.current;
    navigate(destination);
  };

  const hasGardenSelector = availableGardens.length > 1 || (activeGardenId != null && availableGardens.find((garden) => garden.id === activeGardenId)?.roles.length === 2);

  const [coins, setCoins] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const mobileNavItems = [
    { page: 'home' as Page, label: 'Início', icon: Home },
    ...(!isAdmin ? [{ page: 'explore' as Page, label: 'Explorar', icon: Compass }] : []),
    { page: 'tasks' as Page, label: 'Tarefas', icon: ListTodo },
    { page: 'rewards' as Page, label: 'Recompensas', icon: Gift },
    { page: 'profile' as Page, label: 'Perfil', icon: User },
  ];

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

  useEffect(() => {
    if (isAdmin && currentPage === 'explore') setCurrentPage('home');
  }, [isAdmin, currentPage]);

  useEffect(() => {
    if (user && availableGardens.length === 0 && currentPage !== 'explore') {
      setCurrentPage('explore');
      setAdminNavigationIntent(null);
    }
  }, [user, availableGardens.length, currentPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-[14px] text-[#4a5565]">Carregando...</p>
      </div>
    );
  }

  const resetToken = new URLSearchParams(window.location.search).get('resetToken');
  if (resetToken) return <PasswordResetPage token={resetToken} />;

  if (token && user && user.roles.length === 0 && currentPage !== 'explore') {
    return <><Toaster position="top-center" richColors /><OnboardingPage onExplore={() => setCurrentPage('explore')} /></>;
  }

  if (!token) {
    return <>
      <Toaster position="top-center" richColors />
      {authView === 'login'
        ? <LoginPage onSwitchToRegister={() => setAuthView('register')} />
        : <RegisterPage onSwitchToLogin={() => setAuthView('login')} />}
    </>;
  }

  return (
    <div className="relative min-h-screen bg-gray-50 lg:flex">
      <Toaster position="top-center" richColors />

      <Sidebar currentPage={currentPage} onNavigate={navigate} isAdmin={isAdmin} />

      <div className="w-full lg:ml-64">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 bg-white px-4 py-2.5 sm:px-6">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
          {hasGardenSelector && <>
          <label htmlFor="active-garden" className="text-[12px] font-medium text-[#526056]">Horta ativa</label>
          <select id="active-garden" value={activeGardenId ?? ''} onChange={(event) => { selectGarden(Number(event.target.value)); setCurrentPage('home'); setAdminNavigationIntent(null); }} className="max-w-[min(60vw,18rem)] rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12px] text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#00a63e]">
            {availableGardens.map((garden) => <option key={garden.id} value={garden.id}>{garden.nome}</option>)}
          </select>
          {activeGarden && availableGardens.find((garden) => garden.id === activeGardenId)?.roles.length === 2 && <div className="flex rounded-lg border border-gray-200 p-0.5" role="group" aria-label="Função ativa">
            {(['MEMBER', 'ADMIN'] as const).map((role) => <button key={role} type="button" aria-pressed={activeGarden.role === role} onClick={() => { selectGarden(activeGarden.id_horta, role); setCurrentPage('home'); setAdminNavigationIntent(null); }} className={`rounded-md px-3 py-1.5 text-[11px] font-semibold ${activeGarden.role === role ? 'bg-[#eaf7ed] text-[#16803d]' : 'text-[#718075] hover:bg-gray-50'}`}>{role === 'ADMIN' ? 'Administrador' : 'Participante'}</button>)}
          </div>}
          </>}
          </div>
          <button type="button" onClick={handleLogout} className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12px] font-semibold text-[#526056] transition hover:border-red-200 hover:bg-red-50 hover:text-[#9b3d34]" aria-label="Sair da conta"><LogOut className="size-4" />Sair</button>
        </div>
        <div className={`mx-auto w-full pb-24 lg:pb-8 ${isAdmin ? 'pt-0 lg:pt-10' : ''}`}>
          {currentPage === 'home' && (
            !activeGardenId
              ? <ExplorePage />
              : isAdmin
              ? <AdminHomePage onNavigate={navigate} />
              : <HomePage onNavigate={(page) => navigate(page)} />
          )}
          {currentPage === 'explore' && !isAdmin && <ExplorePage />}
          {currentPage === 'tasks' && (
            <TasksPage navigationIntent={adminNavigationIntent} onBack={returnFromTasks} />
          )}
          {currentPage === 'rewards' && (
            <RewardsPage navigationIntent={adminNavigationIntent} />
          )}
          {currentPage === 'profile' && (
            isAdmin
              ? <AdminProfilePage
                    onLogout={handleLogout}
                    editGardenOnOpen={adminNavigationIntent?.editGarden}
                  />
              : <ProfilePage
                  coins={coins}
                  tasksCompleted={tasksCompleted}
                  onLogout={handleLogout}
                  onNavigate={navigate}
                />
          )}
        </div>
      </div>

      {/* Bottom Navigation - inclui Explorar apenas para participantes */}
      <nav aria-label="Navegação principal" className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md border-t border-gray-200 bg-white shadow-[0_-4px_16px_#142b1a0d] pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="flex h-16 items-stretch">
          {mobileNavItems.map(({ page, label, icon: Icon }) => {
            const selected = currentPage === page;
            return (
              <button key={page} onClick={() => navigate(page)} aria-current={selected ? 'page' : undefined} className={`relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-0.5 pt-1 transition-colors ${selected ? 'text-[#008236]' : 'text-[#647067]'}`}>
                {selected && <span className="absolute inset-x-2 top-0 h-[3px] rounded-b-full bg-[#00a63e]" />}
                <Icon className={`size-5 shrink-0 ${selected ? 'stroke-[#00a63e]' : 'stroke-[#647067]'}`} />
                <span className="max-w-full truncate text-[9px] font-medium leading-3 min-[380px]:text-[10px]">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
