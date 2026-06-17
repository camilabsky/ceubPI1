import { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Edit2, PlusCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

interface AdminTask {
  id: number;
  titulo: string;
  descricao: string;
  tipo: string;
  dificuldade: number;
  moedas: number;
  mudas: number;
  tempo: number;
}

interface AdminRecompensa {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidade_disponivel: number;
}

interface AdminPanelProps {
  onBack: () => void;
}

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const { token, user } = useAuth();
  const id_horta = user?.roles.find(r => r.role === 'ADMIN')?.id_horta || 1;
  const [activeTab, setActiveTab] = useState<'tarefas' | 'recompensas'>('tarefas');
  const [tarefas, setTarefas] = useState<AdminTask[]>([]);
  const [recompensas, setRecompensas] = useState<AdminRecompensa[]>([]);
  const [loadingTarefas, setLoadingTarefas] = useState(false);
  const [loadingRecompensas, setLoadingRecompensas] = useState(false);
  const [showFormTarefa, setShowFormTarefa] = useState(false);
  const [showFormRecompensa, setShowFormRecompensa] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingRecompensaId, setEditingRecompensaId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    tipo: 'Manutenção',
    dificuldade: 0,
    moedas: 50,
    mudas: 0,
    tempo: 30
  });
  const [formRecompensa, setFormRecompensa] = useState({
    nome: '',
    descricao: '',
    tipo: 'Produto',
    preco: 100,
    quantidade_disponivel: 10
  });

  useEffect(() => {
    if (activeTab === 'tarefas') {
      loadTarefas();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'recompensas') {
      loadRecompensas();
    }
  }, [activeTab]);

  const loadTarefas = async () => {
    setLoadingTarefas(true);
    try {
      const res = await fetch(`http://localhost:8080/tarefas_disponiveis`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Erro ao carregar tarefas');
      const data = await res.json();
      setTarefas(data);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      toast.error('Erro ao carregar tarefas');
    } finally {
      setLoadingTarefas(false);
    }
  };

  const loadRecompensas = async () => {
    setLoadingRecompensas(true);
    try {
      const res = await fetch(`http://localhost:8080/recompensas`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Erro ao carregar recompensas');
      const data = await res.json();
      setRecompensas(data);
    } catch (error) {
      console.error('Erro ao carregar recompensas:', error);
      toast.error('Erro ao carregar recompensas');
    } finally {
      setLoadingRecompensas(false);
    }
  };

  const handleSaveTask = async () => {
    if (!formData.titulo || !formData.descricao) {
      toast.error('Preencha titulo e descricao');
      return;
    }

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `http://localhost:8080/admin/tarefas/${editingId}`
        : 'http://localhost:8080/admin/tarefas';

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          id_horta
        })
      });

      if (!res.ok) throw new Error('Erro ao salvar tarefa');
      toast.success(editingId ? 'Tarefa atualizada' : 'Tarefa criada com sucesso!');
      setShowFormTarefa(false);
      setEditingId(null);
      setFormData({
        titulo: '',
        descricao: '',
        tipo: 'Manutenção',
        dificuldade: 0,
        moedas: 50,
        mudas: 0,
        tempo: 30
      });
      loadTarefas();
    } catch (error) {
      toast.error('Erro ao salvar tarefa');
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja deletar esta tarefa?')) return;

    try {
      const res = await fetch(`http://localhost:8080/admin/tarefas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Erro ao deletar');
      toast.success('Tarefa removida');
      loadTarefas();
    } catch (error) {
      toast.error('Erro ao deletar tarefa');
    }
  };

  const handleEditTask = (tarefa: AdminTask) => {
    setEditingId(tarefa.id);
    setFormData({
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      tipo: tarefa.tipo,
      dificuldade: tarefa.dificuldade,
      moedas: tarefa.moedas,
      mudas: tarefa.mudas,
      tempo: tarefa.tempo
    });
    setShowFormTarefa(true);
  };

  const handleSaveRecompensa = async () => {
    if (!formRecompensa.nome || !formRecompensa.descricao) {
      toast.error('Preencha nome e descricao');
      return;
    }

    try {
      const method = editingRecompensaId ? 'PUT' : 'POST';
      const url = editingRecompensaId 
        ? `http://localhost:8080/admin/recompensas/${editingRecompensaId}`
        : 'http://localhost:8080/admin/recompensas';

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formRecompensa,
          id_horta
        })
      });

      if (!res.ok) throw new Error('Erro ao salvar recompensa');
      toast.success(editingRecompensaId ? 'Recompensa atualizada' : 'Recompensa criada com sucesso!');
      setShowFormRecompensa(false);
      setEditingRecompensaId(null);
      setFormRecompensa({
        nome: '',
        descricao: '',
        tipo: 'Produto',
        preco: 100,
        quantidade_disponivel: 10
      });
      loadRecompensas();
    } catch (error) {
      toast.error('Erro ao salvar recompensa');
    }
  };

  const handleDeleteRecompensa = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja deletar esta recompensa?')) return;

    try {
      const res = await fetch(`http://localhost:8080/admin/recompensas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Erro ao deletar');
      toast.success('Recompensa removida');
      loadRecompensas();
    } catch (error) {
      toast.error('Erro ao deletar recompensa');
    }
  };

  const handleEditRecompensa = (recompensa: AdminRecompensa) => {
    setEditingRecompensaId(recompensa.id);
    setFormRecompensa({
      nome: recompensa.nome,
      descricao: recompensa.descricao,
      tipo: recompensa.tipo || 'Produto',
      preco: recompensa.preco,
      quantidade_disponivel: recompensa.quantidade_disponivel
    });
    setShowFormRecompensa(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-4 px-4">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[14px] text-[#4a5565] hover:text-[#030213]"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </button>
        <h1 className="text-[18px] text-neutral-950 font-bold">Painel Admin</h1>
        <div className="w-14" />
      </div>

      <div className="bg-gradient-to-br from-[#00a63e] to-[#008236] rounded-xl p-4 mb-6">
        <p className="text-white text-[16px] font-semibold">Gerenciar da horta</p>
        <p className="text-white/90 text-[13px] mt-1">Crie, edite e remova tarefas e recompensas</p>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab('tarefas')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-[14px] font-semibold transition-colors ${
            activeTab === 'tarefas'
              ? 'bg-[#00a63e] text-white'
              : 'bg-white text-[#4a5565] border border-gray-200 hover:border-[#00a63e]'
          }`}
        >
          Tarefas
        </button>
        <button
          onClick={() => setActiveTab('recompensas')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-[14px] font-semibold transition-colors ${
            activeTab === 'recompensas'
              ? 'bg-[#00a63e] text-white'
              : 'bg-white text-[#4a5565] border border-gray-200 hover:border-[#00a63e]'
          }`}
        >
          Recompensas
        </button>
      </div>

      {activeTab === 'tarefas' && (
        <div className="space-y-4">
          {!showFormTarefa ? (
            <button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  titulo: '',
                  descricao: '',
                  tipo: 'Manutenção',
                  dificuldade: 0,
                  moedas: 50,
                  mudas: 0,
                  tempo: 30
                });
                setShowFormTarefa(true);
              }}
              className="w-full bg-[#00a63e] text-white text-[14px] py-2.5 rounded-lg hover:bg-[#008236] transition-colors inline-flex items-center justify-center gap-2 font-semibold"
            >
              <PlusCircle className="size-4" />
              Nova tarefa
            </button>
          ) : (
            <div className="bg-white rounded-[14px] border border-gray-200 p-5 space-y-4">
              <h3 className="text-[16px] text-neutral-950 font-semibold">
                {editingId ? 'Editar tarefa' : 'Criar nova tarefa'}
              </h3>
              
              <input
                type="text"
                placeholder="Titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#00a63e]"
              />

              <textarea
                placeholder="Descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#00a63e] min-h-16"
              />

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
                >
                  <option>Manutenção</option>
                  <option>Plantio</option>
                  <option>colheita</option>
                  <option>compostagem</option>
                </select>

                <select
                  value={formData.dificuldade}
                  onChange={(e) => setFormData({ ...formData, dificuldade: Number(e.target.value) })}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
                >
                  <option value={0}>Facil</option>
                  <option value={1}>Medio</option>
                  <option value={2}>Dificil</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  placeholder="Moedas"
                  value={formData.moedas}
                  onChange={(e) => setFormData({ ...formData, moedas: Number(e.target.value) })}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
                />
                <input
                  type="number"
                  placeholder="Mudas"
                  value={formData.mudas}
                  onChange={(e) => setFormData({ ...formData, mudas: Number(e.target.value) })}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
                />
                <input
                  type="number"
                  placeholder="Tempo (min)"
                  value={formData.tempo}
                  onChange={(e) => setFormData({ ...formData, tempo: Number(e.target.value) })}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveTask}
                  className="flex-1 bg-[#00a63e] text-white text-[14px] py-2 rounded-lg hover:bg-[#008236]"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setShowFormTarefa(false)}
                  className="flex-1 bg-gray-200 text-[#4a5565] text-[14px] py-2 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {loadingTarefas ? (
            <div className="flex items-center justify-center py-6">
              <Loader className="size-5 animate-spin text-[#00a63e]" />
            </div>
          ) : (
            <div className="space-y-3">
              {tarefas.map((tarefa) => (
                <div key={tarefa.id} className="bg-white rounded-[12px] border border-gray-200 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-[14px] font-semibold text-neutral-950">{tarefa.titulo}</h4>
                      <p className="text-[12px] text-[#717182] mt-1">{tarefa.descricao}</p>
                      <div className="flex gap-3 mt-2 flex-wrap">
                        <span className="text-[11px] bg-gray-100 px-2 py-1 rounded text-[#4a5565]">{tarefa.tipo}</span>
                        <span className="text-[11px] bg-green-100 px-2 py-1 rounded text-[#008236]">{tarefa.moedas} moedas</span>
                        <span className="text-[11px] bg-blue-100 px-2 py-1 rounded text-[#4a5565]">{tarefa.tempo} min</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-3">
                      <button
                        onClick={() => handleEditTask(tarefa)}
                        className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                        title="Editar"
                      >
                        <Edit2 className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(tarefa.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                        title="Deletar"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'recompensas' && (
        <div className="space-y-4">
          {!showFormRecompensa ? (
            <button
              onClick={() => {
                setEditingRecompensaId(null);
                setFormRecompensa({
                  nome: '',
                  descricao: '',
                  tipo: 'Produto',
                  preco: 100,
                  quantidade_disponivel: 10
                });
                setShowFormRecompensa(true);
              }}
              className="w-full bg-[#00a63e] text-white text-[14px] py-2.5 rounded-lg hover:bg-[#008236] transition-colors inline-flex items-center justify-center gap-2 font-semibold"
            >
              <PlusCircle className="size-4" />
              Nova recompensa
            </button>
          ) : (
            <div className="bg-white rounded-[14px] border border-gray-200 p-5 space-y-4">
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
                placeholder="Descricao"
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
                <option value="Servico">Serviço</option>
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
                  placeholder="Quantidade disponivel"
                  value={formRecompensa.quantidade_disponivel}
                  onChange={(e) => setFormRecompensa({ ...formRecompensa, quantidade_disponivel: Number(e.target.value) })}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveRecompensa}
                  className="flex-1 bg-[#00a63e] text-white text-[14px] py-2 rounded-lg hover:bg-[#008236]"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setShowFormRecompensa(false)}
                  className="flex-1 bg-gray-200 text-[#4a5565] text-[14px] py-2 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {loadingRecompensas ? (
            <div className="flex items-center justify-center py-6">
              <Loader className="size-5 animate-spin text-[#00a63e]" />
            </div>
          ) : (
            <div className="space-y-3">
              {recompensas.length === 0 ? (
                <div className="bg-white rounded-[12px] border border-gray-200 p-6 text-center">
                  <p className="text-[14px] text-[#717182]">Nenhuma recompensa cadastrada</p>
                </div>
              ) : (
                recompensas.map((recompensa) => (
                  <div key={recompensa.id} className="bg-white rounded-[12px] border border-gray-200 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-[14px] font-semibold text-neutral-950">{recompensa.nome}</h4>
                        <p className="text-[12px] text-[#717182] mt-1">{recompensa.descricao}</p>
                        <div className="flex gap-3 mt-2 flex-wrap">
                          <span className="text-[11px] bg-yellow-100 px-2 py-1 rounded text-[#8b6914]">{recompensa.preco} moedas</span>
                          <span className="text-[11px] bg-purple-100 px-2 py-1 rounded text-[#6b21a8]">{recompensa.quantidade_disponivel} disponíveis</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-3">
                        <button
                          onClick={() => handleEditRecompensa(recompensa)}
                          className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                          title="Editar"
                        >
                          <Edit2 className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRecompensa(recompensa.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                          title="Deletar"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
