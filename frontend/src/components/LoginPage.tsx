import { useState, useEffect, useRef } from 'react';
import { LogIn, Sprout, Eye, EyeOff, Trophy, Handshake, Leaf } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { GOOGLE_CLIENT_ID } from '../config';
import hortaLoginImg from '../assets/hortalogin.png';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

declare global {
  interface Window {
    google?: any;
  }
}

export default function LoginPage({ onSwitchToRegister }: LoginPageProps) {
  const { login, loginWithGoogle, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);

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

  const handleForgotPassword = () => {
    toast.info('Funcionalidade em breve');
  };

  useEffect(() => {
    const renderGoogleButton = () => {
      if (!window.google || !googleButtonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response: { credential: string }) => {
          try {
            await loginWithGoogle(response.credential);
            toast.success('Login realizado com sucesso!');
          } catch (error) {
            toast.error('Nao foi possivel entrar com Google');
          }
        },
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 328,
        text: 'signin_with',
      });
    };

    if (window.google) {
      renderGoogleButton();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          renderGoogleButton();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [loginWithGoogle]);

  return (
    <div className="min-h-screen bg-[#F7F9F7] flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-[24px] shadow-xl overflow-hidden flex flex-col lg:flex-row">
        <div
          className="hidden lg:flex lg:w-1/2 flex-col justify-between p-10 text-white relative bg-cover bg-center"
          style={{ backgroundImage: `url(${hortaLoginImg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/10" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="bg-[#16A34A] rounded-xl p-2">
                <Sprout className="size-5 text-white" />
              </div>
              <span className="text-lg font-semibold">Horta Comunitária</span>
            </div>
            <h1 className="text-3xl font-bold leading-tight mb-1">
              Cultivando pessoas,
            </h1>
            <h1 className="text-3xl font-bold leading-tight">
              cuidando da comunidade.
            </h1>
          </div>

          <div className="relative z-10 space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="bg-[#16A34A] rounded-full p-1"><Leaf className="size-3" /></span>
              Mais que uma horta, uma comunidade
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-[#16A34A] rounded-full p-1"><Trophy className="size-3" /></span>
              Missões e recompensas
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-[#16A34A] rounded-full p-1"><Handshake className="size-3" /></span>
              Juntos por um futuro mais sustentável
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 h-full flex items-center justify-center px-6 py-10 lg:p-12 overflow-y-auto">
          <div className="w-full max-w-sm">
            <div className="lg:hidden flex items-center justify-center mb-6">
              <div className="bg-[#16A34A] rounded-xl p-3">
                <Sprout className="size-8 text-white" />
              </div>
            </div>

            <h2 className="text-[24px] text-[#17201A] font-bold mb-2">
              Acesse sua conta
            </h2>
            <p className="text-[14px] text-[#66736A] mb-8">
              Entre para acompanhar suas atividades e fazer parte da nossa comunidade.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] text-[#4a5565] mb-2">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[#E2E8E3] rounded-lg px-4 py-2.5 text-[14px] outline-none focus:border-[#16A34A]"
                  placeholder="seu.email@example.com"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[13px] text-[#4a5565]">Senha</label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[12px] text-[#16A34A] hover:underline"
                  >
                    Esqueci minha senha?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showSenha ? 'text' : 'password'}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full border border-[#E2E8E3] rounded-lg px-4 py-2.5 pr-10 text-[14px] outline-none focus:border-[#16A34A]"
                    placeholder="Sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSenha((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#66736A]"
                    tabIndex={-1}
                  >
                    {showSenha ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#16A34A] text-white text-[14px] py-3 rounded-lg hover:bg-[#166534] transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 font-semibold"
              >
                <LogIn className="size-4" />
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[#E2E8E3]" />
              <span className="text-[12px] text-[#66736A]">ou</span>
              <div className="flex-1 h-px bg-[#E2E8E3]" />
            </div>

            <div ref={googleButtonRef} className="flex justify-center" />

            <button
              type="button"
              onClick={onSwitchToRegister}
              className="w-full text-center text-[13px] text-[#66736A] mt-6 hover:underline"
            >
              Ainda não possui uma conta? <span className="font-semibold text-[#16A34A]">Criar conta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}