import { useState, useRef } from 'react';
import { Sprout, Eye, EyeOff, User, Mail, Lock, UserPlus, Leaf, Trophy, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import hortaLoginImg from '../assets/hortalogin.png';
import { apenasDigitos, formatarTelefone, telefoneValido } from '../lib/telefone';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

const inputBase =
  'w-full border border-[#E2E8E3] rounded-lg pl-10 py-2.5 text-[14px] outline-none focus:border-[#16A34A]';
const UFS = new Set(['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']);

export default function RegisterPage({ onSwitchToLogin }: RegisterPageProps) {
  const { register, isAuthenticating } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const enviando = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim() || !uf.trim() || !senha) {
      toast.error('Preencha nome, e-mail, UF e senha');
      return;
    }
    if (telefone.trim() && !telefoneValido(telefone)) { toast.error('Informe um telefone válido com DDD, ex.: (61) 99999-9999'); return; }
    if (cidade.trim().length > 100 || (cidade.trim() && !/^[\p{L}\p{M}][\p{L}\p{M}\s'.-]*$/u.test(cidade.trim()))) { toast.error('Informe uma cidade válida'); return; }
    if (!UFS.has(uf.trim().toUpperCase())) { toast.error('Informe uma UF brasileira válida'); return; }
    if (senha.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (enviando.current) return;
    enviando.current = true;
    try {
      await register(nome, email, senha, {
        telefone: telefone.trim() ? apenasDigitos(telefone) : '',
        cidade: cidade.trim(),
        uf: uf.trim().toUpperCase(),
      });
      toast.success('Cadastro realizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao cadastrar');
    } finally {
      enviando.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F7] flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-6xl bg-white rounded-[24px] shadow-xl overflow-hidden flex flex-col lg:flex-row lg:min-h-[680px]">
        {/* Painel da imagem (só desktop) */}
        <div
          className="hidden lg:flex lg:w-[38%] flex-col justify-between p-10 text-white relative bg-cover bg-center"
          style={{ backgroundImage: `url(${hortaLoginImg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/50" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="bg-[#16A34A] rounded-xl p-2">
                <Sprout className="size-5 text-white" />
              </div>
              <span className="text-lg font-semibold">Horta Comunitária</span>
            </div>
            <h1 className="text-3xl font-bold leading-tight mb-1">Cultivando pessoas,</h1>
            <h1 className="text-3xl font-bold leading-tight mb-4">cuidando da comunidade.</h1>
            <p className="text-sm text-white/90 max-w-xs">
              Participe de missões, conquiste recompensas e faça parte de um futuro mais sustentável.
            </p>
          </div>

          <div className="relative z-10 space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <span className="bg-[#16A34A] rounded-full p-2"><Leaf className="size-4" /></span>
              <div>
                <p className="font-semibold">Participe de missões</p>
                <p className="text-white/80 text-xs">e aprenda na prática</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-[#16A34A] rounded-full p-2"><Trophy className="size-4" /></span>
              <div>
                <p className="font-semibold">Conquiste recompensas</p>
                <p className="text-white/80 text-xs">e evolua seu nível</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-[#16A34A] rounded-full p-2"><Users className="size-4" /></span>
              <div>
                <p className="font-semibold">Conecte-se com pessoas</p>
                <p className="text-white/80 text-xs">que compartilham o mesmo propósito</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="w-full lg:w-[62%] flex items-center justify-center px-6 py-10 lg:p-10">
            <div className="w-full max-w-sm">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-[#16A34A] rounded-xl p-3">
                  <Sprout className="size-7 text-white" />
                </div>
              </div>

              <h2 className="text-[24px] text-[#17201A] font-bold mb-2 text-center">Criar sua conta</h2>
              <p className="text-[14px] text-[#66736A] mb-6 text-center">
                Entre para a plataforma e faça parte da nossa comunidade de hortas.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[13px] text-[#4a5565] mb-2">Nome completo *</label>
                  <div className="relative">
                    <User className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#66736A]" />
                    <input
                      type="text"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className={`${inputBase} pr-4`}
                      placeholder="Seu nome completo"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] text-[#4a5565] mb-2">E-mail *</label>
                  <div className="relative">
                    <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#66736A]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${inputBase} pr-4`}
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] text-[#4a5565] mb-2">Telefone <span className="text-[#849087]">(opcional)</span></label>
                  <input type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={15} value={telefone} onChange={(e) => setTelefone(formatarTelefone(e.target.value))} className={`${inputBase} px-3`} placeholder="(61) 99999-9999" />
                </div>

                <div className="grid grid-cols-[1fr_5rem] gap-2">
                  <div><label className="block text-[13px] text-[#4a5565] mb-2">Cidade <span className="text-[#849087]">(opcional)</span></label><input maxLength={100} value={cidade} onChange={(e) => setCidade(e.target.value)} className={`${inputBase} px-3`} placeholder="Sua cidade" /></div>
                  <div><label className="block text-[13px] text-[#4a5565] mb-2">UF *</label><input required maxLength={2} value={uf} onChange={(e) => setUf(e.target.value.toUpperCase())} className={`${inputBase} px-3`} placeholder="DF" /></div>
                </div>

                <div>
                  <label className="block text-[13px] text-[#4a5565] mb-2">Senha *</label>
                  <div className="relative">
                    <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#66736A]" />
                    <input
                      type={showSenha ? 'text' : 'password'}
                      required
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      className={`${inputBase} pr-10`}
                      placeholder="Crie uma senha"
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
                  disabled={isAuthenticating}
                  className="w-full bg-[#16A34A] text-white text-[14px] py-3 rounded-lg hover:bg-[#166534] transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 font-semibold"
                >
                  <UserPlus className="size-4" />
                  {isAuthenticating ? 'Criando conta...' : 'Criar minha conta'}
                </button>
              </form>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-[#E2E8E3]" />
                <span className="text-[12px] text-[#66736A]">ou</span>
                <div className="flex-1 h-px bg-[#E2E8E3]" />
              </div>

              <button
                type="button"
                onClick={onSwitchToLogin}
                className="w-full text-center text-[13px] text-[#66736A] hover:underline"
              >
                Já possui uma conta? <span className="font-semibold text-[#16A34A]">Entrar</span>
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}
