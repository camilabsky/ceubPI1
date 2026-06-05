import { useState } from 'react';
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

export default function RewardsPage({ coins, onRedeem }: RewardsPageProps) {
  const [rewards] = useState<Reward[]>([
    {
      id: 1,
      title: 'Cesta de Vegetais Orgânicos',
      description: 'Cesta com vegetais frescos da horta',
      category: 'Produtos',
      coins: 200,
      available: 5,
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
    },
    {
      id: 2,
      title: 'Kit de Ferramentas de Jardim',
      description: 'Kit básico com pá, rastelo e luvas',
      category: 'Ferramentas',
      coins: 500,
      available: 2,
      imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    },
    {
      id: 3,
      title: 'Mudas de Ervas Aromáticas',
      description: '5 mudas de manjericão, tomilho e alecrim',
      category: 'Plantas',
      coins: 150,
      available: 8,
      imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400',
    },
    {
      id: 4,
      title: 'Workshop de Compostagem',
      description: 'Acesso ao workshop sobre compostagem doméstica',
      category: 'Educação',
      coins: 300,
      available: 10,
      location: 'Jardim da Praça Verde',
      imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400',
    },
    {
      id: 5,
      title: 'Sacola Ecológica Personalizada',
      description: 'Sacola reutilizável com logo da horta',
      category: 'Acessórios',
      coins: 100,
      available: 15,
      location: 'Horta Orgânica Vila Nova',
      imageUrl: 'https://images.unsplash.com/photo-1553531087-1ea13dd840ad?w=400',
    },
    {
      id: 6,
      title: 'Cesta Premium de Vegetais',
      description: 'Cesta especial com vegetais selecionados',
      category: 'Produtos',
      coins: 800,
      available: 3,
      location: 'Horta Comunitária Centro',
      imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400',
    },
  ]);

  const redeemReward = (reward: Reward) => {
    if (onRedeem(reward.coins)) {
      toast.success(`${reward.title} resgatado com sucesso!`, {
        description: `${reward.coins} moedas foram debitadas`,
        icon: '🎁',
      });
    } else {
      toast.error('Moedas insuficientes', {
        description: `Você precisa de ${reward.coins - coins} moedas a mais`,
      });
    }
  };

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
          const canAfford = coins >= reward.coins;
          
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
                  src={reward.imageUrl}
                  alt={reward.title}
                  className="w-full h-full object-cover"
                />
                
                {!canAfford && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Lock className="size-8 text-white" />
                  </div>
                )}
                
                <div className="absolute top-2 right-2 bg-white rounded-[10px] px-3 py-1.5 flex items-center gap-1">
                  <Sprout className="size-4 text-[#00a63e]" />
                  <span className="text-[16px] text-[#00a63e]">{reward.coins}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-[16px] text-neutral-950 mb-2">{reward.title}</h3>
                <p className="text-[14px] text-[#717182] mb-4">{reward.description}</p>

                <div className="flex items-center justify-between mb-2">
                  <span className={`${getCategoryColor(reward.category)} text-[12px] px-2.5 py-1 rounded-lg`}>
                    {reward.category}
                  </span>
                  <span className="text-[14px] text-[#4a5565]">{reward.available} disponíveis</span>
                </div>

                {reward.location && (
                  <p className="text-[12px] text-[#6a7282] mb-4">{reward.location}</p>
                )}

                <button
                  onClick={() => redeemReward(reward)}
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
