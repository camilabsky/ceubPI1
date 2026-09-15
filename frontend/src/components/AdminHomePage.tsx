import { ClipboardList, Sprout, LayoutDashboard, ChevronRight, Gift } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Task {
  id: number;
  titulo: string;
  tipo: string;
  dificuldade: number;
  moedas: number;
  concluido?: boolean;
}

interface AdminHomePageProps {
  onNavigate: (page: 'home' | 'tasks' | 'rewards' | 'profile') => void;
}

export default function AdminHomePage({ onNavigate }: AdminHomePageProps) {
  const { token, user } = useAuth();

  const [adminTasks, setAdminTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const authHeaders = () => ({ Authorization: `Bearer ${token}` });

  const fetchAdminData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const tasksRes = await fetch('http://localhost:8080/admin/tarefas', { headers: authHeaders() });
      if (!tasksRes.ok) {
        throw new Error('Falha ao carregar tarefas da horta');
      }
      const tasksData: Task[] = await tasksRes.json();
      setAdminTasks(tasksData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Erro ao carregar dados do painel');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [token]);

  const hortaNome = user?.roles.find((r) => r.role === 'ADMIN')?.horta_nome || 'sua horta';
  const pendentes = adminTasks.filter((t) => !t.concluido);

  const getDifficultyColor = (difficulty: number) => {
    const colors = ['bg-[#00c950]', 'bg-[#f0b100]', 'bg-[#fb2c36]'];
    return colors[difficulty] || colors[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-4">
      <div className="relative bg-gradient-to-br from-[#00a63e] to-[#008236] px-6 pt-12 pb-8 rounded-b-[20px]">
        <div className="flex items-center gap-2 mb-3">
          <LayoutDashboard className="size-4 text-white/90" />
          <span className="text-white/90 text-[12px] font-semibold tracking-wide uppercase">
            Painel administrativo
          </span>
        </div>
        <h1 className="text-white text-[24px] font-bold">{hortaNome}</h1>
        <p className="text-white/90 text-[16px] mt-1">Acompanhe o andamento das tarefas</p>
      </div>

      <div className="px-4 mt-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-[14px] border border-gray-200 p-4">
            <div className="size-9 rounded-full bg-amber-50 flex items-center justify-center mb-3">
              <ClipboardList className="size-5 text-[#f0b100]" />
            </div>
            <p className="text-[22px] text-neutral-950 font-bold leading-none">{pendentes.length}</p>
            <p className="text-[12px] text-[#4a5565] mt-1">Tarefas pendentes</p>
          </div>
          <div className="bg-white rounded-[14px] border border-gray-200 p-4">
            <div className="size-9 rounded-full bg-green-50 flex items-center justify-center mb-3">
              <Sprout className="size-5 text-[#00a63e]" />
            </div>
            <p className="text-[22px] text-neutral-950 font-bold leading-none">{adminTasks.length}</p>
            <p className="text-[12px] text-[#4a5565] mt-1">Tarefas na horta</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-5">
        <h2 className="text-[15px] text-neutral-950 font-semibold mb-3 px-1">Ações rápidas</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate('tasks')}
            className="bg-white rounded-[14px] border border-gray-200 p-4 flex flex-col items-center gap-2 hover:border-[#00a63e] hover:shadow-sm transition-all"
          >
            <div className="size-10 rounded-full bg-green-50 flex items-center justify-center">
              <ClipboardList className="size-5 text-[#00a63e]" />
            </div>
            <span className="text-[13px] text-neutral-950 font-medium">Gerenciar tarefas</span>
          </button>
          <button
            onClick={() => onNavigate('rewards')}
            className="bg-white rounded-[14px] border border-gray-200 p-4 flex flex-col items-center gap-2 hover:border-[#00a63e] hover:shadow-sm transition-all"
          >
            <div className="size-10 rounded-full bg-green-50 flex items-center justify-center">
              <Gift className="size-5 text-[#00a63e]" />
            </div>
            <span className="text-[13px] text-neutral-950 font-medium">Gerenciar recompensas</span>
          </button>
        </div>
      </div>

      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-[15px] text-neutral-950 font-semibold"></h2>
        </div>

        {isLoading ? null : pendentes.length === 0 ? (
          <div className="bg-white rounded-[14px] border border-gray-200 p-6 text-center">
            <p className="text-[14px] text-[#717182]">Nenhuma tarefa pendente no momento</p>
          </div>
        ) : (
          <div className="space-y-2">
          </div>
        )}
      </div>
    </div>
  );
}