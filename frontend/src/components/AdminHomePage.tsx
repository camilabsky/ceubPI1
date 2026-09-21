import { API_URL } from '../config';
import { ClipboardList, Sprout, LayoutDashboard, Gift, Bell, User as UserIcon, Settings, ArrowRight, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { HortaMap } from './HortaMap';

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
  const [recompensasResgatadas, setRecompensasResgatadas] = useState<any[]>([]);

  

  const authHeaders = () => ({ Authorization: `Bearer ${token}` });
  const idHorta = user?.roles.find((r) => r.role === 'ADMIN')?.id_horta || 1;

  const fetchAdminData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const tasksRes = await fetch(`${API_URL}/admin/tarefas`, { headers: authHeaders() });
      if (!tasksRes.ok) {
        throw new Error('Falha ao carregar tarefas da horta');
      }
      const tasksData: Task[] = await tasksRes.json();
      setAdminTasks(tasksData);

      const historyRes = await fetch(
        `${API_URL}/admin/horta/historico?id_horta=${idHorta}`,
        { headers: authHeaders() }
      );
      if (!historyRes.ok) {
        throw new Error('Falha ao carregar historico da horta');
      }
      const historyData = await historyRes.json();
      setRecompensasResgatadas(historyData.recompensas_resgatadas_horta || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Erro ao carregar dados do painel');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [token, idHorta]);

  const hortaNome = user?.roles.find((r) => r.role === 'ADMIN')?.horta_nome || 'sua horta';
  const hortaAdmin = user?.roles.find((r) => r.role === 'ADMIN');
  const pendentes = adminTasks.filter((t) => !t.concluido);
  const concluidas = adminTasks.filter((t) => t.concluido);
  const totalTasks = adminTasks.length;
  const progresso = totalTasks > 0 ? Math.round((concluidas.length / totalTasks) * 100) : 0;
  const proximasTarefas = pendentes.slice(0, 3);

  // Anel de progresso via SVG puro (sem lib externa)
  const raio = 40;
  const circunferencia = 2 * Math.PI * raio;
  const offset = circunferencia - (progresso / 100) * circunferencia;

  return (
    <div className="min-h-screen bg-gray-50 pb-4">
      {/* Topo: sino + avatar */}
      <div className="flex items-center justify-end gap-3 px-4 lg:px-6 pt-6">
        <button
          onClick={() => toast.info('Notificações chegam em breve')}
          className="size-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-[#00a63e] transition-colors"
        >
          <Bell className="size-4 text-[#4a5565]" />
        </button>
        <div className="size-9 rounded-full bg-[#00a63e] flex items-center justify-center">
          <UserIcon className="size-4 text-white" />
        </div>
      </div>

      <div className="px-4 lg:px-6 mt-2 grid lg:grid-cols-[2fr_1fr] gap-5">
        {/* ===== COLUNA ESQUERDA ===== */}
        <div className="space-y-5">
          {/* Boas-vindas + banner motivacional */}
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <LayoutDashboard className="size-4 text-[#00a63e]" />
                <span className="text-[#00a63e] text-[12px] font-semibold tracking-wide uppercase">
                  Painel administrativo
                </span>
              </div>
              <p className="text-[13px] text-[#4a5565]">Bem-vindo de volta,</p>
              <h1 className="text-neutral-950 text-[22px] font-bold">{hortaNome}</h1>
            </div>
            <div className="flex-1 bg-green-50 border border-green-100 rounded-[14px] p-4 flex items-center gap-3">
              <Sprout className="size-6 text-[#00a63e] shrink-0" />
              <div>
                <p className="text-[13px] font-semibold text-[#008236]">Seu trabalho faz a diferença!</p>
                <p className="text-[11px] text-[#4a5565] mt-0.5">
                  Cada tarefa concluída contribui para uma horta mais forte e sustentável.
                </p>
              </div>
            </div>
          </div>

          {/* Cards de estatística */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
              <p className="text-[22px] text-neutral-950 font-bold leading-none">{totalTasks}</p>
              <p className="text-[12px] text-[#4a5565] mt-1">Tarefas na horta</p>
            </div>
            <div className="bg-white rounded-[14px] border border-gray-200 p-4 opacity-60">
              <div className="size-9 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <Sprout className="size-5 text-blue-500" />
              </div>
              <p className="text-[22px] text-neutral-950 font-bold leading-none">—</p>
              <p className="text-[12px] text-[#4a5565] mt-1">Mudas disponíveis</p>
            </div>
            <div className="bg-white rounded-[14px] border border-gray-200 p-4">
              <div className="size-9 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                <Gift className="size-5 text-purple-500" />
              </div>
              <p className="text-[22px] text-neutral-950 font-bold leading-none">{recompensasResgatadas.length}</p>
              <p className="text-[12px] text-[#4a5565] mt-1">Recompensas resgatadas</p>
            </div>
          </div>

          {/* Banner "Painel administrativo" */}
          <div className="relative rounded-[20px] overflow-hidden bg-gradient-to-br from-[#00a63e] to-[#008236] p-6 flex items-center justify-between">
            <div>
              <p className="text-white/80 text-[12px]">Painel administrativo</p>
              <p className="text-white text-[18px] font-bold mt-1">{hortaNome}</p>
              <p className="text-white/80 text-[12px] mt-1">Acompanhe o andamento das tarefas, recompensas e muito mais.</p>
            </div>
            <button
              onClick={() => onNavigate('tasks')}
              className="hidden sm:flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-[13px] font-medium px-4 py-2 rounded-full hover:bg-white/30 transition-colors shrink-0"
            >
              Ver detalhes <ArrowRight className="size-4" />
            </button>
          </div>
          
          {/* Mapa da horta */}
          <div className="bg-white rounded-[14px] border border-gray-200 p-4">
            <h2 className="text-[15px] text-neutral-950 font-semibold mb-3">Localização da horta</h2>
            <HortaMap
              latitude={hortaAdmin?.latitude}
              longitude={hortaAdmin?.longitude}
              nome={hortaNome}
              endereco={hortaAdmin?.endereco}
            />
          </div>

          {/* Tarefas recentes */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-[15px] text-neutral-950 font-semibold">Tarefas recentes</h2>
              <button onClick={() => onNavigate('tasks')} className="text-[13px] text-[#00a63e]">
                Ver todas
              </button>
            </div>

            {isLoading ? null : adminTasks.length === 0 ? (
              <div className="bg-white rounded-[14px] border border-gray-200 p-6 text-center">
                <p className="text-[14px] text-[#717182]">Nenhuma tarefa cadastrada ainda</p>
              </div>
            ) : (
              <div className="bg-white rounded-[14px] border border-gray-200 overflow-hidden">
                {adminTasks.slice(0, 6).map((tarefa, i) => (
                  <div
                    key={tarefa.id}
                    className={`flex items-center justify-between px-4 py-3 ${
                      i !== 0 ? 'border-t border-gray-100' : ''
                    }`}
                  >
                    <div>
                      <p className="text-[13px] text-neutral-950 font-medium">{tarefa.titulo}</p>
                      <p className="text-[11px] text-[#717182]">{tarefa.tipo}</p>
                    </div>
                    <span
                      className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${
                        tarefa.concluido
                          ? 'bg-green-50 text-[#008236]'
                          : 'bg-amber-50 text-[#f0b100]'
                      }`}
                    >
                      {tarefa.concluido ? 'Concluída' : 'Pendente'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ===== COLUNA DIREITA ===== */}
        <div className="space-y-5">
          {/* Progresso da horta */}
          <div>
            <h2 className="text-[15px] text-neutral-950 font-semibold mb-3 px-1">Progresso da horta</h2>
            <div className="bg-white rounded-[14px] border border-gray-200 p-5 flex flex-col items-center">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={raio} fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r={raio}
                  fill="none"
                  stroke="#00a63e"
                  strokeWidth="8"
                  strokeDasharray={circunferencia}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <text x="50" y="55" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#0a0a0a">
                  {progresso}%
                </text>
              </svg>
              <p className="text-[12px] text-[#4a5565] mt-2">Tarefas concluídas</p>

              <div className="grid grid-cols-2 gap-3 w-full mt-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-[16px] font-bold text-[#008236]">{concluidas.length}</p>
                  <p className="text-[11px] text-[#717182]">Concluídas</p>
                </div>
                <div className="text-center">
                  <p className="text-[16px] font-bold text-[#f0b100]">{pendentes.length}</p>
                  <p className="text-[11px] text-[#717182]">Pendentes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ações rápidas */}
          <div>
            <h2 className="text-[15px] text-neutral-950 font-semibold mb-3 px-1">Ações rápidas</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onNavigate('tasks')}
                className="bg-[#00a63e] hover:bg-[#008236] rounded-[14px] p-4 flex flex-col items-center gap-2 transition-colors"
              >
                <ClipboardList className="size-6 text-white" />
                <span className="text-[13px] text-white font-medium">Gerenciar tarefas</span>
              </button>
              <button
                onClick={() => onNavigate('rewards')}
                className="bg-white rounded-[14px] border border-gray-200 p-4 flex flex-col items-center gap-2 hover:border-[#00a63e] hover:shadow-sm transition-all"
              >
                <Gift className="size-6 text-[#00a63e]" />
                <span className="text-[13px] text-neutral-950 font-medium">Ver recompensas</span>
              </button>
              <button
                onClick={() => onNavigate('profile')}
                className="col-span-2 bg-white rounded-[14px] border border-gray-200 p-4 flex flex-col items-center gap-2 hover:border-[#00a63e] hover:shadow-sm transition-all"
              >
                <Settings className="size-6 text-[#4a5565]" />
                <span className="text-[13px] text-neutral-950 font-medium">Gerenciar perfil</span>
              </button>
            </div>
          </div>

          {/* Próximas tarefas (sem prazo real ainda — Fase 3) */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-[15px] text-neutral-950 font-semibold">Próximas tarefas</h2>
              <button onClick={() => onNavigate('tasks')} className="text-[13px] text-[#00a63e]">
                Ver todas
              </button>
            </div>
            {proximasTarefas.length === 0 ? (
              <div className="bg-white rounded-[14px] border border-gray-200 p-4 text-center">
                <p className="text-[13px] text-[#717182]">Nenhuma tarefa pendente</p>
              </div>
            ) : (
              <div className="bg-white rounded-[14px] border border-gray-200 divide-y divide-gray-100">
                {proximasTarefas.map((tarefa) => (
                  <div key={tarefa.id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-[13px] text-neutral-950 font-medium">{tarefa.titulo}</p>
                      <p className="text-[11px] text-[#717182]">{tarefa.tipo}</p>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] text-[#717182]">
                      <Clock className="size-3" /> Sem prazo
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}