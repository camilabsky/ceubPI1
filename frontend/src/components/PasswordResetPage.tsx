import { useState } from 'react';
import { Sprout } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function PasswordResetPage({ token }: { token: string }) {
  const { resetPassword, logout } = useAuth();
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
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

  return <main className="flex min-h-screen items-center justify-center bg-[#F7F9F7] p-4">
    <section className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
      <div className="mb-5 flex items-center gap-2"><Sprout className="size-6 text-[#16A34A]" /><span className="text-lg font-semibold text-[#17201A]">Couve</span></div>
      {concluido ? <>
        <h1 className="text-xl font-bold text-[#17201A]">Senha redefinida</h1>
        <p className="mt-2 text-sm text-[#66736A]">Agora você pode entrar com sua nova senha.</p>
        <button type="button" onClick={() => window.location.replace(window.location.pathname)} className="mt-5 w-full rounded-lg bg-[#16A34A] py-3 text-sm font-semibold text-white">Voltar ao login</button>
      </> : <>
        <h1 className="text-xl font-bold text-[#17201A]">Criar nova senha</h1>
        <p className="mt-2 text-sm text-[#66736A]">O link é válido por 30 minutos e pode ser usado uma única vez.</p>
        <form onSubmit={submit} className="mt-5 space-y-3">
          <label className="block text-[13px] text-[#4a5565]">Nova senha
            <input type="password" autoComplete="new-password" required minLength={6} value={senha} onChange={(event) => setSenha(event.target.value)} className="mt-1 w-full rounded-lg border border-[#E2E8E3] px-3 py-2.5 text-sm outline-none focus:border-[#16A34A]" />
          </label>
          <label className="block text-[13px] text-[#4a5565]">Confirmar nova senha
            <input type="password" autoComplete="new-password" required minLength={6} value={confirmacao} onChange={(event) => setConfirmacao(event.target.value)} className="mt-1 w-full rounded-lg border border-[#E2E8E3] px-3 py-2.5 text-sm outline-none focus:border-[#16A34A]" />
          </label>
          {erro && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-800">{erro}</p>}
          <button type="submit" disabled={enviando} className="w-full rounded-lg bg-[#16A34A] py-3 text-sm font-semibold text-white disabled:opacity-60">{enviando ? 'Salvando…' : 'Redefinir senha'}</button>
        </form>
      </>}
    </section>
  </main>;
}
