import { useState, useEffect } from 'react';
import { Sprout, Lock, Gift } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

interface Reward {
  id: number;
  title: string;
  description: string;
  category: string;
  coins: number;
  available: number;
  location?: string;
  imageUrl: string;
}

interface RewardsPageProps {
  coins: number;
  onRedeem: (amount: number) => boolean;
}

function redeemReward(id_recompensa, id_perfil ){
  fetch("http://localhost:8080/resgatar_recompensa", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id_recompensa, id_perfil})
  })
}

async function get_reward(): Taks[]{
  const tasks = await fetch("http://localhost:8080/recompensas_disponiveis")
  const r = await tasks.json()  
  return r
}

export default function RewardsPage({ coins, onRedeem }: RewardsPageProps) {
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rewardData] = await Promise.all([get_reward()]);

        setRewards(rewardData)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Produtos':
        return 'bg-green-100 text-[#008236]';
      case 'Ferramentas':
        return 'bg-blue-100 text-[#1447e6]';
      case 'Plantas':
        return 'bg-purple-100 text-[#8200db]';
      case 'Educação':
        return 'bg-[#ffedd4] text-[#ca3500]';
      case 'Acessórios':
        return 'bg-pink-100 text-[#c6005c]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-4 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[16px] text-neutral-950 px-2">Recompensas</h1>
        <div className="bg-green-50 rounded-[10px] px-4 py-2 flex items-center gap-2">
          <Sprout className="size-5 text-[#00a63e]" />
          <span className="text-[16px] text-[#00a63e]">{coins}</span>
        </div>
      </div>

      <div className="space-y-7">
        {rewards.map(reward => {
          const canAfford = coins >= reward.preco;
          
          return (
            <div
              key={reward.id}
              className={`bg-white rounded-[14px] border border-gray-200 overflow-hidden ${
                !canAfford ? 'opacity-60' : ''
              }`}
            >
              {/* Image */}
              <div className="relative h-[180px]">
                <ImageWithFallback
                  src={reward.src}
                  alt={reward.titulo}
                  className="w-full h-full object-cover"
                />
                
                {!canAfford && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Lock className="size-8 text-white" />
                  </div>
                )}
                
                <div className="absolute top-2 right-2 bg-white rounded-[10px] px-3 py-1.5 flex items-center gap-1">
                  <Sprout className="size-4 text-[#00a63e]" />
                  <span className="text-[16px] text-[#00a63e]">{reward.preco}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-[16px] text-neutral-950 mb-2">{reward.titulo}</h3>
                <p className="text-[14px] text-[#717182] mb-4">{reward.descricao}</p>

                <div className="flex items-center justify-between mb-2">
                  <span className={`${getCategoryColor(reward.tipo)} text-[12px] px-2.5 py-1 rounded-lg`}>
                    {reward.tipo}
                  </span>
                  <span className="text-[14px] text-[#4a5565]">{reward.quantidade} disponíveis</span>
                </div>

                {reward.horta && (
                  <p className="text-[12px] text-[#6a7282] mb-4">{reward.horta}</p>
                )}

                <button
                  onClick={() => redeemReward(reward.id, 1)}
                  disabled={!canAfford}
                  className={`w-full py-2.5 rounded-lg text-[14px] text-white flex items-center justify-center gap-2 transition-all ${
                    canAfford
                      ? 'bg-[#00a63e] hover:bg-[#008236]'
                      : 'bg-[#030213] opacity-50 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? (
                    <>
                      <Gift className="size-4" />
                      Resgatar
                    </>
                  ) : (
                    <>
                      <Lock className="size-4" />
                      Moedas insuficientes
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
