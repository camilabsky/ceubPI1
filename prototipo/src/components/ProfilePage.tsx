import { Trophy, Calendar, TrendingUp, Sprout, Award, MapPin, Users, Heart } from 'lucide-react';

interface ProfilePageProps {
  coins: number;
  level: number;
  daysWorked: number;
  tasksCompleted: number;
}

export default function ProfilePage({ coins, level, daysWorked, tasksCompleted }: ProfilePageProps) {
  const achievements = [
    { id: 1, name: 'Primeiro Passo', description: 'Complete sua primeira tarefa', icon: '🌱', unlocked: true },
    { id: 2, name: 'Jardineiro Dedicado', description: 'Trabalhe 5 dias seguidos', icon: '🌿', unlocked: true },
    { id: 3, name: 'Mestre das Plantas', description: 'Alcance o nível 10', icon: '🌳', unlocked: false },
    { id: 4, name: 'Coletor de Recompensas', description: 'Resgate 5 recompensas', icon: '🎁', unlocked: false },
  ];

  const stats = [
    { label: 'Hortas visitadas', value: '3', icon: MapPin, color: 'text-[#00a63e]' },
    { label: 'Colaboradores conhecidos', value: '12', icon: Users, color: 'text-[#155DFC]' },
    { label: 'Impacto ambiental', value: '45kg CO₂', icon: Heart, color: 'text-[#fb2c36]' },
  ];

  const nextLevelProgress = (tasksCompleted % 10) * 10;

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-4">
      {/* Profile Header */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-br from-[#00a63e] to-[#008236] rounded-[20px] p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="size-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span className="text-[24px]">👩‍🌾</span>
              </div>
              <div>
                <h1 className="text-[20px] mb-1">Maria Silva</h1>
                <p className="text-white/80 text-[14px]">Jardineira Nível {level}</p>
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2">
              <Sprout className="size-5" />
              <span className="text-[16px]">{coins}</span>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] text-white/80">Progresso para o nível {level + 1}</span>
              <span className="text-[14px]">{nextLevelProgress}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-500"
                style={{ width: `${nextLevelProgress}%` }}
              />
            </div>
            <p className="text-[12px] text-white/60 mt-2">
              {10 - (tasksCompleted % 10)} tarefas até o próximo nível
            </p>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="px-4 mb-6">
        <h2 className="text-[16px] text-neutral-950 mb-4 px-2">Estatísticas</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-[14px] border border-gray-200 p-4 flex flex-col items-center">
            <TrendingUp className="size-6 text-[#00a63e] mb-2" />
            <p className="text-[24px] text-neutral-950 mb-1">{tasksCompleted}</p>
            <p className="text-[11px] text-[#4a5565] text-center">Tarefas Completas</p>
          </div>

          <div className="bg-white rounded-[14px] border border-gray-200 p-4 flex flex-col items-center">
            <Calendar className="size-6 text-[#155DFC] mb-2" />
            <p className="text-[24px] text-neutral-950 mb-1">{daysWorked}</p>
            <p className="text-[11px] text-[#4a5565] text-center">Dias Ativos</p>
          </div>

          <div className="bg-white rounded-[14px] border border-gray-200 p-4 flex flex-col items-center">
            <Trophy className="size-6 text-[#9810FA] mb-2" />
            <p className="text-[24px] text-neutral-950 mb-1">{level}</p>
            <p className="text-[11px] text-[#4a5565] text-center">Nível Atual</p>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-[14px] border border-gray-200 p-4 space-y-3">
          {stats.map(stat => (
            <div key={stat.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <stat.icon className={`size-5 ${stat.color}`} />
                <span className="text-[14px] text-neutral-950">{stat.label}</span>
              </div>
              <span className="text-[14px] text-[#4a5565]">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="px-4 mb-6">
        <h2 className="text-[16px] text-neutral-950 mb-4 px-2">Conquistas</h2>
        <div className="space-y-3">
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              className={`bg-white rounded-[14px] border border-gray-200 p-4 flex items-center gap-4 ${
                !achievement.unlocked ? 'opacity-50' : ''
              }`}
            >
              <div className={`size-12 rounded-full flex items-center justify-center text-[24px] ${
                achievement.unlocked ? 'bg-green-50' : 'bg-gray-100'
              }`}>
                {achievement.unlocked ? achievement.icon : '🔒'}
              </div>
              <div className="flex-1">
                <h3 className="text-[14px] text-neutral-950 mb-1">{achievement.name}</h3>
                <p className="text-[12px] text-[#717182]">{achievement.description}</p>
              </div>
              {achievement.unlocked && (
                <Award className="size-5 text-[#00a63e]" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Community Impact */}
      <div className="px-4 mb-6">
        <h2 className="text-[16px] text-neutral-950 mb-4 px-2">Impacto na Comunidade</h2>
        <div className="bg-white rounded-[14px] border border-gray-200 p-6">
          <div className="text-center mb-4">
            <p className="text-[14px] text-[#717182] mb-2">Você ajudou a plantar</p>
            <p className="text-[32px] text-[#00a63e]">47</p>
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
