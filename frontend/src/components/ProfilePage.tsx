import { TrendingUp, Sprout, Award, LogOut, CheckCircle2, Gift } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProfilePageProps {
  coins: number;
  tasksCompleted: number;
  onLogout?: () => void;
}

interface TaskDone {
  id: number;
  titulo: string;
  descricao: string;
  tipo: string;
  horta: string;
  moedas: number;
  tempo: number;
}

interface RewardRedeemed {
  id: number;
  nome: string;
  descricao: string;
  tipo: string;
  preco: number;
}

async function getMudas(idPerfil: number) {
  const mudas = await fetch('http://localhost:8080/minhas_mudas', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id_perfil: idPerfil }),
  });
  const result = await mudas.json();
  return Number(result.Total) || 0;
}

export default function ProfilePage({ coins, tasksCompleted, onLogout }: ProfilePageProps) {
  const { logout, token, user } = useAuth();
  const idPerfil = user?.id_perfil || 1;

  const [mudas, setMudas] = useState(0);
  const [resgatou, setResgatou] = useState(false);
  const [tarefasConcluidas, setTarefasConcluidas] = useState<TaskDone[]>([]);
  const [recompensasResgatadas, setRecompensasResgatadas] = useState<RewardRedeemed[]>([]);

  const achievements = [
    { id: 1, name: 'Primeiro Passo', description: 'Complete sua primeira tarefa', icon: '🌱', unlocked: tasksCompleted > 0 },
    { id: 2, name: 'Jardineiro Dedicado', description: 'Trabalhe 5 dias seguidos', icon: '🌿', unlocked: tasksCompleted >= 5 },
    { id: 3, name: 'Coletor de Recompensas', description: 'Resgate 5 recompensas', icon: '🎁', unlocked: resgatou },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mudasData = await getMudas(idPerfil);
        setMudas(mudasData);

        if (!token) {
          setTarefasConcluidas([]);
          setRecompensasResgatadas([]);
          setResgatou(false);
          return;
        }

        const response = await fetch('http://localhost:8080/me/historico', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Falha ao carregar historico');

        const data = await response.json();
        const tarefas = data.tarefas_concluidas || [];
        const recompensas = data.recompensas_resgatadas || [];

        setTarefasConcluidas(tarefas);
        setRecompensasResgatadas(recompensas);
        setResgatou(recompensas.length >= 5);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchData();
  }, [idPerfil, token]);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-4">
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-br from-[#00a63e] to-[#008236] rounded-[20px] p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="size-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span className="text-[24px]">👩‍🌾</span>
              </div>
              <div>
                <h1 className="text-[20px] mb-1">{user?.nome || 'Usuário'}</h1>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2">
              <Sprout className="size-5" />
              <span className="text-[16px]">{coins}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mb-6">
        <h2 className="text-[16px] text-neutral-950 mb-4 px-2">Estatísticas</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-[14px] border border-gray-200 p-4 flex flex-col items-center">
            <TrendingUp className="size-6 text-[#00a63e] mb-2" />
            <p className="text-[24px] text-neutral-950 mb-1">{tasksCompleted}</p>
            <p className="text-[11px] text-[#4a5565] text-center">Tarefas Completas</p>
          </div>
          <div className="bg-white rounded-[14px] border border-gray-200 p-4 flex flex-col items-center">
            <Gift className="size-6 text-[#00a63e] mb-2" />
            <p className="text-[24px] text-neutral-950 mb-1">{recompensasResgatadas.length}</p>
            <p className="text-[11px] text-[#4a5565] text-center">Recompensas Resgatadas</p>
          </div>
        </div>
      </div>

      <div className="px-4 mb-6">
        <h2 className="text-[16px] text-neutral-950 mb-4 px-2">Conquistas</h2>
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`bg-white rounded-[14px] border border-gray-200 p-4 flex items-center gap-4 ${
                !achievement.unlocked ? 'opacity-50' : ''
              }`}
            >
              <div
                className={`size-12 rounded-full flex items-center justify-center text-[24px] ${
                  achievement.unlocked ? 'bg-green-50' : 'bg-gray-100'
                }`}
              >
                {achievement.unlocked ? achievement.icon : '🔒'}
              </div>
              <div className="flex-1">
                <h3 className="text-[14px] text-neutral-950 mb-1">{achievement.name}</h3>
                <p className="text-[12px] text-[#717182]">{achievement.description}</p>
              </div>
              {achievement.unlocked && <Award className="size-5 text-[#00a63e]" />}
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mb-6">
        <h2 className="text-[16px] text-neutral-950 mb-3 px-2">Tarefas Concluídas</h2>
        <div className="bg-white rounded-[14px] border border-gray-200 p-4 space-y-3">
          {tarefasConcluidas.length === 0 ? (
            <p className="text-[13px] text-[#717182]">Você ainda não concluiu tarefas.</p>
          ) : (
            tarefasConcluidas.slice(0, 8).map((task) => (
              <div key={task.id} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="size-4 text-[#00a63e]" />
                  <p className="text-[14px] text-neutral-950 font-medium">{task.titulo}</p>
                </div>
                <p className="text-[12px] text-[#717182]">{task.horta} • {task.moedas} moedas</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="px-4 mb-6">
        <h2 className="text-[16px] text-neutral-950 mb-3 px-2">Recompensas Resgatadas</h2>
        <div className="bg-white rounded-[14px] border border-gray-200 p-4 space-y-3">
          {recompensasResgatadas.length === 0 ? (
            <p className="text-[13px] text-[#717182]">Você ainda não resgatou recompensas.</p>
          ) : (
            recompensasResgatadas.slice(0, 8).map((reward, index) => (
              <div key={`${reward.id}-${reward.nome}-${index}`} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                <p className="text-[14px] text-neutral-950 font-medium">{reward.nome}</p>
                <p className="text-[12px] text-[#717182]">{reward.tipo} • {reward.preco} moedas</p>
              </div>
            ))
          )}
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

      <div className="px-4 mb-6">
        <h2 className="text-[16px] text-neutral-950 mb-4 px-2">Impacto na Comunidade</h2>
        <div className="bg-white rounded-[14px] border border-gray-200 p-6">
          <div className="text-center mb-4">
            <p className="text-[14px] text-[#717182] mb-2">Você ajudou a plantar</p>
            <p className="text-[32px] text-[#00a63e]">{mudas || 0}</p>
            <p className="text-[14px] text-neutral-950">mudas este mês</p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-[12px] text-[#717182] text-center">
              Seu trabalho contribuiu para uma comunidade mais verde e sustentável! 🌱
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
