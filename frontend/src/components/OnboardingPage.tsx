import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Leaf, Home, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import HortaFields, { HORTA_VAZIA, payloadHorta, validarHorta, type HortaDraft } from './HortaFields';


const RASCUNHO = 'rascunho_horta';

export default function OnboardingPage() {
  const { token, user, applyUser, logout } = useAuth();
  const [view, setView] = useState<'choose' | 'create' | 'auto'>(() =>
    sessionStorage.getItem(RASCUNHO) ? 'auto' : 'choose'
  );
  const [horta, setHorta] = useState<HortaDraft>(HORTA_VAZIA);
  const [saving, setSaving] = useState(false);
  const started = useRef(false);

  const enviar = async (d: HortaDraft): Promise<boolean> => {
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
        return false;
      }
      if (!res.ok) {
        toast.error(data.error || 'Erro ao criar horta');
        return false;
      }
      toast.success('Horta criada!');
      applyUser(data.user);
      return true;
    } catch {
      toast.error('Erro de conexão ao criar horta');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Rascunho vindo do cadastro: envia sozinho e, se falhar, abre o formulário preenchido
  useEffect(() => {
    if (view !== 'auto' || started.current || !token) return;
    started.current = true;
    const raw = sessionStorage.getItem(RASCUNHO);
    sessionStorage.removeItem(RASCUNHO);
    let d: HortaDraft = HORTA_VAZIA;
    try {
      d = JSON.parse(raw ?? '');
    } catch {
      /* rascunho inválido: cai no formulário vazio */
    }
    setHorta(d);
    if (validarHorta(d)) {
      setView('create');
      return;
    }
    enviar(d).then((ok) => {
      if (!ok) setView('create');
    });
  }, [view, token]);

  const criarHorta = async () => {
    const erro = validarHorta(horta);
    if (erro) return toast.error(erro);
    await enviar(horta);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        {view === 'auto' && (
          <div className="flex flex-col items-center gap-3 py-10">
            <Loader2 className="size-8 animate-spin text-[#16A34A]" />
            <p className="text-[14px] text-[#4a5565]">Criando sua horta...</p>
          </div>
        )}

        {view === 'choose' && (
          <>
            <h1 className="text-[22px] font-semibold text-[#030213]">
              Olá, {user?.nome?.split(' ')[0]}! Como você quer participar?
            </h1>
            <p className="mt-1 text-[14px] text-[#4a5565]">Escolha o caminho que mais combina com você.</p>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => toast.info('Explorar hortas chega em breve')}
                className="flex w-full items-center gap-4 rounded-xl border border-[#16A34A]/30 bg-[#f0fdf4] p-4 text-left hover:border-[#16A34A]"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-[#dcfce7]">
                  <Leaf className="size-5 text-[#16A34A]" />
                </span>
                <span className="flex-1">
                  <span className="block text-[15px] font-semibold text-[#030213]">Participar de uma horta</span>
                  <span className="block text-[13px] text-[#4a5565]">
                    Encontre uma horta, participe de missões e conquiste recompensas.
                  </span>
                </span>
                <ArrowRight className="size-4 text-[#16A34A]" />
              </button>

              <button
                onClick={() => setView('create')}
                className="flex w-full items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left hover:border-[#16A34A]"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-[#dcfce7]">
                  <Home className="size-5 text-[#16A34A]" />
                </span>
                <span className="flex-1">
                  <span className="block text-[15px] font-semibold text-[#030213]">Criar uma horta</span>
                  <span className="block text-[13px] text-[#4a5565]">
                    Cadastre sua horta, convide pessoas e gerencie as atividades.
                  </span>
                </span>
                <ArrowRight className="size-4 text-[#16A34A]" />
              </button>
            </div>

            <button onClick={logout} className="mt-6 text-[13px] text-[#4a5565] underline">
              Sair
            </button>
          </>
        )}

        {view === 'create' && (
          <>
            <button
              onClick={() => setView('choose')}
              className="mb-4 flex items-center gap-1 text-[13px] text-[#4a5565] hover:text-[#030213]"
            >
              <ArrowLeft className="size-4" /> Voltar
            </button>
            <h1 className="text-[22px] font-semibold text-[#030213]">Criar uma horta</h1>
            <p className="mt-1 mb-6 text-[14px] text-[#4a5565]">Você será o administrador dela.</p>

            <HortaFields value={horta} onChange={setHorta} />

            <button
              onClick={criarHorta}
              disabled={saving}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#16A34A] py-3 text-[14px] font-semibold text-white hover:bg-[#166534] disabled:opacity-60"
            >
              {saving && <Loader2 className="size-4 animate-spin" />}
              Criar horta
            </button>
          </>
        )}
      </div>
    </div>
  );
}