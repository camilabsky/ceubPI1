import { useState } from 'react';
import { LogIn, Sprout } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) {
      toast.error('Preencha email e senha');
      return;
    }

    try {
      await login(email, senha);
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      toast.error('Email ou senha invalidos');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00a63e] to-[#008236] flex items-center justify-center px-4">
      <div className="bg-white rounded-[20px] p-8 max-w-md w-full shadow-xl">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-[#00a63e] rounded-full p-3">
            <Sprout className="size-8 text-white" />
          </div>
        </div>

        <h1 className="text-[24px] text-neutral-950 font-bold text-center mb-2">
          Horta Comunitária
        </h1>
        <p className="text-[14px] text-[#717182] text-center mb-8">
          Cultive sua comunidade e conquiste recompensas
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] text-[#4a5565] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] outline-none focus:border-[#00a63e]"
              placeholder="seu.email@example.com"
            />
          </div>

          <div>
            <label className="block text-[13px] text-[#4a5565] mb-2">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] outline-none focus:border-[#00a63e]"
              placeholder="Sua senha"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#00a63e] text-white text-[14px] py-3 rounded-lg hover:bg-[#008236] transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 font-semibold"
          >
            <LogIn className="size-4" />
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-[12px] text-[#717182] text-center mb-3">Dados de teste:</p>
          <div className="bg-gray-50 rounded-lg p-3 text-[12px] text-[#4a5565] space-y-1">
            <div><strong>Admin:</strong> admin@horta.local / admin123</div>
            <div><strong>Usuário:</strong> user@horta.local / user123</div>
          </div>
        </div>
      </div>
    </div>
  );
}
