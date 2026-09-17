import {User,ShieldCheck,ClipboardList,CheckCircle,Sprout,LogOut,Mail,Lock,ChevronRight} from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Task {
  id: number;
  titulo: string;
  tipo: string;
  dificuldade: number;
  moedas: number;
  concluido?: boolean;
}

interface AdminProfilePageProps {
  onLogout?: () => void;
}

export default function AdminProfilePage({
  onLogout,
}: AdminProfilePageProps) {
  const { logout, token, user, updateUser, updatePassword, } = useAuth();

  const [adminTasks, setAdminTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.nome || '');
  const [isSavingName, setIsSavingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!token) return;

      setIsLoading(true);

      try {
        const tasksRes = await fetch('http://localhost:8080/admin/tarefas', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!tasksRes.ok) {
          throw new Error('Falha ao carregar tarefas');
        }

        const tasksData: Task[] = await tasksRes.json();
        setAdminTasks(tasksData);
      } catch (error) {
        console.error('Erro ao carregar dados administrativos:', error);
        toast.error('Erro ao carregar estatísticas da horta');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [token]);

  const hortaNome =
    user?.roles?.find((role) => role.role === 'ADMIN')?.horta_nome ||
    'Sua horta';

  const tarefasPendentes = adminTasks.filter(
    (task) => !task.concluido
  ).length;

  const tarefasConcluidas = adminTasks.filter(
    (task) => task.concluido
  ).length;

  const mudasPlantadas = '—';

  //Alterar senha do usuário 
  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setIsSavingPassword(true);

    try {
      await updatePassword(currentPassword, newPassword);

      toast.success('Senha alterada com sucesso');

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsEditingPassword(false);
    } catch (error) {
      console.error('Erro ao alterar senha:', error);

      toast.error(
        error instanceof Error
          ? error.message
          : 'Erro ao alterar senha'
      );
    } finally {
      setIsSavingPassword(false);
    }
  };
  
  // alterar e-mail do usuário
  const handleSaveEmail = async () => {
    const email = newEmail.trim();

    if (!email || !email.includes('@')) {
      toast.error('Informe um e-mail válido');
      return;
    }

    setIsSavingEmail(true);

    try {
      await updateUser({ email });

      toast.success('E-mail atualizado com sucesso');
      setIsEditingEmail(false);
    } catch (error) {
      console.error('Erro ao atualizar e-mail:', error);

      toast.error(
        error instanceof Error
          ? error.message
          : 'Erro ao atualizar e-mail'
      );
    } finally {
      setIsSavingEmail(false);
    }
  };

  // alterar nome do usuário
  const handleSaveName = async () => {
  if (!newName.trim()) {
    toast.error('Informe um nome válido');
    return;
  }

  setIsSavingName(true);

  try {
    await updateUser({ nome: newName.trim() });

    toast.success('Nome atualizado com sucesso');
    setIsEditingName(false);
  } catch (error) {
    console.error('Erro ao atualizar nome:', error);
    toast.error(
      error instanceof Error
        ? error.message
        : 'Erro ao atualizar nome'
    );
  } finally {
    setIsSavingName(false);
  }
};

  const handleLogout = () => {
    logout();
    onLogout?.();
  };

  return (
  <div className="min-h-screen bg-gray-50 pt-16 pb-6">
    {/* Cabeçalho */}
    <div className="px-4 mb-6">
      <div className="bg-gradient-to-br from-[#00a63e] to-[#008236] rounded-[20px] p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="size-4 text-white/90" />

          <span className="text-white/90 text-[12px] font-semibold tracking-wide uppercase">
            Perfil administrativo
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="size-16 rounded-full bg-white/20 flex items-center justify-center">
            <User className="size-8" />
          </div>

          <div>
            <h1 className="text-[21px] font-semibold">
              {user?.nome || 'Administrador'}
            </h1>

            <p className="text-white/90 text-[13px] mt-1">
              {hortaNome}
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Estatísticas */}
    <div className="px-4 mb-6">
      <h2 className="text-[16px] font-semibold text-neutral-950 mb-4 px-2">
        Estatísticas da horta
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-[14px] border border-gray-200 p-4 flex flex-col items-center">
          <ClipboardList className="size-6 text-[#f0b100] mb-2" />

          <p className="text-[24px] font-semibold text-neutral-950 mb-1">
            {isLoading ? '—' : tarefasPendentes}
          </p>

          <p className="text-[11px] text-[#4a5565] text-center">
            Tarefas pendentes
          </p>
        </div>

        <div className="bg-white rounded-[14px] border border-gray-200 p-4 flex flex-col items-center">
          <CheckCircle className="size-6 text-[#00a63e] mb-2" />

          <p className="text-[24px] font-semibold text-neutral-950 mb-1">
            {isLoading ? '—' : tarefasConcluidas}
          </p>

          <p className="text-[11px] text-[#4a5565] text-center">
            Tarefas concluídas
          </p>
        </div>

        <div className="bg-white rounded-[14px] border border-gray-200 p-4 flex flex-col items-center">
          <Sprout className="size-6 text-[#16a34a] mb-2" />

          <p className="text-[24px] font-semibold text-neutral-950 mb-1">
            {mudasPlantadas}
          </p>

          <p className="text-[11px] text-[#4a5565] text-center">
            Mudas plantadas
          </p>
        </div>

        <div className="bg-white rounded-[14px] border border-gray-200 p-4 flex flex-col items-center">
          <ClipboardList className="size-6 text-[#64748b] mb-2" />

          <p className="text-[24px] font-semibold text-neutral-950 mb-1">
            {isLoading ? '—' : adminTasks.length}
          </p>

          <p className="text-[11px] text-[#4a5565] text-center">
            Total de tarefas
          </p>
        </div>
      </div>
    </div>

    {/* Informações da conta */}
    <div className="px-4 mb-6">
      <h2 className="text-[16px] font-semibold text-neutral-950 mb-4 px-2">
        Informações da conta
      </h2>

      <div className="bg-white rounded-[14px] border border-gray-200 overflow-hidden">
        {/* Nome */}
        <div className="p-4 border-b border-gray-100">
          {!isEditingName ? (
            <button
              type="button"
              onClick={() => {
                setNewName(user?.nome || '');
                setIsEditingName(true);
              }}
              className="w-full flex items-center gap-3 text-left"
            >
              <div className="size-9 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="size-5 text-gray-600" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-gray-500">
                  Nome
                </p>

                <p className="text-[14px] text-neutral-950 truncate">
                  {user?.nome || 'Não informado'}
                </p>
              </div>

              <ChevronRight className="size-5 text-gray-400" />
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="size-5 text-gray-600" />
                </div>

                <p className="text-[14px] font-medium text-neutral-950">
                  Alterar nome
                </p>
              </div>

              <input
                type="text"
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
                placeholder="Digite seu novo nome"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-green-500"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  disabled={isSavingName}
                  className="flex-1 rounded-lg border border-gray-300 py-2 text-[13px] text-gray-700"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleSaveName}
                  disabled={isSavingName}
                  className="flex-1 rounded-lg bg-[#00a63e] py-2 text-[13px] text-white disabled:opacity-60"
                >
                  {isSavingName ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* E-mail */}
        <div className="p-4 border-b border-gray-100">
          {!isEditingEmail ? (
            <button
              type="button"
              onClick={() => {
                setNewEmail(user?.email || '');
                setIsEditingEmail(true);
              }}
              className="w-full flex items-center gap-3 text-left"
            >
              <div className="size-9 rounded-full bg-gray-100 flex items-center justify-center">
                <Mail className="size-5 text-gray-600" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-gray-500">
                  E-mail
                </p>

                <p className="text-[14px] text-neutral-950 truncate">
                  {user?.email || 'Não informado'}
                </p>
              </div>

              <ChevronRight className="size-5 text-gray-400" />
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-gray-100 flex items-center justify-center">
                  <Mail className="size-5 text-gray-600" />
                </div>

                <p className="text-[14px] font-medium text-neutral-950">
                  Alterar e-mail
                </p>
              </div>

              <input
                type="email"
                value={newEmail}
                onChange={(event) => setNewEmail(event.target.value)}
                placeholder="Digite seu novo e-mail"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-green-500"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingEmail(false)}
                  disabled={isSavingEmail}
                  className="flex-1 rounded-lg border border-gray-300 py-2 text-[13px] text-gray-700"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleSaveEmail}
                  disabled={isSavingEmail}
                  className="flex-1 rounded-lg bg-[#00a63e] py-2 text-[13px] text-white disabled:opacity-60"
                >
                  {isSavingEmail ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Senha */}
        <div className="p-4">
          {!isEditingPassword ? (
            <button
              type="button"
              onClick={() => setIsEditingPassword(true)}
              className="w-full flex items-center gap-3 text-left"
            >
              <div className="size-9 rounded-full bg-gray-100 flex items-center justify-center">
                <Lock className="size-5 text-gray-600" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-gray-500">
                  Senha
                </p>

                <p className="text-[14px] text-neutral-950">
                  Alterar senha
                </p>
              </div>

              <ChevronRight className="size-5 text-gray-400" />
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-gray-100 flex items-center justify-center">
                  <Lock className="size-5 text-gray-600" />
                </div>

                <p className="text-[14px] font-medium text-neutral-950">
                  Alterar senha
                </p>
              </div>

              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder="Senha atual"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Nova senha"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirme a nova senha"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-green-500"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setIsEditingPassword(false);
                  }}
                  disabled={isSavingPassword}
                  className="flex-1 rounded-lg border border-gray-300 py-2 text-[13px] text-gray-700"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleSavePassword}
                  disabled={isSavingPassword}
                  className="flex-1 rounded-lg bg-[#00a63e] py-2 text-[13px] text-white disabled:opacity-60"
                >
                  {isSavingPassword ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Botão sair */}
    <div className="px-4">
      <button
        type="button"
        onClick={handleLogout}
        className="w-full bg-white border border-gray-200 rounded-[14px] py-3 px-4 flex items-center justify-center gap-2 text-[#4a5565] hover:bg-gray-50 transition-colors"
      >
        <LogOut className="size-5" />

        <span className="text-[14px]">
          Sair da conta
        </span>
      </button>
    </div>
  </div>
);
}