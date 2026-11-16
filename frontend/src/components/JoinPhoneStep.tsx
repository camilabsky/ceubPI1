import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { isValidPhone } from '../lib/contact';

interface JoinPhoneStepProps {
  onJoin: (telefone?: string) => void;
  onSkip: () => void;
  busy: boolean;
  serverError: string;
}

export default function JoinPhoneStep({ onJoin, onSkip, busy, serverError }: JoinPhoneStepProps) {
  const [telefone, setTelefone] = useState('');
  const [erro, setErro] = useState('');

  const entrar = (event: React.FormEvent) => {
    event.preventDefault();
    const valor = telefone.trim();
    if (valor && !isValidPhone(valor)) {
      setErro('Informe um telefone válido ou toque em Pular');
      return;
    }
    setErro('');
    onJoin(valor || undefined);
  };

  const mensagem = erro || serverError;

  return (
    <form onSubmit={entrar} noValidate>
      <p className="text-[13px] text-[#34453a]">Quer deixar um telefone? O administrador da horta pode precisar falar com você.</p>
      <label htmlFor="join-telefone" className="sr-only">Telefone</label>
      <input
        id="join-telefone"
        type="tel"
        autoComplete="tel"
        value={telefone}
        onChange={(event) => { setTelefone(event.target.value); setErro(''); }}
        placeholder="(61) 99999-9999 (opcional)"
        className="mt-2 h-11 w-full rounded-xl border border-[#d7e5da] px-3 text-[13px] outline-none focus:border-[#42a765]"
        aria-invalid={Boolean(mensagem)}
      />
      {mensagem && <p className="mt-1 text-[12px] text-red-600" role="alert">{mensagem}</p>}
      <div className="mt-3 flex gap-2">
        <button type="submit" disabled={busy} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#168a3c] text-[13px] font-semibold text-white transition hover:bg-[#117331] disabled:opacity-60">
          {busy && <LoaderCircle className="size-4 animate-spin" />}{busy ? 'Entrando...' : 'Entrar na horta'}
        </button>
        <button type="button" onClick={onSkip} disabled={busy} className="h-11 flex-1 rounded-xl border border-[#d7e5da] bg-white text-[13px] font-semibold text-[#34453a] hover:bg-[#f3faf4] disabled:opacity-60">
          Pular
        </button>
      </div>
    </form>
  );
}
