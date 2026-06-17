import { useState, useEffect } from 'react';
import { Sprout, Lock, Gift, PlusCircle, Edit2, Trash2, Loader } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

interface Reward {
  id: number;
  nome?: string;
  titulo?: string;
  descricao: string;
  tipo: string;
  preco: number;
  src?: string;
  horta?: string;
  total?: number;
  quantidade_disponivel?: number;
}

interface AdminRewardRedeemed {
  id: number;
  nome: string;
  tipo: string;
  preco: number;
  perfil_nome?: string;
}

function rewardImageFallback(title: string) {
  const label = encodeURIComponent(title || 'Recompensa');
  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='480'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='%2300a63e'/><stop offset='1' stop-color='%23008236'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='34' fill='white'>${label}</text></svg>`;
}

function normalizeImageSrc(src: string | undefined, title: string) {
  if (!src) return rewardImageFallback(title);
  if (src.includes('images.unsplash.com')) return rewardImageFallback(title);
  return src;
}

export default function RewardsPage() {
  const { token, user, isAdmin } = useAuth();
  const idPerfil = user?.id_perfil || 1;
  const idHorta = user?.roles.find((r) => r.role === 'ADMIN')?.id_horta || 1;

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [coins, setCoins] = useState(0);
  const [isLoadingRewards, setIsLoadingRewards] = useState(false);

  const [showFormRecompensa, setShowFormRecompensa] = useState(false);
  const [editingRecompensaId, setEditingRecompensaId] = useState<number | null>(null);
  const [isSavingRecompensa, setIsSavingRecompensa] = useState(false);
  const [recompensasResgatadasHorta, setRecompensasResgatadasHorta] = useState<AdminRewardRedeemed[]>([]);
  const [formRecompensa, setFormRecompensa] = useState({
    nome: '',
    descricao: '',
    tipo: 'Produto',
    preco: 100,
    quantidade_disponivel: 10,
  });

  const fetchCoins = async (idPerfilAtual: number) => {
    const response = await fetch('http://localhost:8080/minhas_moedas', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_perfil: idPerfilAtual }),
    });

    if (!response.ok) {
      throw new Error('Falha ao carregar saldo');
    }

    const result = await response.json();
    return Number(result.Saldo) || 0;
  };

  const fetchRewards = async () => {
    const endpoint = isAdmin ? 'http://localhost:8080/recompensas' : 'http://localhost:8080/recompensas_disponiveis';
    const headers: Record<string, string> = {};

    if (isAdmin && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, { headers });
    if (!response.ok) {
      throw new Error('Falha ao carregar recompensas');
    }

    const result = await response.json();
    return result as Reward[];
  };

  const fetchData = async () => {
    setIsLoadingRewards(true);
    try {
      const [rewardData, coinsData] = await Promise.all([fetchRewards(), fetchCoins(idPerfil)]);
      setCoins(coinsData);
      setRewards(rewardData);

      if (isAdmin && token) {
        const historyResponse = await fetch(
          `http://localhost:8080/admin/horta/historico?id_horta=${idHorta}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!historyResponse.ok) {
          throw new Error('Falha ao carregar recompensas resgatadas da horta');
        }

        const historyData = await historyResponse.json();
        setRecompensasResgatadasHorta(historyData.recompensas_resgatadas_horta || []);
      } else {
        setRecompensasResgatadasHorta([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erro ao carregar recompensas');
    } finally {
      setIsLoadingRewards(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAdmin, token, idHorta]);

  const redeemReward = async (idRecompensa: number, idPerfilAtual: number) => {
    try {
      await fetch('http://localhost:8080/resgatar_recompensa', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_recompensa: idRecompensa, id_perfil: idPerfilAtual }),
      });
      toast.success('Recompensa resgatada');
      await fetchData();
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast.error('Erro ao resgatar recompensa');
    }
  };

  const resetRewardForm = () => {
    setEditingRecompensaId(null);
    setFormRecompensa({
      nome: '',
      descricao: '',
      tipo: 'Produto',
      preco: 100,
      quantidade_disponivel: 10,
    });
  };

  const handleSaveRecompensa = async () => {
    if (!isAdmin || !token) return;
    if (!formRecompensa.nome.trim() || !formRecompensa.descricao.trim()) {
      toast.error('Preencha nome e descrição');
      return;
    }

    setIsSavingRecompensa(true);
    try {
      const method = editingRecompensaId ? 'PUT' : 'POST';
      const url = editingRecompensaId
        ? `http://localhost:8080/admin/recompensas/${editingRecompensaId}`
        : 'http://localhost:8080/admin/recompensas';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formRecompensa, id_horta: idHorta }),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar recompensa');
      }

      toast.success(editingRecompensaId ? 'Recompensa atualizada' : 'Recompensa criada com sucesso');
      setShowFormRecompensa(false);
      resetRewardForm();
      await fetchData();
    } catch (error) {
      console.error('Error saving reward:', error);
      toast.error('Erro ao salvar recompensa');
    } finally {
      setIsSavingRecompensa(false);
    }
  };

  const handleDeleteRecompensa = async (id: number) => {
    if (!isAdmin || !token) return;
    if (!window.confirm('Tem certeza que deseja deletar esta recompensa?')) return;

    try {
      const response = await fetch(`http://localhost:8080/admin/recompensas/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Falha ao deletar recompensa');
      }

      toast.success('Recompensa removida');
      await fetchData();
    } catch (error) {
      console.error('Error deleting reward:', error);
      toast.error('Erro ao deletar recompensa');
    }
  };

  const handleEditRecompensa = (reward: Reward) => {
    setEditingRecompensaId(reward.id);
    setFormRecompensa({
      nome: reward.nome || reward.titulo || '',
      descricao: reward.descricao || '',
      tipo: reward.tipo || 'Produto',
      preco: Number(reward.preco) || 0,
      quantidade_disponivel: Number(reward.quantidade_disponivel) || 0,
    });
    setShowFormRecompensa(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Produtos':
      case 'Produto':
        return 'bg-green-100 text-[#008236]';
      case 'Ferramentas':
        return 'bg-blue-100 text-[#1447e6]';
      case 'Plantas':
        return 'bg-purple-100 text-[#8200db]';
      case 'Educação':
      case 'Workshop':
        return 'bg-[#ffedd4] text-[#ca3500]';
      case 'Acessórios':
      case 'Serviço':
      case 'Servico':
        return 'bg-pink-100 text-[#c6005c]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-4 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[16px] text-neutral-950 px-2">Recompensas</h1>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => {
                resetRewardForm();
                setShowFormRecompensa((prev) => !prev);
              }}
              className="inline-flex items-center gap-1.5 bg-[#00a63e] text-white text-[12px] px-3 py-2 rounded-lg hover:bg-[#008236] transition-colors"
            >
              <PlusCircle className="size-4" />
              {showFormRecompensa ? 'Fechar' : 'Nova recompensa'}
            </button>
          )}
          <div className="bg-green-50 rounded-[10px] px-4 py-2 flex items-center gap-2">
            <Sprout className="size-5 text-[#00a63e]" />
            <span className="text-[16px] text-[#00a63e]">{coins}</span>
          </div>
        </div>
      </div>

      {isAdmin && showFormRecompensa && (
        <div className="bg-white rounded-[14px] border border-gray-200 p-5 space-y-4 mb-5">
          <h3 className="text-[16px] text-neutral-950 font-semibold">
            {editingRecompensaId ? 'Editar recompensa' : 'Criar nova recompensa'}
          </h3>

          <input
            type="text"
            placeholder="Nome"
            value={formRecompensa.nome}
            onChange={(e) => setFormRecompensa({ ...formRecompensa, nome: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#00a63e]"
          />

          <textarea
            placeholder="Descrição"
            value={formRecompensa.descricao}
            onChange={(e) => setFormRecompensa({ ...formRecompensa, descricao: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#00a63e] min-h-16"
          />

          <select
            value={formRecompensa.tipo}
            onChange={(e) => setFormRecompensa({ ...formRecompensa, tipo: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
          >
            <option value="Produto">Produto</option>
            <option value="Workshop">Workshop</option>
            <option value="Serviço">Serviço</option>
            <option value="Outro">Outro</option>
          </select>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Custo (moedas)"
              value={formRecompensa.preco}
              onChange={(e) => setFormRecompensa({ ...formRecompensa, preco: Number(e.target.value) })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
            />
            <input
              type="number"
              placeholder="Quantidade disponível"
              value={formRecompensa.quantidade_disponivel}
              onChange={(e) => setFormRecompensa({ ...formRecompensa, quantidade_disponivel: Number(e.target.value) })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveRecompensa}
              disabled={isSavingRecompensa}
              className="flex-1 bg-[#00a63e] text-white text-[14px] py-2 rounded-lg hover:bg-[#008236] disabled:opacity-70"
            >
              {isSavingRecompensa ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              onClick={() => {
                setShowFormRecompensa(false);
                resetRewardForm();
              }}
              className="flex-1 bg-gray-200 text-[#4a5565] text-[14px] py-2 rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="bg-white rounded-[14px] border border-gray-200 p-4 mb-5">
          <h3 className="text-[15px] font-semibold text-neutral-950 mb-3">Recompensas resgatadas da sua horta</h3>
          <div className="space-y-2">
            {recompensasResgatadasHorta.length === 0 ? (
              <p className="text-[13px] text-[#717182]">Nenhum resgate registrado na horta ainda.</p>
            ) : (
              recompensasResgatadasHorta.slice(0, 8).map((reward, index) => (
                <div key={`redeemed-${reward.id}-${index}`} className="border-b border-gray-100 pb-2 last:border-b-0 last:pb-0">
                  <p className="text-[13px] text-neutral-950 font-medium">{reward.nome}</p>
                  <p className="text-[12px] text-[#717182]">
                    {reward.perfil_nome || 'Sem perfil'} • {reward.tipo} • {reward.preco} moedas
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="space-y-7">
        {isLoadingRewards ? (
          <div className="flex justify-center py-8">
            <Loader className="size-5 animate-spin text-[#00a63e]" />
          </div>
        ) : (
          rewards.map((reward) => {
            const title = reward.titulo || reward.nome || 'Recompensa';
            const available = Number(reward.total ?? reward.quantidade_disponivel ?? 0);
            const canAfford = coins >= Number(reward.preco || 0);

            return (
              <div
                key={reward.id}
                className={`bg-white rounded-[14px] border border-gray-200 overflow-hidden ${
                  !canAfford && !isAdmin ? 'opacity-60' : ''
                }`}
              >
                <div className="relative h-[180px]">
                  <ImageWithFallback
                    src={normalizeImageSrc(reward.src, title)}
                    alt={title}
                    className="w-full h-full object-cover"
                  />

                  {!canAfford && !isAdmin && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Lock className="size-8 text-white" />
                    </div>
                  )}

                  <div className="absolute top-2 right-2 bg-white rounded-[10px] px-3 py-1.5 flex items-center gap-1">
                    <Sprout className="size-4 text-[#00a63e]" />
                    <span className="text-[16px] text-[#00a63e]">{reward.preco}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-[16px] text-neutral-950">{title}</h3>
                    {isAdmin && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditRecompensa(reward)}
                          className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                          title="Editar"
                        >
                          <Edit2 className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRecompensa(reward.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                          title="Deletar"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-[14px] text-[#717182] mb-4">{reward.descricao}</p>

                  <div className="flex items-center justify-between mb-2">
                    <span className={`${getCategoryColor(reward.tipo)} text-[12px] px-2.5 py-1 rounded-lg`}>
                      {reward.tipo}
                    </span>
                    <span className="text-[14px] text-[#4a5565]">{available} disponíveis</span>
                  </div>

                  {reward.horta && <p className="text-[12px] text-[#6a7282] mb-4">{reward.horta}</p>}

                  {isAdmin ? (
                    <div className="w-full py-2.5 rounded-lg text-[14px] text-center bg-gray-100 text-[#4a5565]">
                      Modo admin: gerencie pelas ações acima
                    </div>
                  ) : (
                    <button
                      onClick={() => redeemReward(reward.id, idPerfil)}
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
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
