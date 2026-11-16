import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import HortaFields, { HORTA_VAZIA, payloadHorta, validarHorta, type HortaDraft } from './HortaFields';

interface CreateGardenPageProps {
  onBack: () => void;
  onCreated: () => void;
}

export default function CreateGardenPage({ onBack, onCreated }: CreateGardenPageProps) {
  const { token, applyUser, availableGardens, selectGarden } = useAuth();
  const [horta, setHorta] = useState<HortaDraft>(HORTA_VAZIA);
  const [confirmarCriacao, setConfirmarCriacao] = useState(false);
  const [saving, setSaving] = useState(false);
  const [criada, setCriada] = useState<number | null>(null);

  // Só dá pra selecionar a horta nova depois que o usuário atualizado chega no contexto.
  useEffect(() => {
    if (criada == null || !availableGardens.some((garden) => garden.id === criada)) return;
    selectGarden(criada, 'ADMIN');
    onCreated();
  }, [criada, availableGardens]);

  const enviar = async (d: HortaDraft) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/hortas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payloadHorta(d)),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 409) {
        toast.error('Já existe uma horta com esse nome. Escolha outro.');
        return;
      }
      if (!res.ok) {
        toast.error(data.error || 'Erro ao criar horta');
        return;
      }
      toast.success('Horta criada!');
      applyUser(data.user);
      setCriada(data.id_horta);
    } catch {
      toast.error('Erro de conexão ao criar horta');
    } finally {
      setSaving(false);
    }
  };

  const criarHorta = async () => {
    const erro = validarHorta(horta, true);
    if (erro) return toast.error(erro);
    if (!confirmarCriacao) { setConfirmarCriacao(true); return; }
    await enviar(horta);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-8 pt-10 lg:px-6">
      <div className="mx-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-1 text-[13px] text-[#4a5565] hover:text-[#030213]"
        >
          <ArrowLeft className="size-4" /> Voltar
        </button>
        <h1 className="text-[22px] font-semibold text-[#030213]">Criar uma horta</h1>
        <p className="mt-1 mb-6 text-[14px] text-[#4a5565]">Você será o administrador dela.</p>

        <HortaFields value={horta} onChange={(draft) => { setHorta(draft); setConfirmarCriacao(false); }} mostrarDescricao permitirEnderecoSemCoordenadas />

        {confirmarCriacao && <div className="mt-4 rounded-lg bg-[#F0FDF4] p-4 text-[13px] text-[#34483a]"><h2 className="font-semibold">Confirme os dados da horta</h2><p className="mt-2"><strong>{horta.nome}</strong> — {horta.cidade}/{horta.uf.toUpperCase()}</p><p>{horta.endereco}</p><p>{horta.descricao}</p><p>Contato: {horta.contato}</p><button type="button" onClick={() => setConfirmarCriacao(false)} className="mt-2 text-[#16803d] underline">Editar dados</button></div>}

        <button
          onClick={criarHorta}
          disabled={saving || criada != null}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#16A34A] py-3 text-[14px] font-semibold text-white hover:bg-[#166534] disabled:opacity-60"
        >
          {saving && <Loader2 className="size-4 animate-spin" />}
          {confirmarCriacao ? 'Confirmar criação' : 'Revisar dados da horta'}
        </button>
      </div>
    </div>
  );
}
