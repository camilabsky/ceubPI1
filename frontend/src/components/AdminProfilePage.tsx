import { LayoutDashboard, LogOut, ClipboardList, Sprout, ShieldCheck } from 'lucide-react';
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

interface AdminProfilePageProps {
  onLogout?: () => void;
}

export default function AdminProfilePage({ onLogout }: AdminProfilePageProps) {
  const { logout, token, user } = useAuth();

  const [adminTasks, setAdminTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const authHeaders = () => ({ Authorization: `Bearer ${token}` });

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        const tasksRes = await fetch('http://localhost:8080/admin/tarefas', { headers: authHeaders() });
        if (!tasksRes.ok) throw new Error('Falha ao carregar tarefas da horta');
        const tasksData: Task[] = await tasksRes.json();
        setAdminTasks(tasksData);
      } catch (error) {
        console.error('Error fetching admin profile data:', error);
        toast.error('Erro ao carregar estatísticas da horta');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminData();
  }, [token]);

  const hortaNome = user?.roles.find((r) => r.role === 'ADMIN')?.horta_nome || 'sua horta';
  const pendentes = adminTasks.filter((t) => !t.concluido);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-4">
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-br from-[#00a63e] to-[#008236] rounded-[20px] p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="size-4 text-white/90" />
            <span className="text-white/90 text-[12px] font-semibold tracking-wide uppercase">
              Painel administrativo
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="size-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <LayoutDashboard className="size-7" />
            </div>
            <div>
              <h1 className="text-[20px] mb-1">{user?.nome || 'Admin'}</h1>
              <p className="text-white/90 text-[13px]">{hortaNome}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mb-6">
        <h2 className="text-[16px] text-neutral-950 mb-4 px-2">Estatísticas da horta</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-[14px] border border-gray-200 p-4 flex flex-col items-center">
            <ClipboardList className="size-6 text-[#f0b100] mb-2" />
            <p className="text-[24px] text-neutral-950 mb-1">{isLoading ? '-' : pendentes.length}</p>
            <p className="text-[11px] text-[#4a5565] text-center">Tarefas Pendentes</p>
          </div>
          <div className="bg-white rounded-[14px] border border-gray-200 p-4 flex flex-col items-center">
            <Sprout className="size-6 text-[#00a63e] mb-2" />
            <p className="text-[24px] text-neutral-950 mb-1">{isLoading ? '-' : adminTasks.length}</p>
            <p className="text-[11px] text-[#4a5565] text-center">Tarefas na Horta</p>
          </div>
        </div>
      </div>

      <div className="px-4 mb-6">
        <button
          onClick={() => {
            logout();
            onLogout?.();
          }}
          className="w-full bg-white border border-gray-200 rounded-[14px] py-3 px-4 flex items-center justify-center gap-2 text-[#4a5565]"
        >
          <LogOut className="size-5" />
          <span className="text-[14px]">Sair</span>
        </button>
      </div>
    </div>
  );
}