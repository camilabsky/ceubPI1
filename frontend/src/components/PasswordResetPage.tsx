import { useState } from 'react';
import { Sprout, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function PasswordResetPage({ token }: { token: string }) {
  const { resetPassword, logout } = useAuth();
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmacao, setShowConfirmacao] = useState(false);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [concluido, setConcluido] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErro('');
    if (senha.length < 6) return setErro('A nova senha deve ter pelo menos 6 caracteres.');
    if (senha !== confirmacao) return setErro('As senhas não conferem.');
    setEnviando(true);
    try {
      await resetPassword(token, senha);
      logout();
      setConcluido(true);
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível redefinir a senha.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F9F7] p-4">
      <section className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center gap-2">
          <Sprout className="size-6 text-[#16A34A]" />
          <span className="text-lg font-semibold text-[#17201A]">Couve</span>
        </div>
        {concluido ? (
          <>
            <h1 className="text-xl font-bold text-[#17201A]">Senha redefinida</h1>
            <p className="mt-2 text-sm text-[#66736A]">Agora você pode entrar com sua nova senha.</p>
            <button
              type="button"
              onClick={() => window.location.replace(window.location.pathname)}
              className="mt-5 w-full rounded-lg bg-[#16A34A] py-3 text-sm font-semibold text-white hover:bg-[#166534] transition-colors"
            >
              Voltar ao login
            </button>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-[#17201A]">Criar nova senha</h1>
            <p className="mt-2 text-sm text-[#66736A]">O link é válido por 30 minutos e pode ser usado uma única vez.</p>
            <form onSubmit={submit} className="mt-5 space-y-4">
              <div>
                <label className="block text-[13px] text-[#4a5565] mb-2">Nova senha</label>
                <div className="relative">
                  <input
                    type={showSenha ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    className="w-full border border-[#E2E8E3] rounded-lg px-4 py-2.5 pr-10 text-[14px] outline-none focus:border-[#16A34A]"
                    placeholder="Mínimo de 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSenha((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#66736A]"
                    tabIndex={-1}
                    aria-label={showSenha ? 'Ocultar nova senha' : 'Exibir nova senha'}
                  >
                    {showSenha ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[13px] text-[#4a5565] mb-2">Confirmar nova senha</label>
                <div className="relative">
                  <input
                    type={showConfirmacao ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={confirmacao}
                    onChange={(event) => setConfirmacao(event.target.value)}
                    className="w-full border border-[#E2E8E3] rounded-lg px-4 py-2.5 pr-10 text-[14px] outline-none focus:border-[#16A34A]"
                    placeholder="Confirme a nova senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmacao((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#66736A]"
                    tabIndex={-1}
                    aria-label={showConfirmacao ? 'Ocultar confirmação de nova senha' : 'Exibir confirmação de nova senha'}
                  >
                    {showConfirmacao ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {erro && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-800">{erro}</p>}
              <button
                type="submit"
                disabled={enviando}
                className="w-full rounded-lg bg-[#16A34A] py-3 text-sm font-semibold text-white hover:bg-[#166534] transition-colors disabled:opacity-60"
              >
                {enviando ? 'Salvando…' : 'Redefinir senha'}
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
