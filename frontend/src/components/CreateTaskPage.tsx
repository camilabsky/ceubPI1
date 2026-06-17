import { useState } from 'react';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CreateTaskPageProps {
  onBack: () => void;
  onCreated: () => void;
}

interface TaskFormState {
  titulo: string;
  descricao: string;
  horta: string;
  tipo: string;
  dificuldade: number;
  moedas: number;
  mudas: number;
  tempo: number;
}

const initialForm: TaskFormState = {
  titulo: '',
  descricao: '',
  horta: '',
  tipo: 'Manutenção',
  dificuldade: 0,
  moedas: 50,
  mudas: 0,
  tempo: 30,
};

export default function CreateTaskPage({ onBack, onCreated }: CreateTaskPageProps) {
  const [form, setForm] = useState<TaskFormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <K extends keyof TaskFormState>(key: K, value: TaskFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.titulo.trim() || !form.descricao.trim() || !form.horta.trim()) {
      toast.error('Preencha titulo, descricao e horta.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:8080/criar_tarefa', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ error: 'Falha ao criar tarefa' }));
        throw new Error(errorBody.error || 'Falha ao criar tarefa');
      }

      toast.success('Tarefa criada com sucesso!');
      onCreated();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao criar tarefa';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
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
        <h1 className="text-[16px] text-neutral-950 font-bold">Nova Tarefa</h1>
        <div className="w-14" />
      </div>

      <div className="bg-white rounded-[14px] border border-gray-200 p-5">
        <div className="bg-gradient-to-br from-[#00a63e] to-[#008236] rounded-xl p-4 mb-5">
          <p className="text-white text-[16px] font-semibold">Cadastro de tarefa</p>
          <p className="text-white/90 text-[13px] mt-1">Adicione tarefas para aparecerem na aba de tarefas disponiveis.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] text-[#4a5565] mb-1">Titulo</label>
            <input
              value={form.titulo}
              onChange={(e) => updateField('titulo', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#00a63e]"
              placeholder="Ex: Revisar canteiro de alface"
            />
          </div>

          <div>
            <label className="block text-[13px] text-[#4a5565] mb-1">Descricao</label>
            <textarea
              value={form.descricao}
              onChange={(e) => updateField('descricao', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#00a63e] min-h-20"
              placeholder="Descreva o que deve ser feito"
            />
          </div>

          <div>
            <label className="block text-[13px] text-[#4a5565] mb-1">Horta</label>
            <input
              value={form.horta}
              onChange={(e) => updateField('horta', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#00a63e]"
              placeholder="Ex: Horta Comunitaria Centro"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] text-[#4a5565] mb-1">Tipo</label>
              <select
                value={form.tipo}
                onChange={(e) => updateField('tipo', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#00a63e]"
              >
                <option>Manutenção</option>
                <option>Plantio</option>
                <option>colheita</option>
                <option>compostagem</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] text-[#4a5565] mb-1">Dificuldade</label>
              <select
                value={form.dificuldade}
                onChange={(e) => updateField('dificuldade', Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#00a63e]"
              >
                <option value={0}>Facil</option>
                <option value={1}>Medio</option>
                <option value={2}>Dificil</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[13px] text-[#4a5565] mb-1">Moedas</label>
              <input
                type="number"
                min={0}
                value={form.moedas}
                onChange={(e) => updateField('moedas', Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#00a63e]"
              />
            </div>
            <div>
              <label className="block text-[13px] text-[#4a5565] mb-1">Mudas</label>
              <input
                type="number"
                min={0}
                value={form.mudas}
                onChange={(e) => updateField('mudas', Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#00a63e]"
              />
            </div>
            <div>
              <label className="block text-[13px] text-[#4a5565] mb-1">Tempo (min)</label>
              <input
                type="number"
                min={1}
                value={form.tempo}
                onChange={(e) => updateField('tempo', Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#00a63e]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#00a63e] text-white text-[14px] py-3 rounded-lg hover:bg-[#008236] transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            <PlusCircle className="size-4" />
            {isSubmitting ? 'Salvando...' : 'Cadastrar tarefa'}
          </button>
        </form>
      </div>
    </div>
  );
}
